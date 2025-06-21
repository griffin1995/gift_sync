/**
 * Terms and Conditions Page
 * 
 * Comprehensive terms of service covering UK/EU regulations, consumer rights,
 * e-commerce law, data protection, and platform-specific terms for GiftSync.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FileText, Scale, Shield, Users, Globe, AlertTriangle, CheckCircle, ExternalLink, Clock, Gavel } from 'lucide-react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - GiftSync</title>
        <meta 
          name="description" 
          content="GiftSync's terms and conditions covering service usage, user rights, consumer protection, and legal compliance under UK and EU law." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/terms" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                <p className="text-gray-600 mt-1">Legal terms for using the GiftSync service</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Legal Summary Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Gavel className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Legal Agreement</h2>
                <p className="text-blue-800 leading-relaxed mb-3">
                  These Terms and Conditions constitute a legally binding agreement between you and GiftSync Ltd. 
                  By using our service, you agree to be bound by these terms, which are governed by UK law and 
                  comply with EU consumer protection regulations.
                </p>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Governing Law:</span> England and Wales | 
                  <span className="font-medium ml-3">Consumer Rights:</span> UK Consumer Rights Act 2015 | 
                  <span className="font-medium ml-3">Data Protection:</span> UK GDPR and DPA 2018
                </div>
              </div>
            </div>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <a href="#acceptance" className="block text-blue-600 hover:text-blue-800 underline">1. Acceptance of Terms</a>
                <a href="#definitions" className="block text-blue-600 hover:text-blue-800 underline">2. Definitions</a>
                <a href="#service-description" className="block text-blue-600 hover:text-blue-800 underline">3. Service Description</a>
                <a href="#account-registration" className="block text-blue-600 hover:text-blue-800 underline">4. Account Registration</a>
                <a href="#user-obligations" className="block text-blue-600 hover:text-blue-800 underline">5. User Obligations</a>
                <a href="#prohibited-uses" className="block text-blue-600 hover:text-blue-800 underline">6. Prohibited Uses</a>
                <a href="#intellectual-property" className="block text-blue-600 hover:text-blue-800 underline">7. Intellectual Property</a>
                <a href="#affiliate-programme" className="block text-blue-600 hover:text-blue-800 underline">8. Affiliate Programme</a>
              </div>
              <div className="space-y-2">
                <a href="#privacy-data" className="block text-blue-600 hover:text-blue-800 underline">9. Privacy and Data Protection</a>
                <a href="#disclaimers" className="block text-blue-600 hover:text-blue-800 underline">10. Disclaimers and Warranties</a>
                <a href="#limitation-liability" className="block text-blue-600 hover:text-blue-800 underline">11. Limitation of Liability</a>
                <a href="#consumer-rights" className="block text-blue-600 hover:text-blue-800 underline">12. Consumer Rights</a>
                <a href="#termination" className="block text-blue-600 hover:text-blue-800 underline">13. Termination</a>
                <a href="#governing-law" className="block text-blue-600 hover:text-blue-800 underline">14. Governing Law</a>
                <a href="#dispute-resolution" className="block text-blue-600 hover:text-blue-800 underline">15. Dispute Resolution</a>
                <a href="#changes-terms" className="block text-blue-600 hover:text-blue-800 underline">16. Changes to Terms</a>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section id="acceptance" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing, browsing, or using the GiftSync website, mobile application, or any related services 
                  (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms and Conditions ("Terms").
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Important Notice</h3>
                  <p className="text-amber-800 text-sm">
                    If you do not agree to these Terms, you must not use our Service. Your continued use of the Service 
                    constitutes your acceptance of any modifications to these Terms.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Definitions */}
            <section id="definitions" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. Definitions</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"GiftSync", "we", "us", "our":</span>
                  <span className="text-gray-700 ml-2">GiftSync Ltd, a company incorporated in England and Wales.</span>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"User", "you", "your":</span>
                  <span className="text-gray-700 ml-2">Any individual or entity that accesses or uses our Service.</span>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"Service":</span>
                  <span className="text-gray-700 ml-2">The GiftSync platform, including website, mobile applications, and all related services.</span>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"Account":</span>
                  <span className="text-gray-700 ml-2">Your registered user account that allows access to personalised features.</span>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"Content":</span>
                  <span className="text-gray-700 ml-2">All information, data, text, images, recommendations, and other materials provided through the Service.</span>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <span className="font-semibold text-gray-900">"Affiliate Links":</span>
                  <span className="text-gray-700 ml-2">Links to third-party retailers through which we may earn commission on qualifying purchases.</span>
                </div>
              </div>
            </section>
            
            {/* Service Description */}
            <section id="service-description" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. Service Description</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  GiftSync is an AI-powered gift recommendation platform that uses machine learning algorithms to provide 
                  personalised gift suggestions based on user preferences discovered through an interactive swipe-based interface.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">Our Service Includes:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">AI-powered gift recommendations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Preference learning through swipe interactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Product discovery and search functionality</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">User analytics and preference insights</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Affiliate links to third-party retailers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Gift list sharing and collaboration features</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Cross-platform synchronisation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Customer support and assistance</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Service Availability</h4>
                  <p className="text-blue-800 text-sm">
                    We strive to maintain 99.9% service availability, but cannot guarantee uninterrupted access due to 
                    maintenance, updates, or circumstances beyond our control. We reserve the right to modify, suspend, 
                    or discontinue any aspect of the Service with reasonable notice.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Account Registration */}
            <section id="account-registration" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">4. Account Registration and Security</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Registration Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• You must be at least 16 years old to create an account</li>
                    <li>• You must provide accurate, current, and complete information</li>
                    <li>• You must have a valid email address</li>
                    <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>• You may only create one account per person</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Your Responsibilities</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Keep your login credentials secure</li>
                      <li>• Notify us immediately of any security breach</li>
                      <li>• Log out when using shared devices</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Our Security Measures</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Password encryption and hashing</li>
                      <li>• Secure HTTPS connections</li>
                      <li>• Regular security audits</li>
                      <li>• Account monitoring for suspicious activity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* User Obligations */}
            <section id="user-obligations" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">5. User Obligations and Acceptable Use</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  By using our Service, you agree to use it responsibly and in accordance with these Terms and applicable laws.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">You Agree To:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Use the Service only for lawful purposes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Provide accurate and truthful information</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Respect other users and their privacy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Comply with all applicable laws and regulations</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Protect your account credentials</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Report any bugs or security issues</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Use reasonable bandwidth and resources</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Respect intellectual property rights</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Prohibited Uses */}
            <section id="prohibited-uses" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">6. Prohibited Uses</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Strictly Prohibited Activities</h3>
                  <p className="text-red-800 text-sm mb-3">
                    The following activities are strictly prohibited and may result in immediate account termination:
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border border-red-200 rounded p-3 bg-red-50">
                      <h4 className="font-medium text-red-900 mb-1">Security Violations</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Attempting to breach security measures</li>
                        <li>• Unauthorised access to other accounts</li>
                        <li>• Reverse engineering or decompiling</li>
                        <li>• Introducing malware or viruses</li>
                      </ul>
                    </div>
                    
                    <div className="border border-orange-200 rounded p-3 bg-orange-50">
                      <h4 className="font-medium text-orange-900 mb-1">Content Violations</h4>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>• Posting illegal or harmful content</li>
                        <li>• Harassment or abusive behaviour</li>
                        <li>• Spam or unsolicited communications</li>
                        <li>• Impersonation of others</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="border border-purple-200 rounded p-3 bg-purple-50">
                      <h4 className="font-medium text-purple-900 mb-1">Commercial Misuse</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Automated data scraping or harvesting</li>
                        <li>• Reselling or redistributing our content</li>
                        <li>• Creating competing services using our data</li>
                        <li>• Manipulating affiliate links or commissions</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded p-3 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-1">Platform Abuse</h4>
                      <ul className="text-sm text-gray-800 space-y-1">
                        <li>• Excessive automated requests</li>
                        <li>• Creating multiple fake accounts</li>
                        <li>• Circumventing usage limitations</li>
                        <li>• Interfering with other users' experience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Intellectual Property */}
            <section id="intellectual-property" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">7. Intellectual Property Rights</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Our Intellectual Property</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm mb-3">
                    All content, features, and functionality of the Service, including but not limited to text, graphics, 
                    logos, images, software, algorithms, and user interfaces, are owned by GiftSync Ltd and protected by 
                    UK, EU, and international copyright, trademark, and other intellectual property laws.
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• "GiftSync" name and logo are registered trademarks</li>
                    <li>• AI algorithms and recommendation systems are proprietary</li>
                    <li>• Database rights protect our product and user data compilations</li>
                    <li>• Software code and architecture are protected by copyright</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Limited Licence to Use</h3>
                <p className="text-gray-700 text-sm">
                  We grant you a limited, non-exclusive, non-transferable licence to access and use the Service for your 
                  personal, non-commercial purposes, subject to these Terms. This licence does not include any right to:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Resell or make commercial use of the Service</li>
                    <li>• Download or copy account information for others</li>
                    <li>• Use data mining or similar data gathering tools</li>
                  </ul>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Reproduce, modify, or create derivative works</li>
                    <li>• Reverse engineer any portion of the Service</li>
                    <li>• Remove any copyright or proprietary notices</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">User-Generated Content</h3>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    You retain ownership of any content you submit to the Service (such as reviews, feedback, or preferences). 
                    However, by submitting content, you grant us a worldwide, royalty-free licence to use, reproduce, and 
                    analyse such content for the purpose of providing and improving our Service.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Affiliate Programme */}
            <section id="affiliate-programme" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">8. Affiliate Programme and Third-Party Links</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Amazon Associates Programme</h3>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-orange-800 text-sm mb-3">
                    GiftSync participates in the Amazon Associates Programme. When you purchase products through our 
                    affiliate links, we may earn a commission at no additional cost to you. This helps support our 
                    free service whilst maintaining the integrity of our AI recommendations.
                  </p>
                  <div className="text-sm text-orange-800">
                    <span className="font-medium">Transparency:</span> All affiliate links are clearly marked, and our 
                    commission structure is detailed in our 
                    <Link href="/affiliate-disclosure" className="underline hover:text-orange-900 ml-1">
                      Affiliate Disclosure
                    </Link>.
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Third-Party Services</h3>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    Our Service may contain links to third-party websites, products, or services. We are not responsible 
                    for the content, privacy policies, or practices of these third parties.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">What We Do</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Provide clear labelling of external links</li>
                        <li>• Maintain affiliate disclosure standards</li>
                        <li>• Monitor link quality and relevance</li>
                        <li>• Remove broken or inappropriate links</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">What We Don't Control</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Third-party website content or policies</li>
                        <li>• Product availability or pricing</li>
                        <li>• External service terms or conditions</li>
                        <li>• Customer service for purchases made elsewhere</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Privacy and Data Protection */}
            <section id="privacy-data" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">9. Privacy and Data Protection</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your privacy is important to us. Our collection, use, and protection of your personal data is governed 
                  by our Privacy Policy, which forms an integral part of these Terms.
                </p>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">GDPR and UK Data Protection Compliance</h3>
                  <p className="text-green-800 text-sm mb-3">
                    We comply with the General Data Protection Regulation (GDPR) and UK Data Protection Act 2018. 
                    You have comprehensive rights over your personal data, including:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-green-800">
                    <div>• Right to access your data</div>
                    <div>• Right to rectification</div>
                    <div>• Right to erasure ("right to be forgotten")</div>
                    <div>• Right to data portability</div>
                    <div>• Right to restrict processing</div>
                    <div>• Right to object to processing</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/privacy" 
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Read Our Full Privacy Policy
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Disclaimers and Warranties */}
            <section id="disclaimers" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">10. Disclaimers and Warranties</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Service Disclaimer</h3>
                  <p className="text-amber-800 text-sm">
                    The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
                    We do not warrant that the Service will be uninterrupted, error-free, or completely secure.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Recommendation Accuracy</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Whilst we strive to provide accurate and helpful gift recommendations using advanced AI algorithms, 
                  we cannot guarantee that our suggestions will be suitable for every recipient or occasion. 
                  Recommendations are based on patterns and preferences, and individual tastes may vary.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">Third-Party Product Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">We Make No Warranties About:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Product availability or pricing accuracy</li>
                      <li>• Product quality or suitability</li>
                      <li>• Delivery times or shipping costs</li>
                      <li>• Third-party return or refund policies</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">We Recommend You:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Verify product details before purchasing</li>
                      <li>• Read retailer terms and conditions</li>
                      <li>• Check return policies and warranties</li>
                      <li>• Compare prices across multiple retailers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Limitation of Liability */}
            <section id="limitation-liability" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">11. Limitation of Liability</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Liability Exclusions</h3>
                  <p className="text-red-800 text-sm mb-3">
                    To the fullest extent permitted by law, GiftSync Ltd shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages, including but not limited to loss of 
                    profits, data, or business opportunities.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Maximum Liability Cap</h3>
                <p className="text-gray-700 text-sm mb-3">
                  In no event shall our total liability to you for all damages exceed the greater of:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-6">
                  <li>• £100 (one hundred pounds sterling), or</li>
                  <li>• The amount you paid to us in the 12 months preceding the claim</li>
                </ul>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Important Note for UK/EU Consumers</h3>
                  <p className="text-blue-800 text-sm">
                    These limitations do not exclude or limit our liability for death or personal injury caused by our 
                    negligence, fraud, or any other liability that cannot be excluded or limited under UK or EU law. 
                    Your statutory consumer rights remain unaffected.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Consumer Rights */}
            <section id="consumer-rights" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">12. Consumer Rights (UK/EU)</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Your Statutory Rights</h3>
                  <p className="text-green-800 text-sm mb-3">
                    As a consumer in the UK or EU, you have statutory rights under the Consumer Rights Act 2015 (UK) 
                    and EU Consumer Protection Directives. These Terms do not affect your statutory rights.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">UK Consumer Rights Act 2015</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Digital Services:</span> Must be supplied with reasonable care and skill
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Right to Repair:</span> Free remedy if service doesn't meet contract terms
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Right to Refund:</span> Full or partial refund if remedy isn't possible
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">EU Consumer Protection</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Withdrawal Right:</span> 14-day cooling-off period for distance contracts
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Unfair Terms:</span> Protection against unfair contract terms
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Alternative Dispute Resolution:</span> Access to ADR platforms
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">How to Exercise Your Rights</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    To exercise any of your consumer rights or to make a complaint:
                  </p>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>• Contact us at <a href="mailto:support@giftsync.com" className="underline">support@giftsync.com</a></div>
                    <div>• Use the EU Online Dispute Resolution platform: <a href="https://ec.europa.eu/consumers/odr" className="underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a></div>
                    <div>• Contact Citizens Advice (UK) or your local consumer protection authority</div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Termination */}
            <section id="termination" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">13. Termination</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Right to Terminate</h3>
                <p className="text-gray-700 text-sm mb-3">
                  You may terminate your account at any time by:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-6">
                  <li>• Deleting your account through account settings</li>
                  <li>• Contacting our support team at <a href="mailto:support@giftsync.com" className="text-blue-600 underline">support@giftsync.com</a></li>
                  <li>• Sending written notice to our registered address</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900">Our Right to Terminate</h3>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm mb-3">
                    We may suspend or terminate your account immediately without notice if you:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Violate these Terms or our policies</li>
                    <li>• Engage in fraudulent or illegal activities</li>
                    <li>• Pose a security risk to our Service or other users</li>
                    <li>• Repeatedly infringe intellectual property rights</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Effect of Termination</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 p-3 rounded">
                    <h4 className="font-medium text-red-900 mb-2">What Happens</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Immediate loss of access to your account</li>
                      <li>• Deletion of personal data (subject to retention periods)</li>
                      <li>• Termination of all licences granted to you</li>
                      <li>• Cessation of all services</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <h4 className="font-medium text-blue-900 mb-2">What Survives</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Intellectual property provisions</li>
                      <li>• Limitation of liability clauses</li>
                      <li>• Governing law and dispute resolution</li>
                      <li>• Any accrued payment obligations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Governing Law */}
            <section id="governing-law" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">14. Governing Law and Jurisdiction</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Applicable Law</h3>
                  <p className="text-blue-800 text-sm">
                    These Terms and any dispute or claim arising out of or in connection with them shall be governed by 
                    and construed in accordance with the laws of England and Wales.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Jurisdiction</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Business Users</h4>
                    <p className="text-sm text-gray-700">
                      Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <h4 className="font-medium text-green-900 mb-2">Consumer Users</h4>
                    <p className="text-sm text-green-800">
                      You may bring proceedings in your local courts or the courts of England and Wales, whichever is more convenient for you.
                    </p>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">EU Users</h3>
                  <p className="text-purple-800 text-sm">
                    Nothing in these Terms affects your rights as a consumer under EU law. EU consumers retain the right 
                    to bring proceedings in their country of residence or habitual residence.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Dispute Resolution */}
            <section id="dispute-resolution" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">15. Dispute Resolution</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informal Resolution</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Before initiating formal proceedings, we encourage you to contact us directly to resolve any disputes. 
                  Most issues can be resolved quickly through direct communication.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">UK Dispute Resolution</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Citizens Advice:</span> Free, impartial advice on consumer rights
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Trading Standards:</span> Local authority consumer protection
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Financial Ombudsman:</span> For financial service disputes
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">EU Alternative Dispute Resolution</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">ODR Platform:</span> 
                        <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 underline ml-1" target="_blank" rel="noopener noreferrer">
                          ec.europa.eu/consumers/odr
                        </a>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">National ADR Bodies:</span> Country-specific dispute resolution services
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <span className="font-medium">Consumer Centres:</span> European Consumer Centre network
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Mediation</h3>
                  <p className="text-blue-800 text-sm">
                    We are committed to participating in good faith mediation before any court proceedings. 
                    This can often provide a faster, less expensive resolution for all parties.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Changes to Terms */}
            <section id="changes-terms" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">16. Changes to These Terms</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">How We Update These Terms</h3>
                <p className="text-gray-700 text-sm mb-3">
                  We may update these Terms from time to time to reflect changes in our services, legal requirements, 
                  or business practices. We will notify you of any material changes by:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Posting the updated Terms on this page</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Updating the "last updated" date</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Sending email notification for significant changes</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Displaying a prominent notice on our website</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">In-app notifications for major changes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Reasonable advance notice period</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Acceptance of Changes</h3>
                  <p className="text-amber-800 text-sm">
                    Your continued use of the Service after we publish changes constitutes your acceptance of the updated Terms. 
                    If you do not agree to the changes, you must stop using the Service and may terminate your account.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Consumer Protection</h3>
                  <p className="text-green-800 text-sm">
                    For consumers, any changes that significantly affect your rights will be subject to appropriate notice periods 
                    as required by consumer protection laws in your jurisdiction.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Legal Enquiries</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gray-500" />
                      <a href="mailto:legal@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        legal@giftsync.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <a href="mailto:support@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        support@giftsync.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Company Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span>GiftSync Ltd</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>Registered in England and Wales</span>
                    </div>
                  </div>
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
              <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">
                Cookie Policy
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

export default TermsAndConditionsPage;