/**
 * Privacy Policy Page
 * 
 * Comprehensive GDPR-compliant privacy policy that meets UK Data Protection Act 2018,
 * EU General Data Protection Regulation (GDPR), and international privacy standards.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Eye, Lock, FileText, Users, Globe, Mail, Phone, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - GiftSync</title>
        <meta 
          name="description" 
          content="GiftSync's comprehensive privacy policy outlining how we collect, use, and protect your personal data in compliance with GDPR and UK data protection laws." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/privacy" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600 mt-1">How we protect and handle your personal data</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* GDPR Summary Box */}
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-green-900 mb-2">Your Privacy Rights</h2>
                <p className="text-green-800 leading-relaxed mb-3">
                  Under the General Data Protection Regulation (GDPR) and UK Data Protection Act 2018, you have 
                  comprehensive rights over your personal data. We are committed to protecting your privacy and 
                  providing transparent information about how we handle your data.
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Right to access your data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Right to rectification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Right to erasure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">Right to data portability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Table of Contents */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <a href="#controller" className="block text-blue-600 hover:text-blue-800 underline">1. Data Controller Information</a>
                <a href="#data-collection" className="block text-blue-600 hover:text-blue-800 underline">2. What Data We Collect</a>
                <a href="#legal-basis" className="block text-blue-600 hover:text-blue-800 underline">3. Legal Basis for Processing</a>
                <a href="#data-use" className="block text-blue-600 hover:text-blue-800 underline">4. How We Use Your Data</a>
                <a href="#data-sharing" className="block text-blue-600 hover:text-blue-800 underline">5. Data Sharing and Transfers</a>
              </div>
              <div className="space-y-2">
                <a href="#data-retention" className="block text-blue-600 hover:text-blue-800 underline">6. Data Retention</a>
                <a href="#your-rights" className="block text-blue-600 hover:text-blue-800 underline">7. Your Privacy Rights</a>
                <a href="#security" className="block text-blue-600 hover:text-blue-800 underline">8. Data Security</a>
                <a href="#cookies" className="block text-blue-600 hover:text-blue-800 underline">9. Cookies and Tracking</a>
                <a href="#contact" className="block text-blue-600 hover:text-blue-800 underline">10. Contact Information</a>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Data Controller Information */}
            <section id="controller" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Data Controller Information</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  GiftSync operates as the data controller for personal data processed through our platform. 
                  We are responsible for determining how and why your personal data is processed.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-3">Company Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Company:</span>
                      <span>GiftSync Ltd</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Registered Address:</span>
                      <span>United Kingdom</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Data Protection Officer:</span>
                      <a href="mailto:privacy@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        privacy@giftsync.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">EU Representative:</span>
                      <span>Available upon request for EU data subjects</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* What Data We Collect */}
            <section id="data-collection" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. What Data We Collect</h2>
              </div>
              <div className="space-y-6">
                {/* Account Data */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Account and Profile Data
                  </h3>
                  <div className="text-blue-800 text-sm space-y-1">
                    <div><span className="font-medium">Registration Data:</span> First name, last name, email address</div>
                    <div><span className="font-medium">Authentication Data:</span> Encrypted password, login timestamps</div>
                    <div><span className="font-medium">Profile Preferences:</span> Gift categories, spending preferences, demographic information (optional)</div>
                    <div><span className="font-medium">Marketing Consent:</span> Your consent preferences for marketing communications</div>
                  </div>
                </div>
                
                {/* Usage Data */}
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Usage and Interaction Data
                  </h3>
                  <div className="text-purple-800 text-sm space-y-1">
                    <div><span className="font-medium">Swipe Data:</span> Product preferences (like/dislike), session data, interaction timestamps</div>
                    <div><span className="font-medium">Recommendation Data:</span> Products you viewed, clicked, or purchased through our links</div>
                    <div><span className="font-medium">Search Data:</span> Search queries, filter preferences, browsing history on our platform</div>
                    <div><span className="font-medium">Analytics Data:</span> Page views, time spent, feature usage, user journey data</div>
                  </div>
                </div>
                
                {/* Technical Data */}
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Technical and Device Data
                  </h3>
                  <div className="text-orange-800 text-sm space-y-1">
                    <div><span className="font-medium">Device Information:</span> Device type, operating system, browser type and version</div>
                    <div><span className="font-medium">Network Data:</span> IP address, location data (country/region level), internet service provider</div>
                    <div><span className="font-medium">Performance Data:</span> Page load times, error logs, system performance metrics</div>
                    <div><span className="font-medium">Cookies:</span> Session cookies, preference cookies, analytics cookies (see Cookie Policy)</div>
                  </div>
                </div>
                
                {/* Communication Data */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Communication Data
                  </h3>
                  <div className="text-green-800 text-sm space-y-1">
                    <div><span className="font-medium">Support Communications:</span> Messages, emails, and other communications with our support team</div>
                    <div><span className="font-medium">Marketing Communications:</span> Email engagement data (open rates, click rates) if you've consented</div>
                    <div><span className="font-medium">Feedback Data:</span> Reviews, ratings, survey responses, and user feedback</div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Legal Basis for Processing */}
            <section id="legal-basis" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. Legal Basis for Processing</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Under GDPR, we must have a legal basis for processing your personal data. Here are the legal bases we rely on:
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contract Performance</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Processing necessary to provide our gift recommendation service, maintain your account, and deliver the core platform functionality.
                  </p>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Data types:</span> Account data, authentication data, core usage data
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Legitimate Interest</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Processing necessary for our legitimate business interests, such as improving our service, analytics, security, and fraud prevention.
                  </p>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Data types:</span> Analytics data, technical data, recommendation improvement data
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Consent</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Processing based on your explicit consent, which you can withdraw at any time through your account settings.
                  </p>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Data types:</span> Marketing communications, optional analytics, non-essential cookies
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Obligation</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Processing necessary to comply with legal obligations, such as tax requirements and regulatory compliance.
                  </p>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Data types:</span> Transaction records, affiliate commission data, compliance records
                  </div>
                </div>
              </div>
            </section>
            
            {/* How We Use Your Data */}
            <section id="data-use" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">4. How We Use Your Data</h2>
              </div>
              <p className="text-gray-700 mb-4">We use your personal data for the following purposes:</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Service Provision</h3>
                      <p className="text-sm text-gray-600">Providing AI-powered gift recommendations, managing your account, and delivering core platform features</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Personalisation</h3>
                      <p className="text-sm text-gray-600">Tailoring recommendations based on your preferences, improving suggestion accuracy over time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Communication</h3>
                      <p className="text-sm text-gray-600">Sending service updates, responding to inquiries, providing customer support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Legal Compliance</h3>
                      <p className="text-sm text-gray-600">Meeting legal obligations, maintaining records, complying with regulations</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics and Improvement</h3>
                      <p className="text-sm text-gray-600">Analysing usage patterns, improving our algorithms, enhancing user experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Security and Fraud Prevention</h3>
                      <p className="text-sm text-gray-600">Protecting your account, detecting suspicious activity, maintaining platform security</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Marketing (with consent)</h3>
                      <p className="text-sm text-gray-600">Sending promotional emails, product updates, and relevant offers (only if you've opted in)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900">Affiliate Revenue</h3>
                      <p className="text-sm text-gray-600">Tracking affiliate link performance to support our free service model</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Data Sharing and Transfers */}
            <section id="data-sharing" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">5. Data Sharing and International Transfers</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-red-900 mb-2">We Do Not Sell Your Data</h3>
                  <p className="text-red-800 text-sm">
                    We never sell, rent, or trade your personal data to third parties for their marketing purposes.
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">When We Share Your Data:</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                    <p className="text-gray-700 text-sm mb-2">
                      We share data with trusted service providers who help us operate our platform:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• <span className="font-medium">Supabase:</span> Database hosting and management (EU/UK)</li>
                      <li>• <span className="font-medium">Vercel:</span> Website hosting and deployment (Global CDN)</li>
                      <li>• <span className="font-medium">PostHog:</span> Analytics and user behaviour analysis (EU)</li>
                      <li>• <span className="font-medium">Amazon Associates:</span> Affiliate tracking (anonymised)</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                    <p className="text-gray-700 text-sm">
                      We may disclose your data if required by law, legal process, or to protect our rights, 
                      your safety, or the safety of others.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                    <p className="text-gray-700 text-sm">
                      In the event of a merger, acquisition, or sale of assets, your data may be transferred 
                      to the new entity, subject to the same privacy protections.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">International Data Transfers</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Your data may be transferred to and processed in countries outside the UK/EU. We ensure adequate 
                    protection through:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>• Adequacy decisions by the European Commission</li>
                    <li>• Standard Contractual Clauses (SCCs)</li>
                    <li>• Appropriate technical and organisational measures</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Data Retention */}
            <section id="data-retention" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">6. Data Retention</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Data Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Retention Period</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Account Data</td>
                      <td className="border border-gray-300 px-4 py-2">Until account deletion + 30 days</td>
                      <td className="border border-gray-300 px-4 py-2">Service provision and security</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Preference Data</td>
                      <td className="border border-gray-300 px-4 py-2">Until account deletion</td>
                      <td className="border border-gray-300 px-4 py-2">Personalisation and recommendations</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Usage Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">26 months (aggregated data permanent)</td>
                      <td className="border border-gray-300 px-4 py-2">Service improvement and analytics</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">Communication Records</td>
                      <td className="border border-gray-300 px-4 py-2">6 years</td>
                      <td className="border border-gray-300 px-4 py-2">Legal compliance and support</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Transaction Data</td>
                      <td className="border border-gray-300 px-4 py-2">7 years</td>
                      <td className="border border-gray-300 px-4 py-2">Tax and legal compliance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-yellow-800 text-sm">
                  <span className="font-medium">Anonymised Data:</span> We may retain anonymised and aggregated data 
                  indefinitely for research and service improvement purposes, as it cannot be used to identify you.
                </p>
              </div>
            </section>
            
            {/* Your Privacy Rights */}
            <section id="your-rights" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">7. Your Privacy Rights</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Under GDPR and UK data protection law, you have the following rights regarding your personal data:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Right of Access</h3>
                    <p className="text-green-800 text-sm mb-2">
                      Request a copy of the personal data we hold about you and information about how we process it.
                    </p>
                    <button className="text-green-700 text-xs underline hover:text-green-900">
                      Request Data Copy
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Right to Rectification</h3>
                    <p className="text-blue-800 text-sm mb-2">
                      Correct any inaccurate or incomplete personal data we hold about you.
                    </p>
                    <button className="text-blue-700 text-xs underline hover:text-blue-900">
                      Update Profile
                    </button>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Right to Erasure</h3>
                    <p className="text-red-800 text-sm mb-2">
                      Request deletion of your personal data in certain circumstances.
                    </p>
                    <button className="text-red-700 text-xs underline hover:text-red-900">
                      Delete Account
                    </button>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Right to Data Portability</h3>
                    <p className="text-purple-800 text-sm mb-2">
                      Receive your personal data in a structured, machine-readable format.
                    </p>
                    <button className="text-purple-700 text-xs underline hover:text-purple-900">
                      Export Data
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Right to Restrict Processing</h3>
                    <p className="text-orange-800 text-sm mb-2">
                      Limit how we process your personal data in certain circumstances.
                    </p>
                    <button className="text-orange-700 text-xs underline hover:text-orange-900">
                      Manage Processing
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Right to Object</h3>
                    <p className="text-gray-800 text-sm mb-2">
                      Object to processing based on legitimate interests or for direct marketing.
                    </p>
                    <button className="text-gray-700 text-xs underline hover:text-gray-900">
                      Object to Processing
                    </button>
                  </div>
                  
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-900 mb-2">Right to Withdraw Consent</h3>
                    <p className="text-indigo-800 text-sm mb-2">
                      Withdraw your consent for processing at any time where we rely on consent.
                    </p>
                    <button className="text-indigo-700 text-xs underline hover:text-indigo-900">
                      Manage Consent
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Right to Complain</h3>
                    <p className="text-yellow-800 text-sm mb-2">
                      Lodge a complaint with the Information Commissioner's Office (ICO) if you're unsatisfied.
                    </p>
                    <a 
                      href="https://ico.org.uk/make-a-complaint/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-yellow-700 text-xs underline hover:text-yellow-900"
                    >
                      ICO Complaints
                    </a>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Data Security */}
            <section id="security" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">8. Data Security</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organisational measures to protect your personal data:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">End-to-end encryption in transit (HTTPS/TLS)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Encryption at rest for sensitive data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Password hashing with industry-standard algorithms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Regular security updates and patches</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Access controls and authentication systems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Regular security assessments and monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Secure hosting with reputable providers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Incident response and breach notification procedures</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-900 mb-1">Data Breach Notification</h3>
                    <p className="text-orange-800 text-sm">
                      In the unlikely event of a data breach affecting your personal data, we will notify you and 
                      the relevant authorities within 72 hours as required by GDPR.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Cookies and Tracking */}
            <section id="cookies" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">9. Cookies and Tracking Technologies</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to improve your experience and analyse how you use our service. 
                For detailed information about our use of cookies, please see our 
                <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline ml-1">
                  Cookie Policy
                </Link>.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-blue-900 mb-2">Cookie Management</h3>
                <p className="text-blue-800 text-sm mb-3">
                  You can control your cookie preferences through your browser settings or our cookie preference centre.
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Manage Cookie Preferences
                </button>
              </div>
            </section>
            
            {/* Contact Information */}
            <section id="contact" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">10. Contact Information</h2>
              </div>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, want to exercise your rights, or have concerns about how we handle your data:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Data Protection Officer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href="mailto:privacy@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        privacy@giftsync.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href="mailto:support@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        support@giftsync.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Supervisory Authority</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">UK:</span> Information Commissioner's Office (ICO)
                    </div>
                    <div>
                      <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                        ico.org.uk
                      </a>
                    </div>
                    <div>
                      <a href="tel:+443031231113" className="text-blue-600 hover:text-blue-800 underline">
                        0303 123 1113
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Updates to Policy */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
                legal requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "last updated" date</li>
                <li>Sending you an email notification for significant changes</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-sm text-gray-600">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your data.
                </p>
              </div>
            </section>
          </div>
          
          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
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

export default PrivacyPolicyPage;