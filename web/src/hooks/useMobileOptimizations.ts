import { useEffect, useState } from 'react';

interface MobileOptimizations {
  isMobile: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  viewportHeight: number;
  isStandalone: boolean;
  hasNotch: boolean;
  devicePixelRatio: number;
}

export const useMobileOptimizations = (): MobileOptimizations => {
  const [optimizations, setOptimizations] = useState<MobileOptimizations>({
    isMobile: false,
    isTouch: false,
    orientation: 'portrait',
    viewportHeight: 0,
    isStandalone: false,
    hasNotch: false,
    devicePixelRatio: 1,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOptimizations = () => {
      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

      // Detect touch capability
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Detect orientation
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      // Get viewport height (accounting for mobile browser UI)
      const viewportHeight = window.visualViewport?.height || window.innerHeight;

      // Detect standalone PWA mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (navigator as any).standalone ||
                          document.referrer.includes('android-app://');

      // Detect iPhone X+ notch
      const hasNotch = CSS.supports('padding-top: env(safe-area-inset-top)') &&
                      /iPhone/.test(navigator.userAgent);

      // Get device pixel ratio
      const devicePixelRatio = window.devicePixelRatio || 1;

      setOptimizations({
        isMobile,
        isTouch,
        orientation,
        viewportHeight,
        isStandalone,
        hasNotch,
        devicePixelRatio,
      });
    };

    // Initial setup
    updateOptimizations();

    // Listen for changes
    const handleResize = () => updateOptimizations();
    const handleOrientationChange = () => {
      setTimeout(updateOptimizations, 100); // Delay to account for orientation change
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Listen for visual viewport changes (mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateOptimizations);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateOptimizations);
      }
    };
  }, []);

  // Apply mobile-specific optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable zoom on iOS
    if (optimizations.isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    // Prevent overscroll/bounce on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    }

    // Add mobile-specific CSS classes
    document.body.classList.toggle('mobile', optimizations.isMobile);
    document.body.classList.toggle('touch', optimizations.isTouch);
    document.body.classList.toggle('standalone', optimizations.isStandalone);
    document.body.classList.toggle('has-notch', optimizations.hasNotch);
    document.body.classList.toggle('landscape', optimizations.orientation === 'landscape');
    document.body.classList.toggle('portrait', optimizations.orientation === 'portrait');

    return () => {
      document.body.classList.remove('mobile', 'touch', 'standalone', 'has-notch', 'landscape', 'portrait');
    };
  }, [optimizations]);

  return optimizations;
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const lightTap = () => vibrate(10);
  const mediumTap = () => vibrate(50);
  const heavyTap = () => vibrate(100);
  const doubleTap = () => vibrate([30, 20, 30]);
  const success = () => vibrate([50, 50, 50]);
  const error = () => vibrate([100, 50, 100]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    doubleTap,
    success,
    error,
  };
};

// Hook for detecting network status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      // Get connection type if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || 'unknown');
      }
    };

    updateNetworkStatus();

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return { isOnline, connectionType };
};

export default useMobileOptimizations;