import '../global.css'

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '../components/footer'
import { Navbar} from '../components/nav'
import { ThemeProvider } from '../provider/theme-provider';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from 'i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Wave } from '@/components/wave';
import { cn } from '@/lib/utils'

type ValidLocale = (typeof routing.locales)[number];

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
    title: t('title'),
    description: t('description'),
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
        {url: '/image/favicon.ico'},
        {sizes: '32x32', url: '/image/favicon-32x32.png'},
        {sizes: '16x16', url: '/image/favicon-16x16.png'},
      ],
      other: [{
        rel: 'apple-touch-icon',
        url: '/image/apple-touch-icon.png',
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

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      className={cn(
        'text-black dark:text-white dark:bg-dark-background-primary bg-light-background-primary',
        GeistSans.variable,
        GeistMono.variable
      )}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
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

