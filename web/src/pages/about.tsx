/**
 * About Us Page
 * 
 * Comprehensive about page explaining GiftSync's mission, story, and team.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Gift, 
  Heart, 
  Sparkles, 
  Target, 
  Users, 
  Zap,
  Brain,
  Globe,
  Shield
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Us - GiftSync</title>
        <meta 
          name="description" 
          content="Learn about GiftSync's mission to revolutionise gift-giving with AI-powered recommendations. Discover our story, values, and the team behind the platform." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/about" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">About GiftSync</h1>
                <p className="text-gray-600">Revolutionising gift-giving with AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Making Gift-Giving 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> Effortless</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe that finding the perfect gift shouldn't be stressful. Our AI-powered platform 
              learns your preferences to suggest gifts that truly resonate with you and your loved ones.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-6">
                Gift-giving is one of humanity's most beautiful expressions of love and care. Yet too often, 
                it becomes a source of stress and uncertainty. We're here to change that.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                GiftSync combines cutting-edge artificial intelligence with human understanding to create 
                a platform that truly gets your style, preferences, and the unique relationships you cherish.
              </p>
              <div className="flex items-center gap-3 bg-primary-50 p-4 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
                <span className="font-semibold text-primary-800">
                  Making every gift meaningful, every time
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                <p className="text-gray-600 text-sm">Advanced machine learning that understands your unique taste</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Thoughtful</h4>
                <p className="text-gray-600 text-sm">Every recommendation considers the relationship and occasion</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Privacy-First</h4>
                <p className="text-gray-600 text-sm">Your data is protected with industry-leading security</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Global</h4>
                <p className="text-gray-600 text-sm">Curated products from the world's best retailers</p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h3>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-6">
                GiftSync was born from a simple realisation: despite having access to millions of products online, 
                finding the perfect gift remained frustratingly difficult. Traditional recommendation systems focused 
                on popularity and sales data, ignoring the personal nuances that make a gift truly special.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our founders, passionate about both technology and human connection, set out to create something different. 
                By combining advanced machine learning with deep understanding of human relationships and preferences, 
                we built a platform that doesn't just suggest products—it understands what makes gifts meaningful.
              </p>
              <p className="text-lg text-gray-600">
                Today, GiftSync serves thousands of users worldwide, helping them discover gifts that strengthen 
                relationships and create lasting memories. Every swipe, every recommendation, and every successful 
                gift brings us closer to our vision of a world where gift-giving is always a joy, never a burden.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h4>
                <p className="text-gray-600">
                  We constantly push the boundaries of what's possible, using cutting-edge AI to solve 
                  real human problems with creativity and precision.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Empathy</h4>
                <p className="text-gray-600">
                  Every feature we build is designed with deep understanding of human emotions, 
                  relationships, and the meaningful moments that connect us.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Trust</h4>
                <p className="text-gray-600">
                  We earn trust through transparency, security, and consistently delivering 
                  recommendations that genuinely improve our users' gift-giving experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Impact Section */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 lg:p-12 text-white mb-16">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">Our Impact</h3>
              <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
                Since launching, we've helped thousands of people find meaningful gifts and strengthen their relationships.
              </p>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="opacity-90">Gifts Recommended</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="opacity-90">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">25+</div>
                  <div className="opacity-90">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">£2M+</div>
                  <div className="opacity-90">In Gift Value</div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Join Our Journey</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you're looking for the perfect gift or want to be part of revolutionising how we connect 
              through giving, we'd love to have you with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Start Finding Gifts
                <Gift className="w-5 h-5" />
              </Link>
              
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Join Our Team
                <Users className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;