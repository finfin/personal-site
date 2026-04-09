import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Fredoka, Noto_Sans_TC } from 'next/font/google'
import CrosswordGame from './CrosswordGame'
import { LayoutProps } from '@/lib/types'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fredoka',
})

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-tc',
})

type Params = { locale: string }

export async function generateMetadata({ params }: LayoutProps<Params>) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'crossword' })
  return { title: t('title') }
}

export default async function CrosswordPage({ params }: LayoutProps<Params>) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className={`${fredoka.variable} ${notoSansTC.variable} -mx-2 md:-mx-4 lg:-mx-0 lg:w-screen lg:relative lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[calc(100vw-2rem)]`}>
      <CrosswordGame />
    </div>
  )
}
