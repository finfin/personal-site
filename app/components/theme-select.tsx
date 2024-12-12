'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Monitor, Moon, Sun } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

export function ThemeSelect() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations('theme')

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) {
    return null;
  }
  return (
    <ToggleGroup
      className="border-0 bg-transparent"
      onValueChange={setTheme}
      type="single"
      value={theme}
    >
      <ToggleGroupItem
        aria-label={t('light')}
        className="dark:data-[state=on]:bg-white/10 data-[state=on]:bg-black/10"
        value="light"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">{t('light')}</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        aria-label={t('dark')}
        className="dark:data-[state=on]:bg-white/10 data-[state=on]:bg-black/10"
        value="dark"
      >

        <Moon className="h-4 w-4" />
        <span className="sr-only">{t('dark')}</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        aria-label={t('system')}
        className="dark:data-[state=on]:bg-white/10 data-[state=on]:bg-black/10"
        value="system"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">{t('system')}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
