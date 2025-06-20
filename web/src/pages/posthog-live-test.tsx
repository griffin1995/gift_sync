import React, { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { config } from '@/config';

export default function PostHogLiveTest() {
  const [events, setEvents] = useState<Array<{id: string, name: string, timestamp: string, status: 'sent' | 'error'}>>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize PostHog
    analytics.init();
    setIsInitialized(true);
    
    // Send an automatic page view event
    addEvent('page_view_test', 'Page Load Event');
  }, []);

  const addEvent = (eventName: string, displayName: string) => {
    const eventId = Math.random().toString(36).substr(2, 9);
    
    try {
      analytics.track(eventName, {
        test_session: 'posthog_live_test',
        timestamp: new Date().toISOString(),
        event_id: eventId,
        page: 'PostHog Live Test',
        user_agent: navigator.userAgent,
      });
      
      setEvents(prev => [...prev, {
        id: eventId,
        name: displayName,
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent'
      }]);
    } catch (error) {
      setEvents(prev => [...prev, {
        id: eventId,
        name: displayName,
        timestamp: new Date().toLocaleTimeString(),
        status: 'error'
      }]);
    }
  };

  const testEvents = [
    {
      name: 'button_click_test',
      display: 'Button Click Test',
      description: 'Tests basic button click tracking'
    },
    {
      name: 'form_submit_test',
      display: 'Form Submit Test',
      description: 'Tests form submission tracking'
    },
    {
      name: 'user_action_test',
      display: 'User Action Test',
      description: 'Tests custom user action tracking'
    },
    {
      name: 'feature_usage_test',
      display: 'Feature Usage Test',
      description: 'Tests feature usage tracking'
    },
    {
      name: 'error_simulation_test',
      display: 'Error Simulation Test',
      description: 'Tests error event tracking'
    }
  ];

  const identifyTestUser = () => {
    const userId = `test_user_${Date.now()}`;
    analytics.identify(userId, {
      email: 'test@giftsync.com',
      name: 'PostHog Test User',
      test_session: true,
      created_at: new Date().toISOString(),
      subscription_tier: 'free'
    });
    
    addEvent('user_identify_test', 'User Identification Test');
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">PostHog Live Test Dashboard</h1>
          
          {/* Status */}
          <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Configuration Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">PostHog Key:</span> 
                <span className={config.posthogKey ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {config.posthogKey ? '✓ Configured' : '✗ Missing'}
                </span>
              </div>
              <div>
                <span className="font-medium">PostHog Host:</span> 
                <span className="text-gray-600 ml-2">{config.posthogHost}</span>
              </div>
              <div>
                <span className="font-medium">Environment:</span> 
                <span className="text-gray-600 ml-2">{config.isDevelopment ? 'Development' : 'Production'}</span>
              </div>
              <div>
                <span className="font-medium">Analytics Initialized:</span> 
                <span className={isInitialized ? 'text-green-600 ml-2' : 'text-yellow-600 ml-2'}>
                  {isInitialized ? '✓ Ready' : '⏳ Initializing...'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">📝 Instructions</h2>
            <p className="text-yellow-800 mb-2">
              1. Click the buttons below to send test events to PostHog
            </p>
            <p className="text-yellow-800 mb-2">
              2. Go to your PostHog dashboard: <a href="https://eu.i.posthog.com" target="_blank" rel="noopener noreferrer" className="underline">https://eu.i.posthog.com</a>
            </p>
            <p className="text-yellow-800 mb-2">
              3. Navigate to "Live events" or "Activity" tab to see events in real-time
            </p>
            <p className="text-yellow-800">
              4. Look for events starting with "test_" to identify your test events
            </p>
          </div>

          {/* User Identification */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Identification</h2>
            <p className="text-gray-600 mb-4">Identify yourself to PostHog for better event tracking:</p>
            <button
              onClick={identifyTestUser}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              🔍 Identify Test User
            </button>
          </div>

          {/* Test Events */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Test Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testEvents.map((event, index) => (
                <div key={event.name} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">{event.display}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <button
                    onClick={() => addEvent(event.name, event.display)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Send Event #{index + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Special Test: Batch Events */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Test</h2>
            <button
              onClick={() => {
                // Send multiple events in succession
                const batchId = Date.now();
                for (let i = 1; i <= 5; i++) {
                  setTimeout(() => {
                    addEvent(`batch_event_${i}`, `Batch Event ${i}/5`);
                  }, i * 200);
                }
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🚀 Send Batch of 5 Events
            </button>
          </div>

          {/* Event Log */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Event Log</h2>
              <button
                onClick={clearEvents}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Clear Log
              </button>
            </div>
            
            {events.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                No events sent yet. Click a button above to send test events.
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium text-gray-900">{event.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({event.timestamp})</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.status === 'sent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.status === 'sent' ? '✓ Sent' : '✗ Error'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dashboard Link */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h2 className="text-lg font-semibold text-green-900 mb-2">🎯 Check Your PostHog Dashboard</h2>
            <p className="text-green-800 mb-3">
              After sending events above, check your PostHog dashboard to see them appear in real-time:
            </p>
            <a
              href="https://eu.i.posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              🔗 Open PostHog Dashboard
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}