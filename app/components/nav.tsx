'use client'

import {Link} from '@/i18n/routing'
// import { usePathname } from 'next/navigation'
import { ThemeSelect } from './theme-select'
import LanguageSwitcher from './language-switcher'

export function Navbar() {
    // const pathname = usePathname()
    // const lang = pathname?.split('/')[1] || 'en'

    const navItems = {
        ['/']: {
            name: 'home',
        },
        ['/posts']: {
            name: 'blog',
        },
    }

    return (
        <aside className="-ml-[8px] mb-16 tracking-tight">
            <div className="lg:sticky lg:top-20">
                <nav className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative">
                    <div className="flex flex-row space-x-0 pr-10">
                        {Object.entries(navItems).map(([path, { name }]) => {
                            return (
                                <Link
                                    className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                                    href={path}
                                    key={path}
                                >
                                    {name}
                                </Link>
                            )
                        })}
                    </div>
                    <div className="flex flex-row gap-4 ml-auto">
                        <ThemeSelect />
                        <LanguageSwitcher />
                    </div>
                </nav>
            </div>
        </aside>
    )
}
