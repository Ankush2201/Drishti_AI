// src/app/page.tsx
import React from "react";
import { FaTwitter, FaGlobe, FaMastodon, FaSearch } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Analytics Hub
              </h1>
              <p className="text-sm text-gray-400">Unified Social Analytics</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="/about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="/docs"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Documentation
            </a>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Analyze Social Media{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Trends
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover insights across multiple platforms with our advanced
              analytics tools
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter keywords to analyze..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent backdrop-blur-sm
                         transition-all duration-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 
                               px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 
                               text-white rounded-lg hover:from-blue-700 hover:to-purple-700 
                               transition-all duration-300">
                Analyze
              </button>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Twitter Card */}
            <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl 
                          p-6 hover:bg-gray-800/70 transition-all duration-300 
                          hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <FaTwitter className="text-blue-400 text-3xl" />
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Real-time
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Twitter Analytics
              </h3>
              <p className="text-gray-400">
                Track engagement, analyze trends, and monitor social sentiment in
                real-time.
              </p>
            </div>

            {/* Websites Card */}
            <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl 
                          p-6 hover:bg-gray-800/70 transition-all duration-300 
                          hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <FaGlobe className="text-green-400 text-3xl" />
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Web Data
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Website Insights
              </h3>
              <p className="text-gray-400">
                Comprehensive analysis of web content, traffic patterns, and user
                behavior.
              </p>
            </div>

            {/* Mastodon Card */}
            <div className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl 
                          p-6 hover:bg-gray-800/70 transition-all duration-300 
                          hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <FaMastodon className="text-purple-400 text-3xl" />
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  Federated
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Mastodon Metrics
              </h3>
              <p className="text-gray-400">
                Deep insights into federated social networks and community
                engagement.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center">
            <div className="inline-flex space-x-4 bg-gray-800/30 rounded-full p-1 mb-8">
              <span className="px-4 py-2 text-sm text-white bg-blue-600 rounded-full">
                Real-time Analysis
              </span>
              <span className="px-4 py-2 text-sm text-gray-400">
                Custom Reports
              </span>
              <span className="px-4 py-2 text-sm text-gray-400">
                API Access
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/30 border-t border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Analytics Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
