import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Baloo_2, Fredoka, Noto_Sans_TC } from 'next/font/google'
import FallingWordsGame from './FallingWordsGame'
import { LayoutProps } from '@/lib/types'

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-baloo',
})

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
  const t = await getTranslations({ locale, namespace: 'fallingWords' })
  return { title: t('title') }
}

export default async function FallingWordsPage({ params }: LayoutProps<Params>) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className={`${baloo.variable} ${fredoka.variable} ${notoSansTC.variable} -mx-2 md:-mx-4 lg:-mx-0 lg:w-screen lg:relative lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[calc(100vw-2rem)]`}>
      <FallingWordsGame />
    </div>
  )
}
