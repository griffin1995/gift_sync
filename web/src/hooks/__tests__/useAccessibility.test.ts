import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from '../useAccessibility';

// Mock matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('useAccessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    
    // Reset matchMedia mock
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('Reduced Motion Detection', () => {
    it('detects reduced motion preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useAccessibility({ reducedMotion: true }));

      expect(result.current.isReducedMotion).toBe(true);
    });

    it('defaults to no reduced motion when preference is not set', () => {
      const { result } = renderHook(() => useAccessibility({ reducedMotion: true }));

      expect(result.current.isReducedMotion).toBe(false);
    });

    it('updates when system preference changes', () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      mockMatchMedia.mockImplementation(() => ({
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { unmount } = renderHook(() => useAccessibility({ reducedMotion: true }));

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Screen Reader Announcements', () => {
    it('creates announcement element with correct attributes', () => {
      const { result } = renderHook(() => useAccessibility());

      act(() => {
        result.current.announceToScreenReader('Test announcement');
      });

      const announcement = document.querySelector('[aria-live="polite"]');
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('aria-atomic', 'true');
      expect(announcement).toHaveClass('sr-only');
      expect(announcement).toHaveTextContent('Test announcement');
    });

    it('removes announcement element after timeout', async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useAccessibility());

      act(() => {
        result.current.announceToScreenReader('Test announcement');
      });

      expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(document.querySelector('[aria-live="polite"]')).not.toBeInTheDocument();

      jest.useRealTimers();
    });
  });

  describe('Focus Management', () => {
    it('focuses on element by selector', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      const mockFocus = jest.fn();
      button.focus = mockFocus;
      document.body.appendChild(button);

      const { result } = renderHook(() => useAccessibility());

      act(() => {
        result.current.focusOnElement('#test-button');
      });

      expect(mockFocus).toHaveBeenCalled();
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });

    it('uses auto scroll behavior when reduced motion is enabled', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const button = document.createElement('button');
      button.id = 'test-button';
      const mockFocus = jest.fn();
      button.focus = mockFocus;
      document.body.appendChild(button);

      const { result } = renderHook(() => useAccessibility({ reducedMotion: true }));

      act(() => {
        result.current.focusOnElement('#test-button');
      });

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'center',
      });
    });

    it('handles missing elements gracefully', () => {
      const { result } = renderHook(() => useAccessibility());

      expect(() => {
        act(() => {
          result.current.focusOnElement('#non-existent');
        });
      }).not.toThrow();
    });
  });

  describe('Focus Trapping', () => {
    it('traps focus within container', () => {
      const container = document.createElement('div');
      const button1 = document.createElement('button');
      const button2 = document.createElement('button');
      const button3 = document.createElement('button');

      button1.textContent = 'Button 1';
      button2.textContent = 'Button 2';
      button3.textContent = 'Button 3';

      container.appendChild(button1);
      container.appendChild(button2);
      container.appendChild(button3);
      document.body.appendChild(container);

      const mockFocus1 = jest.fn();
      const mockFocus2 = jest.fn();
      const mockFocus3 = jest.fn();

      button1.focus = mockFocus1;
      button2.focus = mockFocus2;
      button3.focus = mockFocus3;

      const { result } = renderHook(() => useAccessibility());

      let cleanup: (() => void) | undefined;

      act(() => {
        cleanup = result.current.trapFocus(container);
      });

      expect(mockFocus1).toHaveBeenCalled();

      // Simulate Tab key on last element
      Object.defineProperty(document, 'activeElement', {
        value: button3,
        writable: true,
      });

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);

      // Should wrap to first element
      expect(mockFocus1).toHaveBeenCalledTimes(2);

      // Cleanup
      if (cleanup) {
        cleanup();
      }
    });

    it('handles Escape key to close modal', () => {
      const container = document.createElement('div');
      const closeButton = document.createElement('button');
      closeButton.setAttribute('data-close', '');
      const mockClick = jest.fn();
      closeButton.click = mockClick;
      container.appendChild(closeButton);
      document.body.appendChild(container);

      const { result } = renderHook(() => useAccessibility());

      let cleanup: (() => void) | undefined;

      act(() => {
        cleanup = result.current.trapFocus(container);
      });

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(mockClick).toHaveBeenCalled();

      if (cleanup) {
        cleanup();
      }
    });
  });

  describe('Skip Links', () => {
    it('returns correct skip links', () => {
      const { result } = renderHook(() => useAccessibility());

      const skipLinks = result.current.getSkipLinks();

      expect(skipLinks).toEqual([
        { href: '#main-content', label: 'Skip to main content' },
        { href: '#navigation', label: 'Skip to navigation' },
        { href: '#footer', label: 'Skip to footer' },
      ]);
    });
  });

  describe('Keyboard Navigation', () => {
    it('sets up global keyboard shortcuts', () => {
      const mockAddEventListener = jest.spyOn(document, 'addEventListener');
      const mockRemoveEventListener = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useAccessibility({ enableKeyboardNavigation: true }));

      expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('adds keyboard navigation class on Tab key', () => {
      renderHook(() => useAccessibility({ enableKeyboardNavigation: true }));

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);

      expect(document.body).toHaveClass('keyboard-navigation');
    });

    it('removes keyboard navigation class on mouse use', () => {
      renderHook(() => useAccessibility({ enableKeyboardNavigation: true }));

      // First add the class
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(tabEvent);
      expect(document.body).toHaveClass('keyboard-navigation');

      // Then remove it with mouse
      const mouseEvent = new MouseEvent('mousedown');
      document.dispatchEvent(mouseEvent);
      expect(document.body).not.toHaveClass('keyboard-navigation');
    });
  });

  describe('Page Change Announcements', () => {
    it('announces page title on load', () => {
      jest.useFakeTimers();
      document.title = 'Test Page';

      renderHook(() => useAccessibility({ announcePageChanges: true }));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const announcement = document.querySelector('[aria-live="polite"]');
      expect(announcement).toHaveTextContent('Page loaded: Test Page');

      jest.useRealTimers();
    });

    it('listens for popstate events', () => {
      const mockAddEventListener = jest.spyOn(window, 'addEventListener');
      const mockRemoveEventListener = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useAccessibility({ announcePageChanges: true }));

      expect(mockAddEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
    });
  });

  describe('Configuration Options', () => {
    it('respects disabled options', () => {
      const { result } = renderHook(() => useAccessibility({
        announcePageChanges: false,
        enableKeyboardNavigation: false,
        reducedMotion: false,
      }));

      expect(result.current.isReducedMotion).toBe(false);
      expect(document.addEventListener).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});