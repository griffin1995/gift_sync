/**
 * Help Centre Page
 * 
 * Comprehensive help and support page providing users with guides,
 * FAQs, and support resources for using GiftSync effectively.
 */

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  Gift, 
  Heart, 
  Settings, 
  User, 
  Shield, 
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Book,
  Zap,
  Target
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: "how-it-works",
    question: "How does GiftSync work?",
    answer: "GiftSync uses AI-powered recommendations based on your preferences. Simply swipe through products to help our algorithm learn your taste, then receive personalised gift suggestions for yourself or others.",
    category: "Getting Started"
  },
  {
    id: "create-account",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' on the homepage, enter your email and create a password. You'll receive a confirmation email to verify your account.",
    category: "Getting Started"
  },
  {
    id: "swipe-system",
    question: "How does the swipe system work?",
    answer: "Swipe right on products you like, left on products you don't. The more you swipe, the better our AI understands your preferences and improves recommendations.",
    category: "Using GiftSync"
  },
  {
    id: "recommendations",
    question: "How are recommendations generated?",
    answer: "Our AI analyses your swipe patterns, preferred categories, and interaction history to generate personalised recommendations with confidence scores.",
    category: "Using GiftSync"
  },
  {
    id: "affiliate-links",
    question: "What are affiliate links?",
    answer: "Some product links earn us a small commission when you make a purchase, at no extra cost to you. This helps keep GiftSync free whilst supporting quality recommendations.",
    category: "Shopping"
  },
  {
    id: "data-privacy",
    question: "How is my data protected?",
    answer: "We follow GDPR guidelines and only collect necessary data to improve your experience. You can view, export, or delete your data anytime in your account settings.",
    category: "Privacy & Security"
  },
  {
    id: "delete-account",
    question: "How do I delete my account?",
    answer: "Go to Account Settings > Privacy & Data > Delete Account. This will permanently remove all your data from our systems.",
    category: "Privacy & Security"
  },
  {
    id: "recommendation-accuracy",
    question: "Why aren't my recommendations accurate?",
    answer: "Recommendations improve with more swipe data. Try swiping through more products in different categories to help our algorithm better understand your preferences.",
    category: "Troubleshooting"
  }
];

const categories = [
  "All",
  "Getting Started",
  "Using GiftSync", 
  "Shopping",
  "Privacy & Security",
  "Troubleshooting"
];

const HelpCentrePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <>
      <Head>
        <title>Help Centre - GiftSync</title>
        <meta 
          name="description" 
          content="Get help with GiftSync - find answers to common questions, learn how to use our AI-powered gift recommendation system, and get support." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/help" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Centre</h1>
                <p className="text-gray-600">Find answers and get support</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Quick Help Cards */}
            <div className="lg:col-span-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Help</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/auth/register" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                    <p className="text-gray-600 text-sm">Create your account and start discovering personalised gift recommendations</p>
                  </div>
                </Link>

                <Link href="/dashboard" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Using GiftSync</h3>
                    <p className="text-gray-600 text-sm">Learn how to swipe, get recommendations, and find perfect gifts</p>
                  </div>
                </Link>

                <Link href="/contact" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm">Get personalised help from our support team</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No articles found matching your search.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Support */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Need More Help?</h3>
                <div className="space-y-3">
                  <Link 
                    href="/contact"
                    className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Support</span>
                  </Link>
                  <Link 
                    href="mailto:support@giftsync.com"
                    className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Email Support</span>
                  </Link>
                </div>
              </div>

              {/* Legal Links */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Legal & Privacy</h3>
                <div className="space-y-3">
                  <Link 
                    href="/privacy"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link 
                    href="/terms"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Book className="w-5 h-5" />
                    <span>Terms of Service</span>
                  </Link>
                  <Link 
                    href="/data-protection"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Data Protection Rights</span>
                  </Link>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Swipe through at least 20 products for better recommendations</p>
                  <p>• Update your preferences regularly as your tastes change</p>
                  <p>• Use specific search terms to find targeted gift ideas</p>
                  <p>• Check back regularly for new product recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center py-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← Back to GiftSync
          </Link>
        </div>
      </div>
    </>
  );
};

export default HelpCentrePage;