'use client'

import { useRef, useState } from 'react'
import { Link } from 'i18n/routing'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const learningItems = [
  {
    path: '/learning/crossword',
    name: 'crossword',
  },
  {
    path: '/learning/falling-words',
    name: 'fallingWords',
  },
]

export function LearningDropdown() {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const t = useTranslations('navbar')
  const tLearning = useTranslations('learning')

  const handleMouseEnter = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current) }
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 80)
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownMenu modal={false} onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <button
            className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 items-center gap-1 focus:outline-none"
            type="button"
          >
            {t('learning')}
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-600/50 shadow-xl animate-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sideOffset={2}
        >
          {learningItems.map(({ path, name }) => {
            const isActive = pathname.includes(path)
            return (
              <DropdownMenuItem asChild key={path}>
                <Link
                  className={`cursor-pointer transition-colors duration-150 block px-2 py-1.5 rounded-sm ${
                    isActive
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  href={path}
                >
                  {tLearning(name)}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
