import '../global.css'

import { Fira_Code } from 'next/font/google'

// 初始化 Fira Code 字體
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
})

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '../components/footer'
import { Navbar} from '../components/nav'
import { ThemeProvider } from 'next-themes'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from 'i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Wave } from '@/components/wave';
import { cn } from '@/lib/utils'
import {setRequestLocale} from 'next-intl/server'

type ValidLocale = (typeof routing.locales)[number];

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
    title: {
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    metadataBase: new URL('https://www.thingsaboutweb.dev'),
    openGraph: {
      title: {
        template: `%s | ${t('title')}`,
      },
      description: t('description'),
      url: 'https://www.thingsaboutweb.dev',
      siteName: t('title'),
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        {url: '/images/favicon.ico'},
        {sizes: '32x32', url: '/images/favicon-32x32.png'},
        {sizes: '16x16', url: '/images/favicon-16x16.png'},
      ],
      other: [{
        rel: 'apple-touch-icon',
        url: '/images/apple-touch-icon.png',
      }]
    },
    manifest: '/manifest.webmanifest',
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {

  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as ValidLocale)) {
    notFound();
  }

  setRequestLocale(locale);
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      className={cn(
        'text-primary bg-background-primary',
        firaCode.variable
      )}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="font-serif">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <main className="max-w-4xl mx-4 lg:mx-auto flex-auto min-w-0 mt-8 flex flex-col px-2 md:px-0">

              <Wave />
              {children}
              <Footer />
              <Analytics />
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId='G-PNJ8MDH6MX' />
        <SpeedInsights />
      </body>
    </html>
  )
}

