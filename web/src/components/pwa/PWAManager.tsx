import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface PWAManagerProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAManager: React.FC<PWAManagerProps> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed/standalone
    const checkStandalone = () => {
      if (typeof window !== 'undefined') {
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                                 (window.navigator as any).standalone ||
                                 document.referrer.includes('android-app://');
        
        setIsStandalone(isStandaloneMode);
        setIsInstalled(isStandaloneMode);
      }
    };

    checkStandalone();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show install prompt after a delay (if not already installed)
      if (!isInstalled) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 10000); // Show after 10 seconds
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          method: 'browser_prompt'
        });
      }
    };

    // Listen for display mode changes
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', handleDisplayModeChange);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      };
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
        
        // Track installation attempt
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pwa_install_accepted', {
            platform: choiceResult.platform
          });
        }
      } else {
        console.log('User dismissed the install prompt');
        
        // Track dismissal
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pwa_install_dismissed', {
            platform: choiceResult.platform
          });
        }
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during install:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    }

    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_install_banner_dismissed');
    }
  };

  // Don't show if already dismissed this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (dismissed) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Don't render if standalone or no prompt available
  if (isStandalone || !deferredPrompt) {
    return null;
  }

  return (
    <div className={className}>
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install GiftSync
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Add to your home screen for quick access and offline browsing
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="flex-1 bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Safari specific install instructions */}
      <AnimatePresence>
        {showInstallPrompt && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install GiftSync
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Tap the share button <span className="inline-block">📤</span> and select "Add to Home Screen"
                  </p>
                  
                  <button
                    onClick={handleDismiss}
                    className="w-full bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Got it
                  </button>
                </div>
                
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PWAManager;