/**
 * Accessibility Statement Page
 * 
 * Comprehensive accessibility statement complying with UK Public Sector Bodies
 * Accessibility Regulations and WCAG 2.1 AA standards.
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Eye, Keyboard, Volume2, MousePointer, Monitor, Smartphone, CheckCircle, AlertTriangle, Mail, Phone, Calendar } from 'lucide-react';

const AccessibilityStatementPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Accessibility Statement - GiftSync</title>
        <meta 
          name="description" 
          content="GiftSync's accessibility statement detailing our commitment to inclusive design and compliance with WCAG 2.1 AA accessibility standards." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://giftsync.com/accessibility" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Accessibility Statement</h1>
                <p className="text-gray-600 mt-1">Our commitment to inclusive design and universal access</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Accessibility Commitment */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">Our Accessibility Commitment</h2>
                <p className="text-indigo-800 leading-relaxed mb-3">
                  GiftSync is committed to ensuring that our digital gift recommendation platform is accessible to 
                  everyone, including people with disabilities. We strive to provide an inclusive experience that 
                  meets or exceeds Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                </p>
                <div className="text-sm text-indigo-800">
                  <span className="font-medium">Standards:</span> WCAG 2.1 AA | 
                  <span className="font-medium ml-3">Last Review:</span> {new Date().toLocaleDateString('en-GB')} | 
                  <span className="font-medium ml-3">Next Review:</span> {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <a href="#accessibility-features" className="block text-blue-600 hover:text-blue-800 underline">Accessibility Features</a>
                <a href="#compliance-status" className="block text-blue-600 hover:text-blue-800 underline">Compliance Status</a>
                <a href="#assistive-technology" className="block text-blue-600 hover:text-blue-800 underline">Assistive Technology Support</a>
                <a href="#keyboard-navigation" className="block text-blue-600 hover:text-blue-800 underline">Keyboard Navigation</a>
              </div>
              <div className="space-y-2">
                <a href="#known-issues" className="block text-blue-600 hover:text-blue-800 underline">Known Issues</a>
                <a href="#accessibility-testing" className="block text-blue-600 hover:text-blue-800 underline">Testing and Evaluation</a>
                <a href="#feedback-contact" className="block text-blue-600 hover:text-blue-800 underline">Feedback and Contact</a>
                <a href="#third-party-content" className="block text-blue-600 hover:text-blue-800 underline">Third-Party Content</a>
              </div>
            </div>
          </div>
          
          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Accessibility Features */}
            <section id="accessibility-features" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Accessibility Features</h2>
              </div>
              <p className="text-gray-700 mb-6">
                We have implemented numerous features to ensure GiftSync is usable by people with diverse abilities and needs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Visual Accessibility</h3>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• High contrast colour schemes with 4.5:1 minimum ratio</li>
                      <li>• Scalable text up to 200% without horizontal scrolling</li>
                      <li>• Alternative text for all meaningful images</li>
                      <li>• Clear focus indicators for interactive elements</li>
                      <li>• Consistent navigation and layout structure</li>
                      <li>• Support for dark mode and custom themes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Audio and Screen Reader Support</h3>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Comprehensive ARIA labels and descriptions</li>
                      <li>• Proper heading hierarchy (H1-H6)</li>
                      <li>• Screen reader-friendly form labels</li>
                      <li>• Audio descriptions for multimedia content</li>
                      <li>• Skip links to main content areas</li>
                      <li>• Descriptive link text and button labels</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Keyboard className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Keyboard and Motor Accessibility</h3>
                    </div>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Full keyboard navigation support</li>
                      <li>• Logical tab order throughout the interface</li>
                      <li>• No keyboard traps or inaccessible content</li>
                      <li>• Generous click/tap targets (44px minimum)</li>
                      <li>• Support for voice control software</li>
                      <li>• Customisable interaction timeouts</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Cognitive and Learning Support</h3>
                    </div>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• Clear, simple language and instructions</li>
                      <li>• Consistent design patterns and navigation</li>
                      <li>• Error prevention and clear error messages</li>
                      <li>• Multiple ways to access information</li>
                      <li>• Helpful context and assistance</li>
                      <li>• Customisable user interface preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Compliance Status */}
            <section id="compliance-status" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Compliance Status</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">WCAG 2.1 Level AA Compliance</h3>
                  <p className="text-green-800 text-sm mb-3">
                    GiftSync substantially conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                    We regularly audit our platform to maintain and improve accessibility.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-green-900 mb-1">Level A</div>
                      <div className="text-green-700">✓ Fully Compliant</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-green-900 mb-1">Level AA</div>
                      <div className="text-green-700">✓ Substantially Compliant</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-green-900 mb-1">Level AAA</div>
                      <div className="text-green-700">◐ Partial (where applicable)</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">Standards and Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">WCAG 2.1 Level AA</h4>
                      <p className="text-sm text-gray-700">International standard for web accessibility</p>
                    </div>
                    <div className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">EN 301 549</h4>
                      <p className="text-sm text-gray-700">European accessibility standard for ICT procurement</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">Section 508</h4>
                      <p className="text-sm text-gray-700">US federal accessibility requirements (where applicable)</p>
                    </div>
                    <div className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">UK Accessibility Regulations</h4>
                      <p className="text-sm text-gray-700">Public sector accessibility requirements</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Assistive Technology Support */}
            <section id="assistive-technology" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Assistive Technology Support</h2>
              </div>
              <p className="text-gray-700 mb-4">
                GiftSync has been tested with various assistive technologies to ensure compatibility and usability.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Tested Screen Readers</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">NVDA</div>
                        <div className="text-sm text-green-700">Windows - Latest version supported</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">JAWS</div>
                        <div className="text-sm text-green-700">Windows - Version 2020 and later</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">VoiceOver</div>
                        <div className="text-sm text-green-700">macOS and iOS - Built-in support</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">TalkBack</div>
                        <div className="text-sm text-green-700">Android - Native integration</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Other Assistive Technologies</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Voice Control Software</div>
                        <div className="text-sm text-blue-700">Dragon NaturallySpeaking, Windows Voice Control</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Switch Navigation</div>
                        <div className="text-sm text-blue-700">Single and multiple switch devices</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Magnification Software</div>
                        <div className="text-sm text-blue-700">ZoomText, Windows Magnifier, macOS Zoom</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Alternative Keyboards</div>
                        <div className="text-sm text-blue-700">On-screen keyboards, alternative input devices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Keyboard Navigation */}
            <section id="keyboard-navigation" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Keyboard className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Navigation</h2>
              </div>
              <p className="text-gray-700 mb-4">
                All functionality of GiftSync is available using only a keyboard. Here are the key shortcuts and navigation patterns:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Standard Navigation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                      <span className="font-medium">Tab</span>
                      <span className="text-gray-600">Move to next interactive element</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                      <span className="font-medium">Shift + Tab</span>
                      <span className="text-gray-600">Move to previous interactive element</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                      <span className="font-medium">Enter</span>
                      <span className="text-gray-600">Activate buttons and links</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                      <span className="font-medium">Space</span>
                      <span className="text-gray-600">Activate buttons, checkboxes</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                      <span className="font-medium">Escape</span>
                      <span className="text-gray-600">Close modals and dropdowns</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">GiftSync-Specific Shortcuts</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                      <span className="font-medium">Arrow Keys</span>
                      <span className="text-indigo-700">Navigate swipe interface</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                      <span className="font-medium">Ctrl + /</span>
                      <span className="text-indigo-700">Open search functionality</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                      <span className="font-medium">Ctrl + H</span>
                      <span className="text-indigo-700">Go to home/dashboard</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                      <span className="font-medium">Ctrl + P</span>
                      <span className="text-indigo-700">Open preferences/settings</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-indigo-50 rounded border border-indigo-200">
                      <span className="font-medium">Alt + M</span>
                      <span className="text-indigo-700">Open main navigation menu</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Skip Links</h4>
                <p className="text-blue-800 text-sm">
                  Skip links appear when you first press Tab on any page, allowing you to quickly navigate to:
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Main content area</li>
                  <li>• Primary navigation</li>
                  <li>• Search functionality</li>
                  <li>• Footer information</li>
                </ul>
              </div>
            </section>
            
            {/* Known Issues */}
            <section id="known-issues" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Known Accessibility Issues</h2>
              </div>
              <p className="text-gray-700 mb-4">
                We are committed to transparency about current limitations whilst we work to address them.
              </p>
              
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-2">Current Known Issues</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-900">Complex Data Visualisation</div>
                        <div className="text-sm text-amber-800 mb-1">
                          Some analytics charts may not be fully accessible to screen readers.
                        </div>
                        <div className="text-xs text-amber-700">
                          <span className="font-medium">Workaround:</span> Data tables are provided as an alternative. 
                          <span className="font-medium">Target Fix:</span> Q2 2025
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-amber-900">Third-Party Product Images</div>
                        <div className="text-sm text-amber-800 mb-1">
                          Some product images from external sources may lack descriptive alternative text.
                        </div>
                        <div className="text-xs text-amber-700">
                          <span className="font-medium">Mitigation:</span> We provide product titles and descriptions. 
                          <span className="font-medium">Ongoing:</span> Working with partners to improve alt text
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Recently Fixed Issues</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <div>• <span className="font-medium">Focus Management:</span> Improved focus handling in modal dialogs (Fixed: Jan 2025)</div>
                    <div>• <span className="font-medium">Colour Contrast:</span> Enhanced contrast ratios throughout the interface (Fixed: Dec 2024)</div>
                    <div>• <span className="font-medium">Mobile Navigation:</span> Better touch target sizes and spacing (Fixed: Nov 2024)</div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Testing and Evaluation */}
            <section id="accessibility-testing" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Testing and Evaluation</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We employ multiple testing methods to ensure and maintain accessibility standards across our platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Automated Testing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>axe-core accessibility testing suite</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>WAVE (Web Accessibility Evaluation Tool)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Pa11y command line accessibility tester</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Lighthouse accessibility audits</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Manual Testing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Screen reader navigation testing</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Keyboard-only navigation testing</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Voice control software testing</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Magnification and zoom testing</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">User Testing</h3>
                  <p className="text-purple-800 text-sm mb-3">
                    We regularly conduct usability testing sessions with users who have disabilities to gather 
                    real-world feedback and identify areas for improvement.
                  </p>
                  <div className="text-sm text-purple-800">
                    <span className="font-medium">Testing Schedule:</span> Quarterly sessions | 
                    <span className="font-medium ml-3">Participants:</span> Users with diverse disabilities | 
                    <span className="font-medium ml-3">Focus:</span> Core user journeys and new features
                  </div>
                </div>
              </div>
            </section>
            
            {/* Third-Party Content */}
            <section id="third-party-content" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Third-Party Content and Services</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Some content and services on our platform are provided by third parties. Whilst we work to ensure 
                  accessibility across all aspects of the user experience, we cannot guarantee the accessibility of 
                  external content.
                </p>
                
                <h3 className="font-semibold text-gray-900">Third-Party Elements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Product Images and Descriptions</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Product images and some descriptions are sourced from retail partners.
                    </p>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Our Actions:</span> We provide additional context and work with 
                      partners to improve accessibility of their content.
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">External Links</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Links to retailer websites and external services may have varying levels of accessibility.
                    </p>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Our Actions:</span> We clearly mark external links and provide 
                      alternative contact methods where possible.
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Reporting Third-Party Issues</h4>
                  <p className="text-blue-800 text-sm">
                    If you encounter accessibility barriers with third-party content accessed through our platform, 
                    please let us know. We will work to provide alternative access methods or contact the relevant 
                    third party on your behalf.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Feedback and Contact */}
            <section id="feedback-contact" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Feedback and Contact</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We welcome feedback about the accessibility of GiftSync. Your input helps us improve the experience for all users.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">How to Contact Us</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                        <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-900">Email (Preferred)</div>
                          <a href="mailto:accessibility@giftsync.com" className="text-green-700 text-sm underline hover:text-green-900">
                            accessibility@giftsync.com
                          </a>
                          <div className="text-xs text-green-600 mt-1">Response within 2 business days</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900">Support Line</div>
                          <div className="text-blue-700 text-sm">Available for accessibility-related enquiries</div>
                          <a href="mailto:support@giftsync.com" className="text-blue-700 text-sm underline hover:text-blue-900">
                            Request callback via support@giftsync.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">What to Include</h3>
                    <div className="bg-gray-50 p-4 rounded border">
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li>• <span className="font-medium">Description of the issue:</span> What barrier did you encounter?</li>
                        <li>• <span className="font-medium">Your setup:</span> Browser, assistive technology, operating system</li>
                        <li>• <span className="font-medium">Location:</span> What page or feature were you using?</li>
                        <li>• <span className="font-medium">Expected outcome:</span> What did you expect to happen?</li>
                        <li>• <span className="font-medium">Suggested solution:</span> Any ideas for improvement (optional)</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded">
                      <h4 className="font-medium text-green-900 mb-1">Response Commitment</h4>
                      <p className="text-green-800 text-sm">
                        We acknowledge all accessibility feedback within 2 business days and provide a 
                        detailed response within 10 business days.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-900 mb-2">Alternative Contact Methods</h3>
                  <p className="text-indigo-800 text-sm mb-3">
                    If you cannot use our standard contact methods due to accessibility barriers, we can arrange 
                    alternative communication methods:
                  </p>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Video calls with British Sign Language (BSL) interpretation</li>
                    <li>• Large print or braille correspondence</li>
                    <li>• Easy-read format communications</li>
                    <li>• Audio recordings of written responses</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* Future Improvements */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Future Accessibility Improvements</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We are committed to continuously improving accessibility. Here are our planned enhancements:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Short-term Goals (Next 6 months)</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">Enhanced chart accessibility with data tables</span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">Improved mobile touch interaction areas</span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">Additional keyboard shortcuts for power users</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Long-term Vision (Next 2 years)</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-purple-800">AI-powered alternative text generation for product images</span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-purple-800">Voice interaction capabilities for hands-free browsing</span>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-purple-50 rounded border border-purple-200">
                        <Calendar className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-purple-800">Personalised accessibility profiles and preferences</span>
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
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                Contact Us
              </Link>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              This accessibility statement was last updated on {new Date().toLocaleDateString('en-GB', { 
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

export default AccessibilityStatementPage;