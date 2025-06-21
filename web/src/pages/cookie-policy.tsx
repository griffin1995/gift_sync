/**
 * Cookie Policy Page
 * 
 * Comprehensive cookie policy page that meets GDPR requirements and provides
 * transparency about how GiftSync uses cookies and tracking technologies.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Cookie, Shield, Settings, Eye, BarChart, ExternalLink } from 'lucide-react';

const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cookie Policy - GiftSync</title>
        <meta 
          name="description" 
          content="Learn about how GiftSync uses cookies and tracking technologies to improve your experience and provide personalised gift recommendations." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/cookie-policy" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Cookie className="w-8 h-8 text-orange-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
                <p className="text-gray-600 mt-1">How we use cookies and tracking technologies</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Summary Box */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-orange-900 mb-2">Cookie Summary</h2>
                <p className="text-orange-800 leading-relaxed">
                  GiftSync uses cookies and similar technologies to provide personalised gift recommendations, 
                  improve our service, and analyse how you interact with our platform. You can control your 
                  cookie preferences at any time through your browser settings.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* What Are Cookies */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. 
                  They help websites remember information about your visit, such as your preferences and login status, which can make 
                  your next visit easier and the site more useful to you.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300">
                    <h3 className="font-semibold text-blue-900 mb-2">Session Cookies</h3>
                    <p className="text-blue-800 text-sm">
                      Temporary cookies that are deleted when you close your browser. 
                      These help with navigation and maintaining your login status during your visit.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-300">
                    <h3 className="font-semibold text-green-900 mb-2">Persistent Cookies</h3>
                    <p className="text-green-800 text-sm">
                      Cookies that remain on your device for a set period or until you delete them. 
                      These remember your preferences across multiple visits.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* How We Use Cookies */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Cookies</h2>
              </div>
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Essential Cookies (Required)
                  </h3>
                  <p className="text-red-800 text-sm mb-3">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Authentication</span>
                      <span className="text-red-600">Keeps you logged in</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Security</span>
                      <span className="text-red-600">CSRF protection</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Session Management</span>
                      <span className="text-red-600">Maintains your session</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Cookie Preferences</span>
                      <span className="text-red-600">Remembers your cookie choices</span>
                    </div>
                  </div>
                </div>
                
                {/* Functional Cookies */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Functional Cookies (Optional)
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    These cookies enhance your experience by remembering your preferences and choices.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Personalisation</span>
                      <span className="text-blue-600">Remembers your gift preferences</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">User Interface</span>
                      <span className="text-blue-600">Dark/light mode preference</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Language & Region</span>
                      <span className="text-blue-600">Preferred language settings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 font-medium">Recent Searches</span>
                      <span className="text-blue-600">Saves your search history</span>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Analytics Cookies (Optional)
                  </h3>
                  <p className="text-purple-800 text-sm mb-3">
                    These cookies help us understand how you use our service so we can improve it.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-medium">PostHog Analytics</span>
                      <span className="text-purple-600">User behaviour analysis</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-medium">Performance Monitoring</span>
                      <span className="text-purple-600">Page load times and errors</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-medium">Feature Usage</span>
                      <span className="text-purple-600">Which features are most popular</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700 font-medium">A/B Testing</span>
                      <span className="text-purple-600">Testing new features</span>
                    </div>
                  </div>
                </div>
                
                {/* Marketing Cookies */}
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Marketing & Advertising Cookies (Optional)
                  </h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    These cookies help us show you relevant content and track affiliate conversions.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 font-medium">Affiliate Tracking</span>
                      <span className="text-yellow-600">Amazon Associates conversion tracking</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 font-medium">Social Media</span>
                      <span className="text-yellow-600">Social sharing functionality</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 font-medium">Email Marketing</span>
                      <span className="text-yellow-600">Targeted email campaigns</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 font-medium">Retargeting</span>
                      <span className="text-yellow-600">Relevant product recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Third-Party Cookies */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                Some cookies are set by third-party services that appear on our website. We do not control these cookies, 
                and you should check the relevant third party's privacy policy for more information.
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Amazon Associates</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Tracks affiliate link clicks and conversions for commission purposes.
                  </p>
                  <a 
                    href="https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=201909010" 
                    className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amazon's Cookie Policy <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">PostHog Analytics</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Provides analytics and user behaviour insights to help us improve our service.
                  </p>
                  <a 
                    href="https://posthog.com/privacy" 
                    className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PostHog's Privacy Policy <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Content Delivery Networks (CDNs)</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    We use CDNs to deliver content faster, which may set performance and security cookies.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Managing Your Cookie Preferences */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <div className="space-y-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Browser Settings</h3>
                  <p className="text-green-800 text-sm mb-3">
                    You can control and delete cookies through your browser settings. Here's how:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-700">Chrome:</span>
                      <span className="text-green-600">Settings → Privacy and security → Cookies and other site data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-700">Firefox:</span>
                      <span className="text-green-600">Settings → Privacy & Security → Cookies and Site Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-700">Safari:</span>
                      <span className="text-green-600">Preferences → Privacy → Manage Website Data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-700">Edge:</span>
                      <span className="text-green-600">Settings → Cookies and site permissions → Cookies and stored data</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">GiftSync Cookie Preferences</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    You can also manage your cookie preferences directly through our platform:
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Manage Cookie Preferences
                  </button>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Note</h3>
                  <p className="text-yellow-800 text-sm">
                    Disabling certain cookies may limit the functionality of our service. Essential cookies cannot be 
                    disabled as they are necessary for the website to function properly.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Data Retention */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Retention Period</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Session Cookies</td>
                      <td className="border border-gray-300 px-4 py-2">Until browser is closed</td>
                      <td className="border border-gray-300 px-4 py-2">Authentication and session management</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Authentication</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Keep you logged in</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Preferences</td>
                      <td className="border border-gray-300 px-4 py-2">1 year</td>
                      <td className="border border-gray-300 px-4 py-2">Remember your settings and preferences</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">2 years</td>
                      <td className="border border-gray-300 px-4 py-2">Usage analytics and service improvement</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Marketing</td>
                      <td className="border border-gray-300 px-4 py-2">30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Affiliate tracking and personalised content</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            {/* Updates to This Policy */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                new policy on this page and updating the "last updated" date.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  We recommend that you review this Cookie Policy periodically to stay informed about our use of cookies 
                  and related technologies.
                </p>
              </div>
            </section>
            
            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Email:</span>
                  <a href="mailto:privacy@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                    privacy@giftsync.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Support:</span>
                  <a href="mailto:support@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                    support@giftsync.com
                  </a>
                </div>
              </div>
            </section>
          </div>
          
          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </Link>
              <Link href="/affiliate-disclosure" className="text-blue-600 hover:text-blue-800 underline">
                Affiliate Disclosure
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                Contact Us
              </Link>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;