/**
 * Careers Page
 * 
 * Placeholder careers page for future job opportunities.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Users, Briefcase, Heart, Zap, Globe, Coffee } from 'lucide-react';

const CareersPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Careers - GiftSync</title>
        <meta 
          name="description" 
          content="Join the GiftSync team and help revolutionise gift-giving with AI. Explore career opportunities in our growing company." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/careers" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Careers</h1>
                <p className="text-gray-600">Join our mission to revolutionise gift-giving</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Coming Soon */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold mb-8">
                <Users className="w-5 h-5" />
                We're hiring!
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Building the Future of Gift-Giving
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We're a growing team passionate about using AI to solve real human problems. 
                Join us in creating technology that brings people closer together.
              </p>
            </div>

            {/* Why Join Us */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cutting-Edge Technology</h3>
                <p className="text-gray-600">
                  Work with the latest AI and machine learning technologies to solve fascinating problems
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Meaningful Impact</h3>
                <p className="text-gray-600">
                  Build products that genuinely improve people's relationships and bring joy to their lives
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Remote-First Culture</h3>
                <p className="text-gray-600">
                  Work from anywhere with a flexible schedule that respects work-life balance
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Coffee className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Join a fast-growing company where you can shape the product and your career path
                </p>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                We're Growing Our Team
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                We're actively building our team and looking for talented individuals who share our 
                passion for creating meaningful technology. While we don't have specific openings 
                posted yet, we're always interested in hearing from exceptional candidates.
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Roles we're particularly interested in:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Full-Stack Engineers</li>
                    <li>• Machine Learning Engineers</li>
                    <li>• Product Designers (UI/UX)</li>
                    <li>• Data Scientists</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• DevOps Engineers</li>
                    <li>• Product Managers</li>
                    <li>• Marketing Specialists</li>
                    <li>• Customer Success Managers</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Even if your role isn't listed above, we'd love to hear from you if you're passionate 
                about our mission and think you could contribute to our team.
              </p>
              
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Get in Touch
                <Users className="w-5 h-5" />
              </Link>
            </div>

            {/* Company Culture */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-semibold mb-4">Our Culture</h3>
              <p className="opacity-90 mb-6 max-w-2xl mx-auto">
                We believe in building a diverse, inclusive, and collaborative environment where 
                everyone can do their best work while maintaining a healthy work-life balance.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">🌍 Remote-First</h4>
                  <p className="text-sm opacity-90">Work from anywhere with flexible hours</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎯 Impact-Driven</h4>
                  <p className="text-sm opacity-90">Focus on outcomes that matter to users</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🚀 Growth Mindset</h4>
                  <p className="text-sm opacity-90">Continuous learning and development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareersPage;