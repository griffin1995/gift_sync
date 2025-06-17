import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UseNotificationsOptions {
  enablePushNotifications?: boolean;
  enableBrowserNotifications?: boolean;
  pollingInterval?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isSupported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    enablePushNotifications = true,
    enableBrowserNotifications = true,
    pollingInterval = 30000, // 30 seconds
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  // Check if notifications are supported
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('giftsync_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })));
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('giftsync_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Notifications are not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [isSupported]);

  // Show browser notification
  const showBrowserNotification = useCallback((notification: Notification) => {
    if (!enableBrowserNotifications || permission !== 'granted') return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: notification.id,
      requireInteraction: notification.type === 'error',
      timestamp: notification.timestamp.getTime(),
      data: {
        url: notification.actionUrl,
        notificationId: notification.id,
      },
    });

    // Handle notification click
    browserNotification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      if (notification.actionUrl) {
        window.open(notification.actionUrl, '_blank');
      }
      
      markAsRead(notification.id);
      browserNotification.close();
    };

    // Auto-close after 5 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }, [enableBrowserNotifications, permission]);

  // Show toast notification
  const showToastNotification = useCallback((notification: Notification) => {
    const toastOptions = {
      duration: notification.type === 'error' ? 10000 : 5000,
      position: 'top-right' as const,
    };

    switch (notification.type) {
      case 'success':
        toast.success(`${notification.title}\n${notification.message}`, toastOptions);
        break;
      case 'error':
        toast.error(`${notification.title}\n${notification.message}`, toastOptions);
        break;
      case 'warning':
        toast(`${notification.title}\n${notification.message}`, {
          ...toastOptions,
          icon: '⚠️',
        });
        break;
      default:
        toast(`${notification.title}\n${notification.message}`, toastOptions);
        break;
    }
  }, []);

  // Add new notification
  const showNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Show browser notification
    showBrowserNotification(notification);
    
    // Show toast notification
    showToastNotification(notification);
  }, [showBrowserNotification, showToastNotification]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!enablePushNotifications || !isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      showNotification({
        type: 'success',
        title: 'Notifications Enabled',
        message: 'You will now receive push notifications for important updates.',
      });
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      showNotification({
        type: 'error',
        title: 'Notification Setup Failed',
        message: 'Unable to enable push notifications. Please try again.',
      });
    }
  }, [enablePushNotifications, isSupported, showNotification]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
      }

      showNotification({
        type: 'info',
        title: 'Notifications Disabled',
        message: 'You will no longer receive push notifications.',
      });
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    }
  }, [isSupported, showNotification]);

  // Poll for new notifications (fallback for real-time)
  useEffect(() => {
    if (!pollingInterval) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const serverNotifications = await response.json();
          
          // Merge with local notifications, avoiding duplicates
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotifications = serverNotifications
              .filter((n: Notification) => !existingIds.has(n.id))
              .map((n: any) => ({
                ...n,
                timestamp: new Date(n.timestamp),
              }));
            
            return [...newNotifications, ...prev].slice(0, 100); // Keep max 100 notifications
          });
        }
      } catch (error) {
        // Silently fail - polling is a fallback mechanism
        console.debug('Notification polling failed:', error);
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  // Listen for service worker messages (for push notifications)
  useEffect(() => {
    if (!isSupported) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
        const notification = event.data.notification;
        showNotification(notification);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [isSupported, showNotification]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isSupported,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    showNotification,
    subscribe,
    unsubscribe,
  };
}