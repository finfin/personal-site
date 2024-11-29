'use client'
import { useTheme } from 'next-themes'
import { Navbar } from './nav'

export default function ClientNav() {
  const {theme, setTheme } = useTheme()
  return <Navbar theme={theme} onThemeChange={setTheme} />
}
