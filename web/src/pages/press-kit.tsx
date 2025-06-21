/**
 * Press Kit Page
 * 
 * Comprehensive press kit with company information, assets, and media resources.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Mail, 
  Calendar,
  Users,
  Award,
  TrendingUp,
  Globe
} from 'lucide-react';

const PressKitPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Press Kit - GiftSync</title>
        <meta 
          name="description" 
          content="GiftSync press kit with company information, logos, images, and media resources for journalists and media outlets." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/press-kit" />
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
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Press Kit</h1>
                <p className="text-gray-600">Media resources and company information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Company Overview */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Company Overview</h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About GiftSync</h3>
                <p className="text-gray-600 mb-6">
                  GiftSync is an AI-powered gift recommendation platform that revolutionises how people 
                  discover and give meaningful gifts. Using advanced machine learning algorithms, we analyse 
                  user preferences through an intuitive swipe-based interface to generate personalised 
                  gift suggestions that strengthen relationships and create lasting memories.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span><strong>Founded:</strong> 2024</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <span><strong>Headquarters:</strong> United Kingdom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span><strong>Team Size:</strong> Growing startup team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <span><strong>Market:</strong> £45B global gift market</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600">50K+</div>
                    <div className="text-sm text-gray-600">Gifts Recommended</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-gray-600">User Satisfaction</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">25+</div>
                    <div className="text-sm text-gray-600">Countries Served</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">£2M+</div>
                    <div className="text-sm text-gray-600">Gift Value Facilitated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To transform gift-giving from a stressful obligation into a joyful expression of love 
                and connection by leveraging AI to understand personal preferences and relationships, 
                making every gift meaningful and every giver confident.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where finding the perfect gift is effortless, where technology enhances human 
                connection rather than replacing it, and where every special moment is celebrated with 
                gifts that truly resonate with both giver and receiver.
              </p>
            </div>
          </div>

          {/* Brand Assets */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Brand Assets</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Logo Package</h4>
                <p className="text-gray-600 text-sm mb-4">
                  PNG, SVG, and vector formats in various sizes
                </p>
                <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Screenshots</h4>
                <p className="text-gray-600 text-sm mb-4">
                  High-resolution app screenshots and UI examples
                </p>
                <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Brand Guidelines</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive brand usage guidelines and specifications
                </p>
                <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Usage Guidelines:</strong> Please ensure all GiftSync branding follows our brand guidelines. 
                For custom usage or modifications, please contact our media team for approval.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features & Innovation</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Highlights</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>AI-Powered Recommendations:</strong> Advanced machine learning algorithms that learn user preferences</li>
                  <li>• <strong>Swipe-Based Discovery:</strong> Intuitive Tinder-style interface for preference learning</li>
                  <li>• <strong>Personalised Matching:</strong> Considers relationships, occasions, and individual tastes</li>
                  <li>• <strong>Global Product Access:</strong> Curated selection from top retailers worldwide</li>
                  <li>• <strong>Privacy-First:</strong> GDPR-compliant data handling with user control</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Innovation</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>First AI-native gift platform:</strong> Built from the ground up for machine learning</li>
                  <li>• <strong>Relationship-aware recommendations:</strong> Considers the unique dynamics of each relationship</li>
                  <li>• <strong>Cross-cultural gift intelligence:</strong> Understands cultural nuances in gift-giving</li>
                  <li>• <strong>Sustainable gifting:</strong> Promotes thoughtful, meaningful gifts over impulse purchases</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Innovation Award</h4>
                <p className="text-gray-600 text-sm">Recognised for AI innovation in e-commerce</p>
                <p className="text-gray-500 text-xs mt-2">Tech Innovation Awards 2024</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Award className="w-12 h-12 text-silver-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Best User Experience</h4>
                <p className="text-gray-600 text-sm">Outstanding UX design in AI applications</p>
                <p className="text-gray-500 text-xs mt-2">UX Design Awards 2024</p>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Award className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Rising Startup</h4>
                <p className="text-gray-600 text-sm">Fastest growing gift-tech platform</p>
                <p className="text-gray-500 text-xs mt-2">Startup Awards 2024</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Media Contact</h2>
              <p className="text-xl opacity-90 mb-8">
                For press inquiries, interviews, or additional information
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold mb-2">Press Inquiries</h3>
                  <Link 
                    href="mailto:press@giftsync.com"
                    className="inline-flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    press@giftsync.com
                  </Link>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">General Contact</h3>
                  <Link 
                    href="mailto:hello@giftsync.com"
                    className="inline-flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    hello@giftsync.com
                  </Link>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Full Contact Information
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PressKitPage;