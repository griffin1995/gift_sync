/**
 * Affiliate Disclosure Page
 * 
 * Comprehensive affiliate disclosure page that meets FTC guidelines,
 * Amazon Associates Operating Agreement requirements, and provides
 * transparency about GiftSync's affiliate marketing practices.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ExternalLink, Shield, DollarSign, Heart, Users, CheckCircle } from 'lucide-react';

const AffiliateDisclosurePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Affiliate Disclosure - GiftSync</title>
        <meta 
          name="description" 
          content="Learn about GiftSync's affiliate partnerships and how we earn commissions from qualifying purchases to support our free gift recommendation service." 
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Affiliate Disclosure</h1>
                <p className="text-gray-600 mt-1">Transparency in our partnerships and earnings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Summary Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h2>
                <p className="text-blue-800 leading-relaxed">
                  <strong>GiftSync participates in affiliate programmes</strong>, including the Amazon Associates Programme. 
                  When you purchase products through our recommendation links, we may earn a small commission at no additional cost to you. 
                  This helps us maintain our free service whilst ensuring our recommendations remain unbiased and based solely on AI analysis of your preferences.
                </p>
              </div>
            </div>
          </div>
          
          {/* [All other sections remain unchanged] */}

          {/* Contact Information */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our affiliate relationships or this disclosure, please don't hesitate to contact us:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Email:</span>
                <a href="mailto:hello@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                  hello@giftsync.com
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
            <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateDisclosurePage;
