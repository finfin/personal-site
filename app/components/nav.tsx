'use client'

import {Link} from 'i18n/routing'
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
        <aside className="tracking-tight bg-light-background-secondary dark:bg-dark-background-secondary py-4 px-4 lg:sticky lg:top-0 z-10">
            <div className="max-w-4xl lg:mx-auto  ">
                <nav className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative">
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
