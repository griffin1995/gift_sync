import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  BellIcon,
  FunnelIcon,
  TrashIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { formatRelativeTime } from '@/utils/formatting';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Notification['type']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    // Read status filter
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getNotificationTypeIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <BellIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <BellIcon className={`${iconClass} text-yellow-500`} />;
      default:
        return <BellIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  const getNotificationTypeColour = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <>
      <Head>
        <title>Notifications - GiftSync</title>
        <meta name="description" content="Manage your notifications and stay updated with GiftSync" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Stay updated with your gift recommendations and activity
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {unreadCount} unread
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <BellIcon className="w-5 h-5 mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <NotificationSettings />
            </motion.div>
          )}

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                {/* Read Status Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>

                {/* Actions */}
                {notifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Mark All Read
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'You\'ll see notifications here when they arrive.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColour(notification.type)}`}>
                                {notification.type}
                              </span>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                  New
                                </span>
                              )}
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{formatRelativeTime(notification.timestamp)}</span>
                              {notification.actionUrl && notification.actionLabel && (
                                <a
                                  href={notification.actionUrl}
                                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  {notification.actionLabel} →
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                title="Mark as read"
                              >
                                <CheckIcon className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete notification"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination or Load More */}
          {filteredNotifications.length > 0 && filteredNotifications.length >= 20 && (
            <div className="mt-6 text-center">
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Load More Notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}