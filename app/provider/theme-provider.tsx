'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('auto')

  useEffect(() => {
    // Don't update data-theme if we're in auto mode
    if (theme !== 'auto') {
      document.documentElement.dataset.theme = theme;
      return;
    }

    // For auto mode, we need to watch system preferences
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on system preference
    document.documentElement.dataset.theme = mediaQuery.matches ? 'dark' : 'light';

    // Update theme when system preference changes
    function handleChange(e) {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
