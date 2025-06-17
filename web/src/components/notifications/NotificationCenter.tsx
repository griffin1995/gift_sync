import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon, 
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatting';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  );

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <ExclamationTriangleIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {/* Filter Buttons */}
                  <div className="flex rounded-md overflow-hidden">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 text-sm ${
                        filter === 'all'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1 text-sm ${
                        filter === 'unread'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      } transition-colors`}
                    >
                      Unread
                    </button>
                  </div>
                  
                  {/* Actions */}
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          title="Mark all as read"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={clearAll}
                        className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Clear all notifications"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {formatRelativeTime(notification.timestamp)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  title="Delete notification"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && notification.actionLabel && (
                              <a
                                href={notification.actionUrl}
                                className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                                onClick={() => markAsRead(notification.id)}
                              >
                                {notification.actionLabel} →
                              </a>
                            )}
                          </div>

                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Navigate to full notifications page
                      window.location.href = '/notifications';
                    }}
                    className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}