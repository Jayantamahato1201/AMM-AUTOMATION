import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'amm_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Check local storage
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme;
        }
        // 2. Check system OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (err) {
        console.warn('Could not read theme from localStorage:', err);
      }
    }
    // Default to dark mode for AMM's signature industrial aesthetic on first visit, or light if system prefers
    return 'dark';
  });

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Add temporary transition class for smooth morphing
    root.classList.add('theme-transitioning');

    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Remove transition class after animation completes to avoid impacting other transitions
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 450);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Could not persist theme to localStorage:', err);
    }
  }, [theme]);

  // Listen to OS theme changes if user hasn't explicitly set preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (!savedTheme) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      } catch (err) {
        // ignore
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
