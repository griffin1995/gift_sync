import React, { useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { config } from '@/config';

export default function PostHogTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const testPostHog = async () => {
      try {
        addLog('Starting PostHog test...');
        
        // Check environment variables
        addLog(`PostHog Key: ${config.posthogKey ? 'Present' : 'Missing'}`);
        addLog(`PostHog Host: ${config.posthogHost || 'Using default'}`);
        
        // Initialize analytics
        analytics.init();
        addLog('Analytics initialized');
        
        // Test tracking
        analytics.track('test_event', {
          test_property: 'test_value',
          timestamp: new Date().toISOString(),
        });
        addLog('Test event tracked');
        
        // Test identification
        analytics.identify('test_user_123', {
          email: 'test@example.com',
          name: 'Test User',
        });
        addLog('User identified');
        
        setStatus('success');
        addLog('PostHog test completed successfully!');
      } catch (error) {
        addLog(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setStatus('error');
      }
    };

    testPostHog();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PostHog Configuration Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
            status === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status === 'loading' ? 'Testing...' :
             status === 'success' ? 'Configuration OK' :
             'Configuration Error'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to manually test PostHog tracking:
          </p>
          <button
            onClick={() => {
              analytics.track('manual_test_click', {
                button: 'Manual Test Button',
                timestamp: new Date().toISOString(),
              });
              addLog('Manual test event tracked');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Test Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div><strong>NEXT_PUBLIC_POSTHOG_KEY:</strong> {config.posthogKey ? '✓ Set' : '✗ Missing'}</div>
            <div><strong>NEXT_PUBLIC_POSTHOG_HOST:</strong> {config.posthogHost || 'Using default'}</div>
            <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Development Mode:</strong> {config.isDevelopment ? 'Yes' : 'No'}</div>
            <div><strong>Production Mode:</strong> {config.isProduction ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}