import '../global.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from '../components/footer'
import { Navbar} from '../components/nav'
import { baseUrl } from '../sitemap'
import { ThemeProvider } from '../provider/theme-provider';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { GoogleAnalytics } from '@next/third-parties/google'


type ValidLocale = (typeof routing.locales)[number];

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as ValidLocale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const t = await getTranslations({locale, namespace: 'metadata'});

  return {
    title: t('title'),
    description: 'This is my portfolio.',
    openGraph: {
      title: 'My Portfolio',
      description: 'This is my portfolio.',
      url: baseUrl,
      siteName: 'My Portfolio',
      locale: 'en_US',
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


// export const metadata: Metadata = {
//   metadataBase: new URL(baseUrl),
//   title: {
//     default: 'Things About Web Dev',
//     template: '%s | Next.js Portfolio Starter',
//   },
//   description: 'This is my portfolio.',
//   openGraph: {
//     title: 'My Portfolio',
//     description: 'This is my portfolio.',
//     url: baseUrl,
//     siteName: 'My Portfolio',
//     locale: 'en_US',
//     type: 'website',
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
// }

const cx = (...classes) => classes.filter(Boolean).join(' ')

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
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="antialiased max-w-4xl mx-4 mt-8 lg:mx-auto">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
              <Navbar />
              {children}
              <Footer />
              <Analytics />
              <SpeedInsights />
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId='G-PNJ8MDH6MX' />
    </html>
  )
}

