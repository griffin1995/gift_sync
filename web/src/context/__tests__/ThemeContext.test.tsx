import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock the useDarkMode hook
const mockUseDarkMode = {
  theme: 'system' as const,
  isDark: false,
  setTheme: jest.fn(),
  toggleTheme: jest.fn(),
};

jest.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => mockUseDarkMode,
}));

// Test component that uses the theme context
function TestComponent() {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="isDark">{isDark.toString()}</div>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={toggleTheme} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to default state
    mockUseDarkMode.theme = 'system';
    mockUseDarkMode.isDark = false;
  });

  describe('ThemeProvider', () => {
    it('provides theme context to children', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');
    });

    it('updates when dark mode hook values change', () => {
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');

      // Update mock values
      mockUseDarkMode.theme = 'dark';
      mockUseDarkMode.isDark = true;

      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });

    it('calls setTheme when theme is changed', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      act(() => {
        setDarkButton.click();
      });

      expect(mockUseDarkMode.setTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme for light mode', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const setLightButton = screen.getByTestId('set-light');
      act(() => {
        setLightButton.click();
      });

      expect(mockUseDarkMode.setTheme).toHaveBeenCalledWith('light');
    });

    it('calls toggleTheme when toggle is triggered', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      act(() => {
        toggleButton.click();
      });

      expect(mockUseDarkMode.toggleTheme).toHaveBeenCalled();
    });
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('returns correct context values', () => {
      mockUseDarkMode.theme = 'light';
      mockUseDarkMode.isDark = false;

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(screen.getByTestId('isDark')).toHaveTextContent('false');
    });

    it('returns correct context values for dark theme', () => {
      mockUseDarkMode.theme = 'dark';
      mockUseDarkMode.isDark = true;

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });

    it('returns correct context values for system theme', () => {
      mockUseDarkMode.theme = 'system';
      mockUseDarkMode.isDark = true; // System preference is dark

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('system');
      expect(screen.getByTestId('isDark')).toHaveTextContent('true');
    });
  });

  describe('Theme Context Integration', () => {
    it('provides all useDarkMode functionality', () => {
      const TestIntegrationComponent = () => {
        const themeContext = useTheme();
        
        return (
          <div>
            <div data-testid="has-theme">{typeof themeContext.theme}</div>
            <div data-testid="has-isDark">{typeof themeContext.isDark}</div>
            <div data-testid="has-setTheme">{typeof themeContext.setTheme}</div>
            <div data-testid="has-toggleTheme">{typeof themeContext.toggleTheme}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestIntegrationComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-theme')).toHaveTextContent('string');
      expect(screen.getByTestId('has-isDark')).toHaveTextContent('boolean');
      expect(screen.getByTestId('has-setTheme')).toHaveTextContent('function');
      expect(screen.getByTestId('has-toggleTheme')).toHaveTextContent('function');
    });

    it('maintains referential stability between renders', () => {
      let renderCount = 0;
      const contextValues: any[] = [];

      const TestStabilityComponent = () => {
        const themeContext = useTheme();
        renderCount++;
        contextValues.push(themeContext);
        
        return <div data-testid="render-count">{renderCount}</div>;
      };

      const { rerender } = render(
        <ThemeProvider>
          <TestStabilityComponent />
        </ThemeProvider>
      );

      expect(renderCount).toBe(1);

      rerender(
        <ThemeProvider>
          <TestStabilityComponent />
        </ThemeProvider>
      );

      expect(renderCount).toBe(2);
      
      // The context object should be the same between renders
      // (assuming useDarkMode provides stable references)
      expect(contextValues[0]).toBe(contextValues[1]);
    });
  });

  describe('Multiple Providers', () => {
    it('supports nested providers (edge case)', () => {
      const InnerComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="inner-theme">{theme}</div>;
      };

      const OuterComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <div data-testid="outer-theme">{theme}</div>
            <ThemeProvider>
              <InnerComponent />
            </ThemeProvider>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <OuterComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('outer-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('inner-theme')).toHaveTextContent('system');
    });
  });
});