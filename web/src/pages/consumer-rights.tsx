/**
 * Consumer Rights Page
 * 
 * Comprehensive consumer rights information page complying with UK Consumer Rights Act 2015,
 * EU Consumer Protection Directives, and international consumer protection standards.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Scale, Shield, Clock, RefreshCw, AlertTriangle, CheckCircle, ExternalLink, Phone, Mail, FileText, Globe } from 'lucide-react';

const ConsumerRightsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Consumer Rights - GiftSync</title>
        <meta 
          name="description" 
          content="Learn about your consumer rights when using GiftSync, including protections under UK Consumer Rights Act 2015 and EU consumer protection law." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/consumer-rights" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Consumer Rights</h1>
                <p className="text-gray-600 mt-1">Your rights and protections when using GiftSync</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Consumer Rights Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Your Consumer Rights</h2>
                <p className="text-blue-800 leading-relaxed mb-3">
                  As a consumer using GiftSync's services, you are protected by comprehensive consumer rights under 
                  UK law (Consumer Rights Act 2015) and EU consumer protection directives. These rights ensure you 
                  receive fair treatment and quality service.
                </p>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Your Rights Include:</span> Quality service guarantee, clear information, 
                  fair contract terms, effective remedies, and dispute resolution access
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Reference */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Reference Guide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 text-sm">Service Quality</h3>
                <p className="text-xs text-green-700 mt-1">Right to service with reasonable care and skill</p>
              </div>
              <div className="text-center p-4 border border-blue-200 rounded-lg bg-blue-50">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 text-sm">Right to Remedy</h3>
                <p className="text-xs text-blue-700 mt-1">Free repair or refund if service doesn't meet standards</p>
              </div>
              <div className="text-center p-4 border border-purple-200 rounded-lg bg-purple-50">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 text-sm">Cancellation Rights</h3>
                <p className="text-xs text-purple-700 mt-1">14-day cooling-off period for distance contracts</p>
              </div>
              <div className="text-center p-4 border border-orange-200 rounded-lg bg-orange-50">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900 text-sm">Unfair Terms</h3>
                <p className="text-xs text-orange-700 mt-1">Protection against unfair contract terms</p>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* UK Consumer Rights Act 2015 */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">UK Consumer Rights Act 2015</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  The Consumer Rights Act 2015 provides comprehensive protection for consumers in the UK. 
                  Here's how these rights apply to your use of GiftSync:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Digital Services Rights</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Right to Service Quality</h4>
                        <p className="text-green-800 text-sm mb-2">
                          GiftSync must provide its recommendation service with reasonable care and skill, 
                          matching the description provided and being fit for purpose.
                        </p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• AI recommendations should work as described</li>
                          <li>• Platform should be available and functional</li>
                          <li>• Features should match advertised capabilities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Right to Remedy</h4>
                        <p className="text-blue-800 text-sm mb-2">
                          If our service doesn't meet the required standards, you have the right to:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Request we fix the problem (at no cost to you)</li>
                          <li>• Receive a price reduction if fixing isn't possible</li>
                          <li>• Get a refund if neither repair nor reduction is appropriate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Information Requirements</h3>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Pre-Contract Information</h4>
                      <p className="text-gray-700 text-sm mb-2">
                        Before you start using our service, we must provide clear information about:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Main characteristics of our service</li>
                        <li>• Our identity and contact details</li>
                        <li>• Total price and additional charges</li>
                        <li>• Duration of contract and cancellation rights</li>
                        <li>• Complaints handling and dispute resolution</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Contract Terms</h4>
                      <p className="text-yellow-800 text-sm">
                        All contract terms must be transparent and fair. Any terms that create significant 
                        imbalance between our rights and yours may be deemed unfair and unenforceable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* EU Consumer Protection Rights */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">EU Consumer Protection Rights</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  For users in the European Union, additional consumer protection rights apply under 
                  EU Consumer Rights Directive and related legislation:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">14-Day Withdrawal Right</h3>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Cooling-Off Period</h4>
                      <p className="text-purple-800 text-sm mb-3">
                        You have 14 days to withdraw from any contract for digital services without giving a reason. 
                        This period starts from the day the contract is concluded.
                      </p>
                      <div className="text-xs text-purple-700">
                        <div className="mb-1"><span className="font-medium">How to withdraw:</span> Email us at support@giftsync.com</div>
                        <div className="mb-1"><span className="font-medium">Refund timeline:</span> Within 14 days of withdrawal notice</div>
                        <div><span className="font-medium">Exceptions:</span> Services fully performed with your consent</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Digital Content Rights</h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Conformity Requirements</h4>
                      <p className="text-blue-800 text-sm mb-3">
                        Digital services must conform to the contract and be fit for purpose. 
                        If they don't, you're entitled to:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Bring the service into conformity (repair)</li>
                        <li>• Proportionate price reduction</li>
                        <li>• Termination of contract and refund</li>
                        <li>• Compensation for damages</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Alternative Dispute Resolution</h3>
                  <p className="text-green-800 text-sm mb-3">
                    EU consumers have access to alternative dispute resolution mechanisms, including the 
                    Online Dispute Resolution (ODR) platform provided by the European Commission.
                  </p>
                  <div className="text-sm">
                    <a 
                      href="https://ec.europa.eu/consumers/odr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-700 underline hover:text-green-900 flex items-center gap-1"
                    >
                      EU ODR Platform <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Service Standards and Quality */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Service Standards and Quality Guarantees</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We commit to providing high-quality service that meets professional standards. 
                  Here's what you can expect from GiftSync:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Our Service Commitments</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-green-900 text-sm">Platform Availability</div>
                          <div className="text-xs text-green-700">99.9% uptime with scheduled maintenance notifications</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-green-900 text-sm">Recommendation Quality</div>
                          <div className="text-xs text-green-700">AI algorithms continuously improved based on user feedback</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-green-900 text-sm">Data Security</div>
                          <div className="text-xs text-green-700">Industry-standard encryption and security measures</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-green-900 text-sm">Customer Support</div>
                          <div className="text-xs text-green-700">Responsive support within 48 hours for all enquiries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Performance Standards</h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3">Measurable Quality Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-800">Response Time:</span>
                          <span className="font-medium text-blue-900">&lt;2 seconds page load</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Support Response:</span>
                          <span className="font-medium text-blue-900">&lt;48 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">Data Accuracy:</span>
                          <span className="font-medium text-blue-900">&gt;99% product data accuracy</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-800">User Satisfaction:</span>
                          <span className="font-medium text-blue-900">&gt;4.5/5 average rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-3">
                      <h4 className="font-medium text-yellow-900 mb-2">Service Level Agreement</h4>
                      <p className="text-yellow-800 text-sm">
                        If we fail to meet these standards, you may be entitled to service credits, 
                        remedial action, or in severe cases, contract termination and refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Pricing and Payment Rights */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Pricing Transparency and Payment Rights</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You have the right to clear, accurate pricing information and fair payment terms.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Pricing Rights</h3>
                    <div className="space-y-3">
                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Free Service Guarantee</h4>
                        <p className="text-orange-800 text-sm mb-2">
                          GiftSync's core recommendation service is provided free of charge. 
                          You will never be charged for basic functionality.
                        </p>
                        <ul className="text-xs text-orange-700 space-y-1">
                          <li>• No hidden charges or surprise fees</li>
                          <li>• Clear notification before any premium features</li>
                          <li>• Option to decline premium services</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Future Premium Services</h4>
                        <p className="text-blue-800 text-sm mb-2">
                          If we introduce premium features in the future:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Clear pricing displayed before purchase</li>
                          <li>• 14-day cooling-off period for new subscriptions</li>
                          <li>• Easy cancellation process</li>
                          <li>• Pro-rata refunds where applicable</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Affiliate Transparency</h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">No Cost to You</h4>
                      <p className="text-green-800 text-sm mb-3">
                        While we earn commission from affiliate links, this never affects the price you pay. 
                        You have the right to:
                      </p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Know which links are affiliate links (clearly marked)</li>
                        <li>• Understand our commission structure</li>
                        <li>• Access the same products at standard prices</li>
                        <li>• Unbiased recommendations regardless of commission rates</li>
                      </ul>
                    </div>
                    
                    <div className="text-center mt-4">
                      <Link 
                        href="/affiliate-disclosure" 
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        View Full Affiliate Disclosure
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Cancellation and Termination Rights */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Cancellation and Termination Rights</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You have comprehensive rights to cancel or terminate your use of GiftSync services.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Immediate Cancellation Rights</h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h4 className="font-medium text-red-900 mb-2">Account Termination</h4>
                        <p className="text-red-800 text-sm mb-2">
                          You can delete your account at any time for any reason:
                        </p>
                        <ul className="text-xs text-red-700 space-y-1">
                          <li>• Instant account deletion through settings</li>
                          <li>• All personal data removed within 30 days</li>
                          <li>• No cancellation fees or penalties</li>
                          <li>• Export your data before deletion if desired</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Service Discontinuation</h4>
                        <p className="text-blue-800 text-sm mb-2">
                          If you're unsatisfied with our service:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Stop using the service immediately</li>
                          <li>• No obligation to continue</li>
                          <li>• Request deletion of your data</li>
                          <li>• Provide feedback to help us improve</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Cooling-Off Period (EU Users)</h3>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">14-Day Withdrawal Right</h4>
                      <p className="text-purple-800 text-sm mb-3">
                        EU users have 14 days to withdraw from any paid services without reason:
                      </p>
                      <div className="space-y-2 text-xs text-purple-700">
                        <div><span className="font-medium">Starts:</span> From the day you agree to the service</div>
                        <div><span className="font-medium">How:</span> Email withdrawal notice to support@giftsync.com</div>
                        <div><span className="font-medium">Refund:</span> Within 14 days of withdrawal notice</div>
                        <div><span className="font-medium">Exception:</span> Services fully performed with your consent</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mt-3">
                      <h4 className="font-medium text-gray-900 mb-2">Withdrawal Form Template</h4>
                      <p className="text-gray-700 text-xs">
                        "I hereby give notice that I withdraw from my contract for the following service: 
                        [service name], ordered on [date], your name, your address, your signature, date."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Complaint Handling and Dispute Resolution */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Complaint Handling and Dispute Resolution</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We're committed to resolving any issues quickly and fairly. Here's how our complaint process works:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Step 1: Direct Contact</h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <a href="mailto:support@giftsync.com" className="text-blue-700 text-sm underline">
                            support@giftsync.com
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 text-sm">Request callback</span>
                        </div>
                        <div className="text-xs text-blue-600">
                          <span className="font-medium">Response:</span> Within 48 hours
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Step 2: Formal Complaint</h3>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <p className="text-orange-800 text-sm mb-2">
                        If not resolved within 8 weeks or you're unsatisfied:
                      </p>
                      <ul className="text-xs text-orange-700 space-y-1">
                        <li>• Submit formal written complaint</li>
                        <li>• We'll investigate thoroughly</li>
                        <li>• Final response within 8 weeks</li>
                        <li>• Clear explanation of decision</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Step 3: External Resolution</h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-green-800 text-sm mb-2">
                        If still unresolved, you can access:
                      </p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Citizens Advice (UK)</li>
                        <li>• Trading Standards</li>
                        <li>• EU ODR Platform</li>
                        <li>• Small Claims Court</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">What to Include in Your Complaint</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
                    <div>
                      <ul className="space-y-1">
                        <li>• Your name and contact details</li>
                        <li>• Account information (if applicable)</li>
                        <li>• Date and time of the issue</li>
                        <li>• Description of what went wrong</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• What you expected to happen</li>
                        <li>• Impact on you</li>
                        <li>• What resolution you're seeking</li>
                        <li>• Any supporting evidence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* External Support and Resources */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">External Support and Resources</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Independent organisations that can provide advice and support for consumer issues:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">UK Consumer Support</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Citizens Advice</h4>
                        <p className="text-sm text-gray-700 mb-2">Free, independent advice on consumer rights</p>
                        <a 
                          href="https://www.citizensadvice.org.uk" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          citizensadvice.org.uk <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Trading Standards</h4>
                        <p className="text-sm text-gray-700 mb-2">Local authority consumer protection service</p>
                        <a 
                          href="https://www.gov.uk/find-local-trading-standards-office" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Find your local office <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Competition and Markets Authority</h4>
                        <p className="text-sm text-gray-700 mb-2">UK competition and consumer protection</p>
                        <a 
                          href="https://www.gov.uk/government/organisations/competition-and-markets-authority" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          gov.uk/cma <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">EU Consumer Support</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Online Dispute Resolution (ODR)</h4>
                        <p className="text-sm text-gray-700 mb-2">EU platform for resolving online disputes</p>
                        <a 
                          href="https://ec.europa.eu/consumers/odr" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          ec.europa.eu/consumers/odr <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">European Consumer Centre</h4>
                        <p className="text-sm text-gray-700 mb-2">Free advice for cross-border shopping issues</p>
                        <a 
                          href="https://ec.europa.eu/info/live-work-travel-eu/consumer-rights-and-complaints/resolve-your-consumer-complaint/european-consumer-centres-network-ecc-net_en" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          ECC-Net <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Your National Consumer Authority</h4>
                        <p className="text-sm text-gray-700">Contact your country's consumer protection authority for local support and advice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Legal Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">Legal Information and Disclaimers</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• This page provides general information about consumer rights and doesn't constitute legal advice</li>
                    <li>• Consumer rights may vary by jurisdiction and specific circumstances</li>
                    <li>• For specific legal advice, consult with a qualified legal professional</li>
                    <li>• These rights are in addition to any contractual rights provided in our Terms and Conditions</li>
                    <li>• Some consumer rights cannot be excluded or limited by contract terms</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Relationship to Our Terms</h3>
                  <p className="text-blue-800 text-sm">
                    These consumer rights exist independently of and in addition to the terms in our 
                    <Link href="/terms" className="underline hover:text-blue-900 ml-1">Terms and Conditions</Link>. 
                    Where there's any conflict, your statutory consumer rights take precedence.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms and Conditions
              </Link>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
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

export default ConsumerRightsPage;