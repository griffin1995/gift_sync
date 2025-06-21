/**
 * Data Protection Rights Page
 * 
 * Comprehensive page detailing GDPR data subject rights, how to exercise them,
 * and data protection information for GiftSync users.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Download, Edit, Trash2, Eye, Lock, AlertCircle, CheckCircle, Mail, Globe, Clock, Users } from 'lucide-react';

const DataProtectionRightsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Data Protection Rights - GiftSync</title>
        <meta 
          name="description" 
          content="Learn about your data protection rights under GDPR and UK data protection law, including how to access, correct, delete, or export your personal data from GiftSync." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/data-protection" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Protection Rights</h1>
                <p className="text-gray-600 mt-1">Your rights under GDPR and UK data protection law</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* GDPR Rights Summary */}
          <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900 mb-2">Your Data Protection Rights</h2>
                <p className="text-purple-800 leading-relaxed mb-3">
                  Under the General Data Protection Regulation (GDPR) and UK Data Protection Act 2018, you have 
                  comprehensive rights over how your personal data is collected, used, and stored. These rights are 
                  fundamental to your privacy and we are committed to making them easy to exercise.
                </p>
                <div className="text-sm text-purple-800">
                  <span className="font-medium">Quick Access:</span> Use the action buttons throughout this page to exercise your rights immediately, 
                  or contact us at <a href="mailto:privacy@giftsync.com" className="underline hover:text-purple-900">privacy@giftsync.com</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                <Download className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Download My Data</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                <Edit className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-900">Update Profile</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                <Lock className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Privacy Settings</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-6 h-6 text-red-600" />
                <span className="text-sm font-medium text-red-900">Delete Account</span>
              </button>
            </div>
          </div>
          
          {/* Main Rights Sections */}
          <div className="space-y-8">
            {/* Right of Access */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right of Access (Article 15 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to obtain confirmation that we are processing your personal data and, 
                    if so, to access that data along with specific information about how we process it.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">What You Can Request:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• A copy of all personal data we hold about you</li>
                    <li>• The purposes of processing</li>
                    <li>• Categories of personal data</li>
                    <li>• Recipients of your data</li>
                    <li>• Data retention periods</li>
                    <li>• Your rights regarding the data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">How to Exercise This Right</h3>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Data Subject Access Request</h4>
                    <p className="text-blue-800 text-sm mb-3">
                      We will provide you with a comprehensive report of all personal data we hold about you.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      Request My Data
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Response Time:</span> Within 1 month (free of charge)
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Format:</span> Secure PDF or JSON export
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Rectification */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Edit className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Rectification (Article 16 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to have inaccurate personal data corrected and incomplete personal data completed.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">You Can Request:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• Correction of factual errors in your data</li>
                    <li>• Completion of incomplete information</li>
                    <li>• Updates to outdated information</li>
                    <li>• Supplementary information where relevant</li>
                  </ul>
                  
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <p className="text-green-800 text-sm">
                      <span className="font-medium">Automatic Updates:</span> Some data (like preferences) 
                      updates automatically as you use the service.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">How to Make Corrections</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Self-Service Options</h4>
                      <ul className="text-sm text-green-800 space-y-1 mb-3">
                        <li>• Update profile information in account settings</li>
                        <li>• Modify preferences through the app interface</li>
                        <li>• Change email address or contact details</li>
                      </ul>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                        Update Profile
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Request Assistance</h4>
                      <p className="text-gray-700 text-sm mb-3">
                        For complex corrections or data you cannot edit yourself, contact our support team.
                      </p>
                      <a 
                        href="mailto:privacy@giftsync.com" 
                        className="text-blue-600 text-sm underline hover:text-blue-800"
                      >
                        privacy@giftsync.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Erasure */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Erasure - "Right to be Forgotten" (Article 17 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to have your personal data erased without undue delay in certain circumstances.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">When This Applies:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• The data is no longer necessary for its original purpose</li>
                    <li>• You withdraw consent (where consent was the legal basis)</li>
                    <li>• You object to processing based on legitimate interests</li>
                    <li>• The data has been unlawfully processed</li>
                    <li>• Erasure is required for compliance with legal obligations</li>
                  </ul>
                  
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                    <h4 className="font-medium text-amber-900 mb-1">Important Limitations</h4>
                    <p className="text-amber-800 text-sm">
                      We may need to retain some data for legal compliance, 
                      such as transaction records for tax purposes.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Deletion Options</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Complete Account Deletion</h4>
                      <p className="text-red-800 text-sm mb-3">
                        Permanently delete your account and all associated personal data. 
                        This action cannot be undone.
                      </p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Selective Data Deletion</h4>
                      <p className="text-orange-800 text-sm mb-3">
                        Request deletion of specific categories of data whilst keeping your account active.
                      </p>
                      <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition-colors">
                        Selective Deletion
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Processing Time:</span> Within 30 days
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Retention:</span> Some data may be retained for legal compliance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Data Portability */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Data Portability (Article 20 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to receive your personal data in a structured, commonly used, 
                    machine-readable format and to transmit it to another service provider.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Included Data:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• Account and profile information</li>
                    <li>• Preference data and swipe history</li>
                    <li>• Recommendation history</li>
                    <li>• Usage analytics (anonymised)</li>
                    <li>• Communication history</li>
                  </ul>
                  
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                    <p className="text-purple-800 text-sm">
                      <span className="font-medium">Standards:</span> Data exported in JSON format 
                      following industry standards for easy import elsewhere.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Export Your Data</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Complete Data Export</h4>
                      <p className="text-purple-800 text-sm mb-3">
                        Download all your personal data in a machine-readable format. 
                        Perfect for transferring to another service or personal backup.
                      </p>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors">
                        Export All Data
                      </button>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Selective Export</h4>
                      <p className="text-blue-800 text-sm mb-3">
                        Choose specific categories of data to export, such as only preferences or recommendations.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        Custom Export
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Format:</span> JSON, CSV, or XML
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Delivery:</span> Secure download link via email
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Restrict Processing */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Restrict Processing (Article 18 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to restrict the processing of your personal data in certain circumstances, 
                    meaning we can store it but not actively use it.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">When You Can Restrict:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• You contest the accuracy of the data</li>
                    <li>• Processing is unlawful but you don't want erasure</li>
                    <li>• We no longer need the data but you need it for legal claims</li>
                    <li>• You've objected to processing pending verification</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">How to Restrict Processing</h3>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-orange-900 mb-2">Processing Controls</h4>
                    <p className="text-orange-800 text-sm mb-3">
                      Temporarily limit how we use your data whilst maintaining your account and core functionality.
                    </p>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition-colors">
                      Request Restriction
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Effect:</span> Data stored but not used for recommendations or analytics
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Duration:</span> Until restriction is lifted or data is erased
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Object */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Object (Article 21 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    You have the right to object to the processing of your personal data based on legitimate interests 
                    or for direct marketing purposes.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">You Can Object To:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• Processing for legitimate interests</li>
                    <li>• Direct marketing communications</li>
                    <li>• Profiling for marketing purposes</li>
                    <li>• Processing for scientific or historical research</li>
                  </ul>
                  
                  <div className="bg-indigo-50 border border-indigo-200 p-3 rounded">
                    <p className="text-indigo-800 text-sm">
                      <span className="font-medium">Absolute Right:</span> You can always object to 
                      direct marketing - we must stop immediately.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Objection Options</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                      <h4 className="font-medium text-indigo-900 mb-2">Marketing Communications</h4>
                      <p className="text-indigo-800 text-sm mb-3">
                        Opt out of all marketing emails and promotional communications.
                      </p>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition-colors">
                        Unsubscribe from Marketing
                      </button>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Data Processing</h4>
                      <p className="text-blue-800 text-sm mb-3">
                        Object to specific types of data processing whilst keeping your account active.
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        Object to Processing
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Right to Withdraw Consent */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Right to Withdraw Consent (Article 7 GDPR)</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What This Means</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Where we process your data based on consent, you have the right to withdraw that consent 
                    at any time. Withdrawal does not affect the lawfulness of processing before withdrawal.
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Consent-Based Processing:</h4>
                  <ul className="text-sm text-gray-700 space-y-1 mb-4">
                    <li>• Marketing communications</li>
                    <li>• Optional analytics and tracking</li>
                    <li>• Non-essential cookies</li>
                    <li>• Research participation</li>
                    <li>• Beta feature testing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Manage Your Consent</h3>
                  
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-green-900 mb-2">Consent Dashboard</h4>
                    <p className="text-green-800 text-sm mb-3">
                      View and manage all your consent preferences in one place. 
                      Changes take effect immediately.
                    </p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                      Manage Consent
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Easy Withdrawal:</span> One-click consent withdrawal
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Granular Control:</span> Consent per purpose, not all-or-nothing
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* How to Exercise Your Rights */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">How to Exercise Your Rights</h2>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Self-Service</h3>
                    <p className="text-blue-800 text-sm mb-3">
                      Use your account settings to update information, manage preferences, or delete your account.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      Account Settings
                    </button>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                    <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Email Request</h3>
                    <p className="text-green-800 text-sm mb-3">
                      Contact our Data Protection Officer for complex requests or assistance.
                    </p>
                    <a 
                      href="mailto:privacy@giftsync.com" 
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      privacy@giftsync.com
                    </a>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Online Form</h3>
                    <p className="text-purple-800 text-sm mb-3">
                      Use our secure online form for formal data protection requests.
                    </p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors">
                      Submit Request
                    </button>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Important Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
                    <div>
                      <p className="mb-2"><span className="font-medium">Response Time:</span> We respond to all requests within 1 month (may be extended to 3 months for complex requests)</p>
                      <p><span className="font-medium">Identity Verification:</span> We may need to verify your identity before processing sensitive requests</p>
                    </div>
                    <div>
                      <p className="mb-2"><span className="font-medium">Free of Charge:</span> Most requests are processed free of charge</p>
                      <p><span className="font-medium">Appeal Process:</span> You can appeal our decisions or contact the ICO if unsatisfied</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Contact and Complaints */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contact and Complaints</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Our Data Protection Team</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Primary Contact:</span>
                      <a href="mailto:privacy@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        privacy@giftsync.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Support Team:</span>
                      <a href="mailto:support@giftsync.com" className="text-blue-600 hover:text-blue-800 underline">
                        support@giftsync.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Response Time:</span>
                      <span>Within 48 hours</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Regulatory Authorities</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded border">
                      <h4 className="font-medium text-gray-900 mb-1">UK - Information Commissioner's Office (ICO)</h4>
                      <p className="text-gray-700 mb-2">If you're unsatisfied with our response, you can lodge a complaint with the ICO.</p>
                      <div className="space-y-1">
                        <div>Website: <a href="https://ico.org.uk" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></div>
                        <div>Phone: <a href="tel:+443031231113" className="text-blue-600 underline">0303 123 1113</a></div>
                        <div>Email: <a href="mailto:casework@ico.org.uk" className="text-blue-600 underline">casework@ico.org.uk</a></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border">
                      <h4 className="font-medium text-gray-900 mb-1">EU - Your Local Data Protection Authority</h4>
                      <p className="text-gray-700">EU residents can contact their national data protection authority.</p>
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
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms and Conditions
              </Link>
              <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">
                Cookie Policy
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

export default DataProtectionRightsPage;