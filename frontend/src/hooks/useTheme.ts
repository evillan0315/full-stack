import { createSignal, createEffect, createContext, useContext, JSX } from 'solid-js';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: () => boolean;
}

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props: { children: JSX.Element }) {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('color-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Default to light
    return 'light';
  };

  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store in localStorage
    localStorage.setItem('color-theme', newTheme);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Check if current theme is dark
  const isDark = () => theme() === 'dark';

  // Apply theme when it changes
  createEffect(() => {
    applyTheme(theme());
  });

  // Apply initial theme
  applyTheme(theme());

  // Listen for system preference changes
  createEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('color-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  const contextValue = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  };

  return <ThemeContext.Provider value={contextValue}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
