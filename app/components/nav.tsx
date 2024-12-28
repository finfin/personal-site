'use client'

import { Link } from 'i18n/routing'
// import { usePathname } from 'next/navigation'
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'
import Image from 'next/image';

const navbarItems = [
  {
    path: '/posts',
    name: 'posts',
  },
  {
    path: '/about',
    name: 'about',
  }
]


export function Navbar() {
  // const pathname = usePathname()
  // const lang = pathname?.split('/')[1] || 'en'
  const t = useTranslations('navbar')

  return (
    <aside className="tracking-tight bg-background-secondary px-4 lg:sticky lg:top-0 z-10">
      <div className="max-w-4xl lg:mx-auto  ">
        <nav className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative">
          <div className="flex flex-row items-center space-x-0 pr-10">
            {/* dark logo here using image /image/dark-logo.png */}
            <Link className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 pl-0 ml-0" href="/">
              <Image alt="logo" className='dark:block hidden' height={50} src="/images/dark-logo.png" width={150} />
              <Image alt="logo" className='dark:hidden block' height={50} src="/images/light-logo.png" width={150} />
            </Link>
            {navbarItems.map(({ path, name }) => {
              return (
                <Link
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                  href={path}
                  key={path}
                >
                  {t(name)}
                </Link>
              )
            })}
          </div>
          <div className="flex flex-row gap-4 ml-auto">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </aside>
  )
}
