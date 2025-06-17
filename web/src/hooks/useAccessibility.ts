import { useEffect, useState, useCallback } from 'react';

interface UseAccessibilityOptions {
  announcePageChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  reducedMotion?: boolean;
}

interface UseAccessibilityReturn {
  isReducedMotion: boolean;
  announceToScreenReader: (message: string) => void;
  focusOnElement: (selector: string) => void;
  trapFocus: (container: HTMLElement) => () => void;
  getSkipLinks: () => { href: string; label: string }[];
}

export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const {
    announcePageChanges = true,
    enableKeyboardNavigation = true,
    reducedMotion = true,
  } = options;

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (!reducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [reducedMotion]);

  // Announce messages to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus on an element by selector
  const focusOnElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      
      // Scroll into view if needed
      element.scrollIntoView({
        behavior: isReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }, [isReducedMotion]);

  // Trap focus within a container (for modals, etc.)
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close modal or return focus
        const closeButton = container.querySelector('[data-close]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Get skip navigation links
  const getSkipLinks = useCallback(() => {
    return [
      { href: '#main-content', label: 'Skip to main content' },
      { href: '#navigation', label: 'Skip to navigation' },
      { href: '#footer', label: 'Skip to footer' },
    ];
  }, []);

  // Set up keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (event.altKey) {
        switch (event.key) {
          case 'h':
            // Alt + H: Go to home
            event.preventDefault();
            window.location.href = '/';
            break;
          case 'd':
            // Alt + D: Go to dashboard
            event.preventDefault();
            window.location.href = '/dashboard';
            break;
          case 's':
            // Alt + S: Go to search/discover
            event.preventDefault();
            window.location.href = '/discover';
            break;
          case '/':
            // Alt + /: Focus search
            event.preventDefault();
            focusOnElement('input[type="search"], input[placeholder*="search" i]');
            break;
        }
      }

      // Tab navigation enhancements
      if (event.key === 'Tab') {
        // Add visible focus indicators
        document.body.classList.add('keyboard-navigation');
      }
    };

    const handleMouseDown = () => {
      // Remove keyboard navigation class on mouse use
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enableKeyboardNavigation, focusOnElement]);

  // Announce page changes for screen readers
  useEffect(() => {
    if (!announcePageChanges) return;

    const announcePageTitle = () => {
      const title = document.title;
      if (title) {
        announceToScreenReader(`Page loaded: ${title}`);
      }
    };

    // Announce initial page load
    setTimeout(announcePageTitle, 100);

    // Listen for navigation changes (for SPA routing)
    const handlePopState = () => {
      setTimeout(announcePageTitle, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [announcePageChanges, announceToScreenReader]);

  return {
    isReducedMotion,
    announceToScreenReader,
    focusOnElement,
    trapFocus,
    getSkipLinks,
  };
}