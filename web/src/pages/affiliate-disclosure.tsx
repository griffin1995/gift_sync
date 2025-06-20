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
          name=\"description\" 
          content=\"Learn about GiftSync's affiliate partnerships and how we earn commissions from qualifying purchases to support our free gift recommendation service.\" 
        />
        <meta name=\"robots\" content=\"index, follow\" />
        <link rel=\"canonical\" href=\"https://giftsync.com/affiliate-disclosure\" />
      </Head>
      
      <div className=\"min-h-screen bg-gray-50\">
        {/* Header */}
        <div className=\"bg-white shadow-sm\">
          <div className=\"max-w-4xl mx-auto px-4 py-6\">
            <div className=\"flex items-center gap-3\">
              <Shield className=\"w-8 h-8 text-blue-600\" />
              <div>
                <h1 className=\"text-3xl font-bold text-gray-900\">Affiliate Disclosure</h1>
                <p className=\"text-gray-600 mt-1\">Transparency in our partnerships and earnings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className=\"max-w-4xl mx-auto px-4 py-8\">
          {/* Summary Box */}
          <div className=\"bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8\">
            <div className=\"flex items-start gap-3\">
              <CheckCircle className=\"w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0\" />
              <div>
                <h2 className=\"text-lg font-semibold text-blue-900 mb-2\">Quick Summary</h2>
                <p className=\"text-blue-800 leading-relaxed\">
                  <strong>GiftSync participates in affiliate programmes</strong>, including the Amazon Associates Programme. 
                  When you purchase products through our recommendation links, we may earn a small commission at no additional cost to you. 
                  This helps us maintain our free service whilst ensuring our recommendations remain unbiased and based solely on AI analysis of your preferences.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className=\"space-y-8\">
            {/* What Are Affiliate Links */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <ExternalLink className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">What Are Affiliate Links?</h2>
              </div>
              <div className=\"prose prose-gray max-w-none\">
                <p className=\"text-gray-700 leading-relaxed mb-4\">
                  Affiliate links are special tracking links that allow us to earn a commission when you make a purchase 
                  through them. These links contain unique identifiers that tell the retailer (such as Amazon) that you 
                  came from our website.
                </p>
                <p className=\"text-gray-700 leading-relaxed mb-4\">
                  <strong>Important:</strong> Using our affiliate links does not cost you anything extra. The price you pay 
                  remains exactly the same whether you use our link or go directly to the retailer's website.
                </p>
                <div className=\"bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300\">
                  <p className=\"text-sm text-gray-600 mb-2\"><strong>Example:</strong></p>
                  <p className=\"text-sm text-gray-600\">
                    Product costs £50 → You pay £50 → Amazon pays us a small commission (typically 1-4%) → 
                    You get your product, Amazon gets their sale, we get support for our platform.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Our Affiliate Partners */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <Users className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">Our Affiliate Partners</h2>
              </div>
              <div className=\"space-y-4\">
                <div className=\"border border-gray-200 rounded-lg p-4\">
                  <h3 className=\"font-semibold text-gray-900 mb-2\">Amazon Associates Programme</h3>
                  <p className=\"text-gray-700 text-sm mb-2\">
                    We are participants in the Amazon Associates Programme, an affiliate advertising programme designed 
                    to provide a means for sites to earn advertising fees by advertising and linking to Amazon.co.uk.
                  </p>
                  <div className=\"flex items-center gap-2 text-sm text-gray-600\">
                    <span className=\"font-medium\">Associate ID:</span>
                    <code className=\"bg-gray-100 px-2 py-1 rounded text-xs\">giftsync-21</code>
                  </div>
                </div>
                
                <div className=\"border border-gray-200 rounded-lg p-4 opacity-60\">
                  <h3 className=\"font-semibold text-gray-900 mb-2\">Future Partners</h3>
                  <p className=\"text-gray-700 text-sm\">
                    We may add additional affiliate partnerships with other reputable retailers to provide you with 
                    more product options and competitive pricing. Any new partnerships will be disclosed here.
                  </p>
                </div>
              </div>
            </section>
            
            {/* How We Use Affiliate Revenue */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <Heart className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">How We Use Affiliate Revenue</h2>
              </div>
              <div className=\"grid md:grid-cols-2 gap-6\">
                <div className=\"space-y-4\">
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">Platform Development</h3>
                      <p className=\"text-sm text-gray-600\">Improving our AI recommendation algorithms and user experience</p>
                    </div>
                  </div>
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">Server Costs</h3>
                      <p className=\"text-sm text-gray-600\">Maintaining reliable hosting and database infrastructure</p>
                    </div>
                  </div>
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">Free Service</h3>
                      <p className=\"text-sm text-gray-600\">Keeping GiftSync free for all users without subscription fees</p>
                    </div>
                  </div>
                </div>
                <div className=\"space-y-4\">
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">Customer Support</h3>
                      <p className=\"text-sm text-gray-600\">Providing responsive help and technical assistance</p>
                    </div>
                  </div>
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">New Features</h3>
                      <p className=\"text-sm text-gray-600\">Developing mobile apps and advanced personalisation features</p>
                    </div>
                  </div>
                  <div className=\"flex items-start gap-3\">
                    <CheckCircle className=\"w-5 h-5 text-green-600 mt-0.5 flex-shrink-0\" />
                    <div>
                      <h3 className=\"font-medium text-gray-900\">Quality Assurance</h3>
                      <p className=\"text-sm text-gray-600\">Ensuring accurate product data and recommendation quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Our Commitment to You */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <Shield className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">Our Commitment to You</h2>
              </div>
              <div className=\"space-y-4\">
                <div className=\"bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg\">
                  <h3 className=\"font-semibold text-green-900 mb-2\">Unbiased Recommendations</h3>
                  <p className=\"text-green-800 text-sm\">
                    Our AI recommendation algorithm is based solely on your preferences and product quality metrics. 
                    Commission rates do not influence which products we recommend to you.
                  </p>
                </div>
                
                <div className=\"bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg\">
                  <h3 className=\"font-semibold text-blue-900 mb-2\">Transparent Disclosure</h3>
                  <p className=\"text-blue-800 text-sm\">
                    We clearly mark affiliate links and provide this comprehensive disclosure. 
                    You'll always know when you're clicking on an affiliate link.
                  </p>
                </div>
                
                <div className=\"bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg\">
                  <h3 className=\"font-semibold text-purple-900 mb-2\">Privacy Protection</h3>
                  <p className=\"text-purple-800 text-sm\">
                    We do not share your personal data with affiliate partners. 
                    Affiliate tracking only occurs when you click on and purchase through our links.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Commission Rates */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <DollarSign className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">Commission Rates</h2>
              </div>
              <p className=\"text-gray-700 mb-4\">
                For transparency, here are the typical commission rates we earn from Amazon purchases:
              </p>
              <div className=\"grid md:grid-cols-2 gap-4 text-sm\">
                <div className=\"space-y-2\">
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Books & eBooks</span>
                    <span className=\"font-medium\">4.5%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Fashion & Clothing</span>
                    <span className=\"font-medium\">4.0%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Beauty & Personal Care</span>
                    <span className=\"font-medium\">4.0%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Home & Garden</span>
                    <span className=\"font-medium\">3.0%</span>
                  </div>
                </div>
                <div className=\"space-y-2\">
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Sports & Outdoors</span>
                    <span className=\"font-medium\">3.0%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Toys & Games</span>
                    <span className=\"font-medium\">3.0%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Electronics</span>
                    <span className=\"font-medium\">1.0%</span>
                  </div>
                  <div className=\"flex justify-between\">
                    <span className=\"text-gray-600\">Most Other Categories</span>
                    <span className=\"font-medium\">2.0%</span>
                  </div>
                </div>
              </div>
              <p className=\"text-xs text-gray-500 mt-4\">
                * Commission rates are set by Amazon and may change. Rates shown are approximate and current as of the last update.
              </p>
            </section>
            
            {/* Legal Compliance */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <div className=\"flex items-center gap-3 mb-4\">
                <Shield className=\"w-6 h-6 text-gray-600\" />
                <h2 className=\"text-2xl font-bold text-gray-900\">Legal Compliance</h2>
              </div>
              <div className=\"space-y-4 text-gray-700\">
                <p>
                  This disclosure is provided in compliance with the Federal Trade Commission's (FTC) guidelines 
                  for affiliate marketing and the Amazon Associates Programme Operating Agreement.
                </p>
                <div className=\"bg-gray-50 p-4 rounded-lg\">
                  <h3 className=\"font-semibold text-gray-900 mb-2\">Material Connection Disclosure</h3>
                  <p className=\"text-sm\">
                    GiftSync has a material connection to the products and services recommended on this website. 
                    We may receive compensation when you click on or make purchases through affiliate links. 
                    This compensation may impact how and where products appear on this site, but it does not 
                    influence our editorial content or recommendations.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Contact Information */}
            <section className=\"bg-white rounded-lg shadow-sm p-6\">
              <h2 className=\"text-2xl font-bold text-gray-900 mb-4\">Questions or Concerns?</h2>
              <p className=\"text-gray-700 mb-4\">
                If you have any questions about our affiliate relationships or this disclosure, please don't hesitate to contact us:
              </p>
              <div className=\"space-y-2 text-sm\">
                <div className=\"flex items-center gap-2\">
                  <span className=\"font-medium text-gray-900\">Email:</span>
                  <a href=\"mailto:hello@giftsync.com\" className=\"text-blue-600 hover:text-blue-800 underline\">
                    hello@giftsync.com
                  </a>
                </div>
                <div className=\"flex items-center gap-2\">
                  <span className=\"font-medium text-gray-900\">Support:</span>
                  <a href=\"mailto:support@giftsync.com\" className=\"text-blue-600 hover:text-blue-800 underline\">
                    support@giftsync.com
                  </a>
                </div>
              </div>
            </section>
          </div>
          
          {/* Footer Links */}
          <div className=\"mt-12 pt-8 border-t border-gray-200\">
            <div className=\"flex flex-wrap justify-center gap-6 text-sm\">
              <Link href=\"/privacy\" className=\"text-blue-600 hover:text-blue-800 underline\">
                Privacy Policy
              </Link>
              <Link href=\"/terms\" className=\"text-blue-600 hover:text-blue-800 underline\">
                Terms of Service
              </Link>
              <Link href=\"/cookie-policy\" className=\"text-blue-600 hover:text-blue-800 underline\">
                Cookie Policy
              </Link>
              <Link href=\"/contact\" className=\"text-blue-600 hover:text-blue-800 underline\">
                Contact Us
              </Link>
            </div>
            <p className=\"text-center text-xs text-gray-500 mt-4\">
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

export default AffiliateDisclosurePage;