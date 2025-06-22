import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Gift,
  Heart,
  TrendingUp,
  Share2,
  User,
  Settings,
  Sparkles,
  Calendar,
  Link as LinkIcon,
  BarChart3,
  Target,
  Clock,
  Star,
} from "lucide-react";
import { api, tokenManager } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "../../utils/formatting";
import { User as UserType, Recommendation, GiftLink } from "@/types";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [giftLinks, setGiftLinks] = useState<GiftLink[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load user data first - this is essential
      try {
        const userResponse = await api.getCurrentUser();

        // Handle response format - sometimes data is direct, sometimes wrapped
        const userData = userResponse.data || userResponse;
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
        toast.error("Failed to load user data. Please try logging in again.");
        setIsLoading(false);
        return;
      }

      // Load optional data - if these fail, dashboard should still work
      // Note: These endpoints may not be implemented in the backend yet

      // Load recent recommendations (optional)
      try {
        const recommendationsResponse = await api.getRecommendations({
          limit: 6,
        });
        // Handle different response formats - sometimes data is wrapped, sometimes direct
        const recommendationsData =
          recommendationsResponse.data || recommendationsResponse;
        setRecommendations(
          Array.isArray(recommendationsData) ? recommendationsData : []
        );
      } catch (error) {
        console.warn("Recommendations not available:", error);
        setRecommendations([]);
      }

      // Load gift links (optional)
      try {
        const giftLinksResponse = await api.getGiftLinks();
        // Handle different response formats - sometimes data is wrapped, sometimes direct
        const giftLinksData = giftLinksResponse.data || giftLinksResponse;
        setGiftLinks(Array.isArray(giftLinksData) ? giftLinksData : []);
      } catch (error) {
        console.warn("Gift links not available:", error);
        setGiftLinks([]);
      }

      // Load user statistics (optional)
      try {
        const statsResponse = await api.getUserStatistics();
        // Handle different response formats - sometimes data is wrapped, sometimes direct
        const statsData = statsResponse.data || statsResponse;
        setStatistics(statsData);
      } catch (error) {
        console.warn("Statistics not available:", error);
        setStatistics({
          total_swipes: 0,
          recommendations_generated: 0,
          gift_links_created: 0,
          total_savings: 0,
          favorite_categories: [],
          activity_score: 0,
        }); // Set default stats to avoid loading states
      }
    } catch (error) {
      console.error("Unexpected error loading dashboard:", error);
      toast.error("Failed to load dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Use AuthContext logout for complete cleanup
      // AuthContext logout handles:
      // - Backend API call
      // - Clear all localStorage data
      // - Update global auth state
      // - Show success toast
      // - Redirect to homepage
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load user data</p>
          <button
            onClick={() => router.reload()}
            className="mt-2 text-primary-600 hover:text-primary-500"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Swipes",
      value: statistics?.total_swipes || 0,
      icon: <Heart className="w-5 h-5" />,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      label: "Recommendations",
      value: statistics?.recommendations_generated || 0,
      icon: <Sparkles className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Gift Links",
      value: statistics?.gift_links_created || 0,
      icon: <LinkIcon className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Saved",
      value: `$${statistics?.total_savings || 0}`,
      icon: <Target className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - GiftSync</title>
        <meta
          name="description"
          content="Your personalised GiftSync dashboard with recommendations, gift links, and preferences."
        />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  GiftSync
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/discover"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Discover
                </Link>
                <Link
                  href="/dashboard/recommendations"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Recommendations
                </Link>
                <Link
                  href="/dashboard/gift-links"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Gift Links
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.subscription_tier} Plan
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/settings"
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.first_name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your gift discovery journey.
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Link
              href="/discover"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Discover Gifts</h3>
                  <p className="text-primary-100 text-sm">
                    Swipe through new products
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/recommendations"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">View Recommendations</h3>
                  <p className="text-blue-100 text-sm">
                    See your AI suggestions
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/gift-links/create"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Create Gift Link</h3>
                  <p className="text-green-100 text-sm">Share with friends</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Recent Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Recommendations
                </h2>
                <Link
                  href="/dashboard/recommendations"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations || []).slice(0, 6).map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      {recommendation.product.image_url ? (
                        <Image
                          src={recommendation.product.image_url}
                          alt={recommendation.product.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <Gift className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-sm">Product Image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round(
                            (recommendation.confidence_score || 0) * 100
                          )}
                          % match
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {recommendation.product.title}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        £{recommendation.product.price_min}
                        {recommendation.product.price_max &&
                          recommendation.product.price_max !==
                            recommendation.product.price_min &&
                          ` - £${recommendation.product.price_max}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {recommendation.product.brand}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Gift Links */}
          {giftLinks && giftLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Gift Links
                </h2>
                <Link
                  href="/dashboard/gift-links"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(giftLinks || []).slice(0, 4).map((giftLink) => (
                  <div
                    key={giftLink.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {giftLink.title}
                        </h3>
                        {giftLink.recipient_name && (
                          <p className="text-sm text-gray-600">
                            For {giftLink.recipient_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {giftLink.view_count} views
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        {giftLink.products.length} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(giftLink.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Activity Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Favorite Categories */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Favourite Categories
                </h3>
                {statistics?.favorite_categories?.length > 0 ? (
                  <div className="space-y-3">
                    {statistics.favorite_categories
                      .slice(0, 5)
                      .map((category: string, index: number) => (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-700">{category}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{
                                width: `${Math.max(20, 100 - index * 15)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Start swiping to see your favourite categories!
                  </p>
                )}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Last active: </span>
                    <span className="text-gray-900">
                      {user.last_login ? formatDate(user.last_login) : "Today"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Account created: </span>
                    <span className="text-gray-900">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Activity score: </span>
                    <span className="text-gray-900">
                      {statistics?.activity_score || 0}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
