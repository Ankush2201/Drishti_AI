"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Plot from "react-plotly.js";

interface DashboardData {
  is_reliable: boolean;
  message: string;
  domain: string;
  whois_info: Record<string, string>;
  media_details: Record<string, string>;
  social_media_stats: {
    reddit_mentions: number;
  };
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchType = searchParams.get("searchType") || "";
  const sources = searchParams.get("sources") || "";

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // Only hit the backend if the search is based on a website URL and
    // "reddit" is one of the selected sources.
    if (searchType === "website" && sources.includes("reddit") && query) {
      setLoading(true);
      // Here we call the backend endpoint which expects a website URL.
      // (If you need a POST, you can change this fetch call accordingly.)
      fetch(`http://localhost:8000/check_news?url=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error fetching data from the backend");
          }
          return res.json();
        })
        .then((data: DashboardData) => {
          setDashboardData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load data: " + err.message);
          setLoading(false);
        });
    }
  }, [query, searchType, sources]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-red-500">{error}</div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto py-8 text-white">
        No dashboard data available. Please initiate a search.
      </div>
    );
  }

  // For demonstration, we use Plotly to plot the number of Reddit mentions.
  const redditMentions = dashboardData.social_media_stats.reddit_mentions;
  const layout = {
    title: "Reddit Mentions",
    xaxis: { title: "Metric" },
    yaxis: { title: "Count" },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Analysis for {dashboardData.domain}
      </h1>
      <p className="text-gray-300 mb-6">{dashboardData.message}</p>
      <div className="bg-gray-800 p-4 rounded">
        <Plot
          data={[
            {
              x: ["Reddit Mentions"],
              y: [redditMentions],
              type: "bar",
              marker: { color: "orange" },
            },
          ]}
          layout={layout}
          style={{ width: "100%", height: "400px" }}
          config={{ displayModeBar: false }}
        />
      </div>
    </div>
  );
}
