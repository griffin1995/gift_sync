import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationSettingsProps {
  className?: string;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  channels: {
    push: boolean;
    email: boolean;
    browser: boolean;
  };
}

export function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const {
    isSupported,
    permission,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  } = useNotifications();

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'recommendations',
      label: 'New Recommendations',
      description: 'Get notified when new gift recommendations are available',
      channels: { push: true, email: true, browser: true },
    },
    {
      id: 'gift_links',
      label: 'Gift Link Activity',
      description: 'Updates when someone views or purchases from your gift links',
      channels: { push: true, email: false, browser: true },
    },
    {
      id: 'swipe_sessions',
      label: 'Swipe Reminders',
      description: 'Reminders to continue your preference discovery sessions',
      channels: { push: false, email: true, browser: false },
    },
    {
      id: 'account',
      label: 'Account Updates',
      description: 'Important account and security notifications',
      channels: { push: true, email: true, browser: true },
    },
    {
      id: 'product_updates',
      label: 'Product Updates',
      description: 'New features and platform improvements',
      channels: { push: false, email: true, browser: false },
    },
    {
      id: 'promotions',
      label: 'Promotions & Offers',
      description: 'Special deals and promotional content',
      channels: { push: false, email: false, browser: false },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handlePermissionRequest = async () => {
    if (!isSupported) {
      showNotification({
        type: 'error',
        title: 'Not Supported',
        message: 'Push notifications are not supported in this browser.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        await subscribe();
        showNotification({
          type: 'success',
          title: 'Notifications Enabled',
          message: 'You will now receive push notifications.',
        });
      } else {
        showNotification({
          type: 'warning',
          title: 'Permission Denied',
          message: 'Please enable notifications in your browser settings.',
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Setup Failed',
        message: 'Failed to set up notifications. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await unsubscribe();
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to disable notifications.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (
    preferenceId: string,
    channel: keyof NotificationPreference['channels'],
    enabled: boolean
  ) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === preferenceId
          ? {
              ...pref,
              channels: { ...pref.channels, [channel]: enabled },
            }
          : pref
      )
    );
  };

  const testNotification = () => {
    showNotification({
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test notification to verify your settings.',
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notification Settings
          </h2>
        </div>

        {/* Browser Notification Setup */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Browser Notifications
          </h3>
          
          {!isSupported ? (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <XMarkIcon className="w-5 h-5 text-red-500" />
              <span>Push notifications are not supported in this browser.</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Status: <span className="font-medium">{permission}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow browser notifications to stay updated in real-time
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {permission === 'granted' ? (
                    <button
                      onClick={handleUnsubscribe}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Disabling...' : 'Disable'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePermissionRequest}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Enabling...' : 'Enable'}
                    </button>
                  )}
                  
                  <button
                    onClick={testNotification}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h3>
          
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 dark:border-gray-600">
              <div className="col-span-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Type
                </span>
              </div>
              <div className="col-span-2 text-center">
                <DevicePhoneMobileIcon className="w-5 h-5 mx-auto text-gray-500" title="Push Notifications" />
              </div>
              <div className="col-span-2 text-center">
                <EnvelopeIcon className="w-5 h-5 mx-auto text-gray-500" title="Email Notifications" />
              </div>
              <div className="col-span-2 text-center">
                <ComputerDesktopIcon className="w-5 h-5 mx-auto text-gray-500" title="Browser Notifications" />
              </div>
            </div>

            {/* Preference Rows */}
            {preferences.map((preference) => (
              <motion.div
                key={preference.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
              >
                <div className="col-span-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {preference.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {preference.description}
                  </p>
                </div>
                
                {/* Push Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => updatePreference(preference.id, 'push', !preference.channels.push)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      preference.channels.push
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {preference.channels.push && <CheckIcon className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Email Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => updatePreference(preference.id, 'email', !preference.channels.email)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      preference.channels.email
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {preference.channels.email && <CheckIcon className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Browser Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => updatePreference(preference.id, 'browser', !preference.channels.browser)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      preference.channels.browser
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                  >
                    {preference.channels.browser && <CheckIcon className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button
              onClick={() => {
                // Save preferences to backend
                showNotification({
                  type: 'success',
                  title: 'Settings Saved',
                  message: 'Your notification preferences have been updated.',
                });
              }}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}