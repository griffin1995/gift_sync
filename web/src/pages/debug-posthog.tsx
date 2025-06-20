import React, { useEffect, useState } from 'react';
import { config } from '@/config';

export default function DebugPostHog() {
  const [logs, setLogs] = useState<string[]>([]);
  const [posthogStatus, setPosthogStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const testPostHog = async () => {
      try {
        addLog('=== PostHog Debug Test Starting ===');
        
        // Check environment variables
        addLog(`NODE_ENV: ${process.env.NODE_ENV}`);
        addLog(`NEXT_PUBLIC_POSTHOG_KEY: ${config.posthogKey ? 'SET' : 'MISSING'}`);
        addLog(`NEXT_PUBLIC_POSTHOG_HOST: ${config.posthogHost || 'MISSING'}`);
        
        // Check if window and posthog exist
        if (typeof window === 'undefined') {
          addLog('ERROR: Running on server side');
          setPosthogStatus('error');
          return;
        }
        
        addLog('Window object available');
        
        // Import PostHog dynamically
        const posthog = await import('posthog-js');
        addLog('PostHog module imported successfully');
        
        // Initialize PostHog manually for debugging
        if (config.posthogKey) {
          addLog('Initializing PostHog...');
          posthog.default.init(config.posthogKey, {
            api_host: config.posthogHost || 'https://app.posthog.com',
            debug: true, // Force debug mode
            capture_pageview: false,
            person_profiles: 'identified_only',
          });
          addLog('PostHog initialized');
          
          // Wait a moment for initialization
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if PostHog is loaded
          if (window.posthog) {
            addLog('PostHog is available on window object');
            
            // Test capturing an event
            addLog('Sending test event...');
            window.posthog.capture('debug_test_event', {
              test: true,
              timestamp: new Date().toISOString(),
              source: 'debug_page',
              url: window.location.href,
            });
            addLog('Test event sent');
            
            // Test page view
            addLog('Sending page view...');
            window.posthog.capture('$pageview', {
              $current_url: window.location.href,
            });
            addLog('Page view sent');
            
            setPosthogStatus('success');
            addLog('=== PostHog Debug Test Completed Successfully ===');
          } else {
            addLog('ERROR: PostHog not available on window object');
            setPosthogStatus('error');
          }
        } else {
          addLog('ERROR: PostHog key not configured');
          setPosthogStatus('error');
        }
      } catch (error) {
        addLog(`ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setPosthogStatus('error');
      }
    };

    testPostHog();
  }, []);

  const sendManualEvent = () => {
    if (window.posthog) {
      const eventName = `manual_debug_${Date.now()}`;
      addLog(`Sending manual event: ${eventName}`);
      window.posthog.capture(eventName, {
        manual: true,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
      addLog('Manual event sent');
    } else {
      addLog('ERROR: PostHog not available for manual event');
    }
  };

  const sendPageviewEvent = () => {
    if (window.posthog) {
      addLog('Sending manual $pageview event...');
      window.posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $host: window.location.host,
        $referrer: document.referrer,
        page_title: document.title,
        manual_pageview: true,
        timestamp: new Date().toISOString(),
      });
      addLog('Manual $pageview event sent');
    } else {
      addLog('ERROR: PostHog not available for pageview event');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PostHog Debug Page</h1>
        
        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            posthogStatus === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            posthogStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {posthogStatus === 'loading' ? 'Testing...' :
             posthogStatus === 'success' ? 'PostHog Working' :
             'PostHog Error'}
          </div>
        </div>

        {/* Manual Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <button
            onClick={sendManualEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          >
            Send Manual Event
          </button>
          <button
            onClick={sendPageviewEvent}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
          >
            Send $pageview Event
          </button>
          <button
            onClick={() => {
              if (window.posthog) {
                window.posthog.identify(`debug_user_${Date.now()}`, {
                  email: 'debug@example.com',
                  name: 'Debug User',
                });
                addLog('User identified');
              }
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Identify User
          </button>
        </div>

        {/* Network Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Network Test</h2>
          <button
            onClick={async () => {
              try {
                addLog('Testing direct API call...');
                const response = await fetch('https://eu.i.posthog.com/batch/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    api_key: config.posthogKey,
                    batch: [{
                      event: 'direct_api_test',
                      properties: {
                        distinct_id: 'debug_user',
                        timestamp: new Date().toISOString(),
                      },
                    }],
                  }),
                });
                addLog(`Direct API response: ${response.status} ${response.statusText}`);
              } catch (error) {
                addLog(`Direct API error: ${error instanceof Error ? error.message : 'Unknown'}`);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Direct API Call
          </button>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibent mb-4">Debug Logs</h2>
          <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h2>
          <ol className="text-blue-800 space-y-1">
            <li>1. Open browser developer tools (F12)</li>
            <li>2. Go to Console tab to see any JavaScript errors</li>
            <li>3. Go to Network tab to see if requests are being made to PostHog</li>
            <li>4. Click the test buttons above</li>
            <li>5. Check your PostHog dashboard for events</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Make posthog available on window for debugging
declare global {
  interface Window {
    posthog: any;
  }
}