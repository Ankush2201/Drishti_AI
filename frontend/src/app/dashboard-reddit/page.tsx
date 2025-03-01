"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  PieController,
  DoughnutController,
  ArcElement,
  TimeScale,
  RadialLinearScale,
  ScatterController,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie, Line, Scatter } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  PieController,
  DoughnutController,
  ArcElement,
  TimeScale,
  RadialLinearScale,
  ScatterController,
  Tooltip,
  Legend,
  Title
);

// Extended interface with an optional posts field
interface DashboardData {
  is_reliable: boolean;
  message: string;
  domain: string;
  whois_info: Record<string, any>;
  media_details: Record<string, any>;
  social_media_stats: {
    reddit_mentions: number | string;
  };
  // Assuming the backend returns posts in Reddit's format:
  posts?: {
    data: {
      children: { data: any }[];
    };
  };
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchType = searchParams.get("searchType") || "";
  const sources = searchParams.get("sources") || "";

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  // Chart theme colors
  const colors = {
    background: "rgba(30, 41, 59, 0.8)", // Tailwind bg-gray-800 with transparency
    text: "#ffffff",
    grid: "rgba(255, 255, 255, 0.1)",
    reliable: "rgba(16, 185, 129, 0.7)", // Green with transparency
    unreliable: "rgba(239, 68, 68, 0.7)", // Red with transparency
    primary: "rgba(59, 130, 246, 0.7)", // Blue with transparency
    secondary: "rgba(139, 92, 246, 0.7)", // Purple with transparency
    accent1: "rgba(245, 158, 11, 0.7)", // Amber with transparency
    accent2: "rgba(236, 72, 153, 0.7)", // Pink with transparency
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: colors.text },
      },
      title: {
        display: true,
        color: colors.text,
      },
      tooltip: {
        backgroundColor: colors.background,
        titleColor: colors.text,
        bodyColor: colors.text,
      },
    },
    scales: {
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
      },
    },
  };

  useEffect(() => {
    // Only call the backend if the search is based on a website URL and "reddit" is selected.
    if (searchType === "website" && sources.includes("reddit") && query) {
      setLoading(true);
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

  // Process posts data if available
  const posts = dashboardData.posts
    ? dashboardData.posts.data.children.map((item) => item.data)
    : [];

  // 1. Posts per Subreddit (PieChart)
  const subredditCounts = posts.reduce((acc, post) => {
    const sub = post.subreddit || "Unknown";
    acc[sub] = (acc[sub] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const postsPerSubredditData = {
    labels: Object.keys(subredditCounts),
    datasets: [
      {
        data: Object.values(subredditCounts),
        backgroundColor: [
          colors.primary,
          colors.secondary,
          colors.reliable,
          colors.accent1,
          colors.accent2,
        ],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 2. Media Presence (PieChart)
  const withMedia = posts.filter((post) => post.media).length;
  const withoutMedia = posts.length - withMedia;
  const mediaPresenceData = {
    labels: ["With Media", "Without Media"],
    datasets: [
      {
        data: [withMedia, withoutMedia],
        backgroundColor: [colors.reliable, colors.unreliable],
        borderColor: colors.text,
        borderWidth: 1,
      },
    ],
  };

  // 3. Posts by Hour of Day (LineChart)
  const timeCounts: Record<string, number> = {};
  posts.forEach((post) => {
    // Assuming post.created is in seconds (epoch time)
    const date = new Date(post.created * 1000);
    const hour = date.getHours();
    timeCounts[hour] = (timeCounts[hour] || 0) + 1;
  });
  const timeLabels = Array.from({ length: 24 }, (_, i) => i.toString());
  const timeDataCounts = timeLabels.map((hour) => timeCounts[hour] || 0);
  const timeData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Posts",
        data: timeDataCounts,
        backgroundColor: "rgba(0, 0, 0, 0)", // transparent fill
        borderColor: colors.primary,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  // 4. Upvote Ratio vs Score (ScatterChart)
  const ratioScoreData = {
    datasets: [
      {
        label: "Posts",
        data: posts.map((post) => ({
          x: post.upvote_ratio || 0,
          y: post.score || 0,
        })),
        backgroundColor: colors.accent1,
        borderColor: colors.text,
      },
    ],
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Analysis for {dashboardData.domain}
      </h1>
      <p className="text-gray-300 mb-6">{dashboardData.message}</p>

      {/* 4 Important Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Posts Per Subreddit */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl text-white mb-2">Posts Per Subreddit</h3>
          <div className="h-64">
            <Pie
              data={postsPerSubredditData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Posts Per Subreddit",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Media Presence */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl text-white mb-2">Media Presence</h3>
          <div className="h-64">
            <Pie
              data={mediaPresenceData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Media Presence",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Posts by Hour of Day */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl text-white mb-2">Posts by Hour of Day</h3>
          <div className="h-64">
            <Line
              data={timeData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Posts by Hour of Day",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Upvote Ratio vs Score */}
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl text-white mb-2">Upvote Ratio vs Score</h3>
          <div className="h-64">
            <Scatter
              data={ratioScoreData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    ...chartOptions.plugins.title,
                    text: "Upvote Ratio vs Score",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
