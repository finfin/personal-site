'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
  currentTheme: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 獲取初始主題
const getInitialTheme = () => {
  if (typeof window === 'undefined') {return 'auto'}
  return localStorage.getItem('theme') || 'auto'
}

const getCurrentTheme = (theme) => {
  // currentTheme is theme when not auto
  // if auto, we need to check system preference
  if (typeof window === 'undefined') {return 'light'}
  if (theme !== 'auto') {
    return theme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(getInitialTheme)



  // 處理主題變化
  useEffect(() => {
    // 保存主題到 localStorage
    localStorage.setItem('theme', theme)

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
  const currentTheme = getCurrentTheme(theme);
  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
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
