"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, LoadingSpinner } from "./Icons";

interface SelectedSources {
  twitter: boolean;
  websites: boolean;
  mastodon: boolean;
}

interface SearchBarProps {
  selectedSources?: SelectedSources;
}

export default function SearchBar({ selectedSources }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("keyword");
  const [isLoading, setIsLoading] = useState(false);

  // Validate the search query based on the search type.
  let isQueryValid = false;
  const trimmedQuery = searchQuery.trim();

  if (trimmedQuery) {
    if (searchType === "keyword") {
      isQueryValid = true;
    } else if (searchType === "hashtag") {
      // Hashtag search: valid only if it starts with a "#"
      isQueryValid = trimmedQuery.startsWith("#");
    } else if (searchType === "website") {
      // Website search: validate using a regex that checks for a valid domain/URL.
      const websiteRegex =
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
      isQueryValid = websiteRegex.test(trimmedQuery);
    }
  }

  // The Analyze button is disabled if the query isn't valid or if it's loading.
  const isDisabled = isLoading || !isQueryValid;

  const handleSearch = async () => {
    if (!isQueryValid) return;

    // Determine sources:
    // If selectedSources are provided and at least one is selected, then use them.
    // Otherwise, fall back to default sources.
    let sources: string[] = [];
    if (
      selectedSources &&
      Object.values(selectedSources).some((selected) => selected)
    ) {
      sources = Object.entries(selectedSources)
        .filter(([_, isSelected]) => isSelected)
        .map(([source]) => source);
    } else {
      sources = ["twitter", "websites", "mastodon"];
    }

    setIsLoading(true);

    const queryString = new URLSearchParams({
      q: trimmedQuery,
      searchType,
      sources: sources.join(","),
    }).toString();

    try {
      router.push(`/dashboard?${queryString}`);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-16">
      <div className="flex">
        {/* Dropdown Selector */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-32 px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-l-xl focus:outline-none"
        >
          <option value="keyword">Keyword</option>
          <option value="hashtag">Hashtag</option>
          <option value="website">Website</option>
        </select>

        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Enter ${searchType} to analyze...`}
            className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-r-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleSearch}
          disabled={isDisabled}
          className={`ml-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 ${
            !isDisabled
              ? "hover:from-blue-700 hover:to-purple-700"
              : "disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isLoading ? <LoadingSpinner /> : "Analyze"}
        </button>
      </div>
    </div>
  );
}
