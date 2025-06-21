/**
 * Contact Page
 * 
 * Comprehensive contact information page including company details,
 * support channels, legal contacts, and regulatory information.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Shield, Globe, FileText, ExternalLink, Users, AlertCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact Us - GiftSync</title>
        <meta 
          name="description" 
          content="Get in touch with GiftSync. Find our contact information, support channels, company details, and legal contacts for privacy, accessibility, and consumer rights." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/contact" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
                <p className="text-gray-600 mt-1">Get in touch with our team</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Contact Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">We're Here to Help</h2>
                <p className="text-blue-800 leading-relaxed mb-3">
                  Whether you need technical support, have questions about our service, or need to discuss 
                  legal matters, we're committed to providing prompt and helpful assistance. Our team typically 
                  responds within 48 hours.
                </p>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Quick Response:</span> For urgent matters, email support@giftsync.com | 
                  <span className="font-medium ml-3">Business Hours:</span> Monday - Friday, 9AM - 5PM GMT
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Contact Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <a 
              href="mailto:support@giftsync.com" 
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-sm border hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Mail className="w-8 h-8 text-blue-600" />
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">General Support</h3>
                <p className="text-sm text-gray-600 mt-1">support@giftsync.com</p>
              </div>
            </a>
            
            <a 
              href="mailto:privacy@giftsync.com" 
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-sm border hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <Shield className="w-8 h-8 text-green-600" />
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Privacy & Data</h3>
                <p className="text-sm text-gray-600 mt-1">privacy@giftsync.com</p>
              </div>
            </a>
            
            <a 
              href="mailto:accessibility@giftsync.com" 
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-sm border hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <Users className="w-8 h-8 text-purple-600" />
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Accessibility</h3>
                <p className="text-sm text-gray-600 mt-1">accessibility@giftsync.com</p>
              </div>
            </a>
            
            <a 
              href="mailto:legal@giftsync.com" 
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-sm border hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-orange-600" />
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Legal Matters</h3>
                <p className="text-sm text-gray-600 mt-1">legal@giftsync.com</p>
              </div>
            </a>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Contact Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Primary Contact Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Email Support</h4>
                        <p className="text-blue-800 text-sm mb-2">
                          Our preferred contact method for detailed enquiries
                        </p>
                        <a href="mailto:support@giftsync.com" className="text-blue-700 underline hover:text-blue-900">
                          support@giftsync.com
                        </a>
                        <div className="text-xs text-blue-600 mt-1">Response within 48 hours</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Phone Support</h4>
                        <p className="text-green-800 text-sm mb-2">
                          Request a callback for urgent or complex issues
                        </p>
                        <p className="text-green-700 text-sm">
                          Available through email request to support@giftsync.com
                        </p>
                        <div className="text-xs text-green-600 mt-1">Callback within 24 hours</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Business Hours & Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">Business Hours</div>
                        <div className="text-sm text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM GMT</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">General Enquiries:</span>
                        <span className="text-gray-700">Within 48 hours</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">Technical Support:</span>
                        <span className="text-gray-700">Within 24 hours</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">Privacy Requests:</span>
                        <span className="text-gray-700">Within 48 hours</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-900">Legal Matters:</span>
                        <span className="text-gray-700">Within 72 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Company Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Legal Entity</h3>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Company Name:</span>
                        <span className="text-green-800">GiftSync Ltd</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Jurisdiction:</span>
                        <span className="text-green-800">England and Wales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">Registration:</span>
                        <span className="text-green-800">Companies House</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">VAT Status:</span>
                        <span className="text-green-800">Not VAT registered (below threshold)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Registered Address</h3>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <div className="font-medium text-blue-900 mb-1">Correspondence Address:</div>
                        <div>United Kingdom</div>
                        <div className="text-xs text-blue-600 mt-2">
                          For specific postal address, please contact us via email
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-3">
                    <h4 className="font-medium text-purple-900 mb-2">Service of Legal Documents</h4>
                    <p className="text-purple-800 text-sm">
                      Legal documents should be served via registered post to our registered address 
                      or by email to <a href="mailto:legal@giftsync.com" className="underline">legal@giftsync.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Specialist Contact Teams */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Specialist Contact Teams</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Data Protection Team</h3>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">
                      Handle all privacy requests, GDPR compliance, and data protection matters
                    </p>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:privacy@giftsync.com" className="text-blue-600 underline">privacy@giftsync.com</a></div>
                      <div><span className="font-medium">Specialises in:</span> Data access, deletion, portability, consent management</div>
                      <div><span className="font-medium">Response time:</span> Within 2 business days</div>
                    </div>
                  </div>
                  
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Accessibility Team</h3>
                    </div>
                    <p className="text-green-800 text-sm mb-3">
                      Dedicated to ensuring our platform is accessible to users with disabilities
                    </p>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:accessibility@giftsync.com" className="text-green-600 underline">accessibility@giftsync.com</a></div>
                      <div><span className="font-medium">Specialises in:</span> WCAG compliance, assistive technology, accessibility barriers</div>
                      <div><span className="font-medium">Response time:</span> Within 2 business days</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Legal & Compliance Team</h3>
                    </div>
                    <p className="text-orange-800 text-sm mb-3">
                      Handle legal enquiries, compliance matters, and regulatory correspondence
                    </p>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:legal@giftsync.com" className="text-orange-600 underline">legal@giftsync.com</a></div>
                      <div><span className="font-medium">Specialises in:</span> Consumer rights, contract disputes, regulatory compliance</div>
                      <div><span className="font-medium">Response time:</span> Within 3 business days</div>
                    </div>
                  </div>
                  
                  <div className="border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Customer Success Team</h3>
                    </div>
                    <p className="text-purple-800 text-sm mb-3">
                      General support, account assistance, and feature guidance
                    </p>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:support@giftsync.com" className="text-purple-600 underline">support@giftsync.com</a></div>
                      <div><span className="font-medium">Specialises in:</span> Account help, feature support, general enquiries</div>
                      <div><span className="font-medium">Response time:</span> Within 48 hours</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Regulatory and Compliance Contacts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Regulatory and Compliance Contacts</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">For Regulatory Authorities</h3>
                  <p className="text-amber-800 text-sm mb-3">
                    Regulatory authorities, enforcement bodies, and official investigations should use 
                    our dedicated compliance contact channels:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div><span className="font-medium">Primary Contact:</span> <a href="mailto:legal@giftsync.com" className="text-amber-700 underline">legal@giftsync.com</a></div>
                      <div><span className="font-medium">Data Protection Officer:</span> <a href="mailto:privacy@giftsync.com" className="text-amber-700 underline">privacy@giftsync.com</a></div>
                    </div>
                    <div>
                      <div><span className="font-medium">Response Commitment:</span> Within 5 business days</div>
                      <div><span className="font-medium">Escalation:</span> Available for urgent matters</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">UK Regulatory Contacts</h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 border border-red-200 p-3 rounded">
                        <h4 className="font-medium text-red-900 mb-1">Information Commissioner's Office (ICO)</h4>
                        <p className="text-red-800 text-xs mb-2">Data protection and privacy matters</p>
                        <div className="text-xs text-red-700">
                          Our ICO registration details available upon request to regulatory authorities
                        </div>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 p-3 rounded">
                        <h4 className="font-medium text-red-900 mb-1">Competition and Markets Authority (CMA)</h4>
                        <p className="text-red-800 text-xs mb-2">Competition and consumer protection matters</p>
                        <div className="text-xs text-red-700">
                          Compliance officer contact available for formal enquiries
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">EU Regulatory Framework</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <h4 className="font-medium text-blue-900 mb-1">EU Representative (Article 27 GDPR)</h4>
                        <p className="text-blue-800 text-xs mb-2">Available upon request for EU data subjects</p>
                        <div className="text-xs text-blue-700">
                          Contact details provided to EU data protection authorities as required
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                        <h4 className="font-medium text-blue-900 mb-1">Digital Services Act Compliance</h4>
                        <p className="text-blue-800 text-xs mb-2">EU digital services regulations</p>
                        <div className="text-xs text-blue-700">
                          Compliance documentation available to relevant authorities
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Alternative Contact Methods */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Alternative Contact Methods</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We're committed to ensuring everyone can contact us easily. If standard contact methods 
                  aren't suitable for you, we offer alternative communication options:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Accessibility Accommodations</h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Available Formats</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Large print correspondence</li>
                        <li>• Audio recordings of written responses</li>
                        <li>• Easy-read format communications</li>
                        <li>• British Sign Language (BSL) video calls</li>
                        <li>• Text relay services</li>
                        <li>• Braille documents (upon request)</li>
                      </ul>
                      <p className="text-xs text-green-600 mt-2">
                        Contact <a href="mailto:accessibility@giftsync.com" className="underline">accessibility@giftsync.com</a> to arrange alternative formats
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Language Support</h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Multilingual Assistance</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Whilst our primary language is English, we can arrange translation services 
                        for essential communications:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Major European languages (French, German, Spanish, Italian)</li>
                        <li>• Legal document translation</li>
                        <li>• Privacy notice translations</li>
                        <li>• Consumer rights information</li>
                      </ul>
                      <p className="text-xs text-blue-600 mt-2">
                        Please indicate your preferred language when contacting us
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Third-Party Advocacy</h3>
                  <p className="text-purple-800 text-sm mb-3">
                    If you need someone to contact us on your behalf, we accept communications from:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
                    <div>
                      <ul className="space-y-1">
                        <li>• Legal representatives and solicitors</li>
                        <li>• Citizens Advice and consumer organisations</li>
                        <li>• Disability advocacy services</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li>• Family members (with consent)</li>
                        <li>• Care coordinators and support workers</li>
                        <li>• Regulatory authorities</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    Please provide appropriate authorisation or consent documentation
                  </p>
                </div>
              </div>
            </section>
            
            {/* Emergency and Urgent Contacts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Emergency and Urgent Contacts</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Security Incidents</h3>
                  <p className="text-red-800 text-sm mb-3">
                    For urgent security matters, data breaches, or suspected fraud:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Primary:</span> <a href="mailto:security@giftsync.com" className="text-red-700 underline">security@giftsync.com</a></div>
                    <div><span className="font-medium">Backup:</span> <a href="mailto:privacy@giftsync.com" className="text-red-700 underline">privacy@giftsync.com</a></div>
                    <div><span className="font-medium">Subject Line:</span> URGENT SECURITY INCIDENT</div>
                    <div><span className="font-medium">Response:</span> Within 4 hours during business days</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Technical Emergencies</h4>
                    <p className="text-orange-800 text-sm mb-2">
                      Service outages, critical bugs, or accessibility barriers preventing use:
                    </p>
                    <div className="text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:support@giftsync.com" className="text-orange-700 underline">support@giftsync.com</a></div>
                      <div><span className="font-medium">Subject:</span> URGENT TECHNICAL ISSUE</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Legal Urgent Matters</h4>
                    <p className="text-yellow-800 text-sm mb-2">
                      Court orders, regulatory deadlines, or time-sensitive legal matters:
                    </p>
                    <div className="text-sm">
                      <div><span className="font-medium">Email:</span> <a href="mailto:legal@giftsync.com" className="text-yellow-700 underline">legal@giftsync.com</a></div>
                      <div><span className="font-medium">Subject:</span> URGENT LEGAL MATTER</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* External Resources */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">External Resources and Support</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you need independent advice or wish to escalate matters beyond our internal processes:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">UK Consumer Support</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Citizens Advice</h4>
                        <p className="text-sm text-gray-700 mb-2">Free consumer rights advice</p>
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
                        <h4 className="font-medium text-gray-900 mb-1">Information Commissioner's Office</h4>
                        <p className="text-sm text-gray-700 mb-2">Data protection complaints</p>
                        <a 
                          href="https://ico.org.uk" 
                          className="text-blue-600 text-sm underline hover:text-blue-800 flex items-center gap-1"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          ico.org.uk <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">EU Support Services</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900 mb-1">Online Dispute Resolution</h4>
                        <p className="text-sm text-gray-700 mb-2">EU platform for consumer disputes</p>
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
                        <p className="text-sm text-gray-700 mb-2">Cross-border consumer help</p>
                        <div className="text-sm text-gray-600">Contact your national ECC office</div>
                      </div>
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
              <Link href="/data-protection" className="text-blue-600 hover:text-blue-800 underline">
                Data Protection Rights
              </Link>
              <Link href="/accessibility" className="text-blue-600 hover:text-blue-800 underline">
                Accessibility Statement
              </Link>
              <Link href="/consumer-rights" className="text-blue-600 hover:text-blue-800 underline">
                Consumer Rights
              </Link>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              Contact information last updated: {new Date().toLocaleDateString('en-GB', { 
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

export default ContactPage;