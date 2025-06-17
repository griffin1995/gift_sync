import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../useDarkMode';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
};
Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
});

describe('useDarkMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Default matchMedia mock
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  describe('Initial State', () => {
    it('initializes with system theme by default', () => {
      const { result } = renderHook(() => useDarkMode());

      expect(result.current.theme).toBe('system');
      expect(result.current.isDark).toBe(false);
    });

    it('loads saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('ignores invalid theme values from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme');

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.theme).toBe('system');
    });
  });

  describe('Theme Setting', () => {
    it('sets light theme correctly', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giftsync_theme', 'light');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('sets dark theme correctly', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giftsync_theme', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('sets system theme correctly', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giftsync_theme', 'system');
    });
  });

  describe('System Theme Detection', () => {
    it('detects dark system preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(true);
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('detects light system preference', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(false);
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });

    it('listens for system theme changes', () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      mockMatchMedia.mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { unmount } = renderHook(() => useDarkMode());

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('updates theme when system preference changes', () => {
      let changeHandler: ((event: any) => void) | undefined;

      mockMatchMedia.mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDark).toBe(false);

      // Simulate system theme change to dark
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: true });
        }
      });

      expect(result.current.isDark).toBe(true);
    });

    it('ignores system changes when not on system theme', () => {
      let changeHandler: ((event: any) => void) | undefined;

      mockMatchMedia.mockImplementation(() => ({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn((event, handler) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      // Set to manual dark mode
      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.isDark).toBe(true);

      // Simulate system theme change - should be ignored
      act(() => {
        if (changeHandler) {
          changeHandler({ matches: false });
        }
      });

      expect(result.current.isDark).toBe(true); // Should remain dark
    });
  });

  describe('Theme Toggle', () => {
    it('toggles from light to dark', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('light');
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('toggles from dark to light', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('dark');
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('toggles from system to opposite of current state', () => {
      // Mock system as light
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.theme).toBe('system');
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('toggles from system dark to light', () => {
      // Mock system as dark
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.theme).toBe('system');
      expect(result.current.isDark).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });
  });

  describe('DOM Updates', () => {
    it('adds dark class when dark mode is enabled', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('removes dark class when dark mode is disabled', () => {
      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setTheme('light');
      });

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('Server-Side Rendering', () => {
    it('handles missing window object gracefully', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(() => {
        renderHook(() => useDarkMode());
      }).not.toThrow();

      global.window = originalWindow;
    });
  });
});