'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'

interface ThemeContextType {
  theme: string
  currentTheme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 同步獲取初始主題
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'auto'
  return localStorage.getItem('theme') || 'auto'
}

const initialTheme = getInitialTheme()

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [userTheme, setUserTheme] = useState(initialTheme)

  // 派生 currentTheme
  const currentTheme = useMemo(() => {
    if (typeof window === 'undefined') return 'light'

    if (userTheme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return userTheme as 'light' | 'dark'
  }, [userTheme])

  // 處理主題變化和 DOM 更新
  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (userTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [userTheme, currentTheme]);

  const handleThemeChange = (newTheme: string) => {
    setUserTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  console.log('userTheme:', userTheme, 'currentTheme:', currentTheme);
  return (
    <ThemeContext.Provider value={{
      theme: userTheme,
      currentTheme,
      setTheme: handleThemeChange
    }}>
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
