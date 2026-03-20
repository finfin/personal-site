'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import NavigationDemo from './components/NavigationDemo';

export default function NavigationApiPage() {
  const t = useTranslations('navigation-api');
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSupported(typeof (window as any).navigation !== 'undefined');
  }, []);

  // SSR / hydrating
  if (supported === null) {
    return (
      <main className="container mx-auto px-0 sm:p-4 max-w-5xl font-sans">
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          <div className="animate-pulse">Loading…</div>
        </div>
      </main>
    );
  }

  // Browser does not support Navigation API
  if (!supported) {
    return (
      <main className="container mx-auto px-0 sm:p-4 max-w-5xl font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-8 sm:p-12 max-w-lg space-y-4">
            <div className="text-5xl mb-2">🚫</div>
            <h1 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
              {t('notSupported')}
            </h1>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
              {t('notSupportedDetail')}
            </p>
            <a
              className="inline-block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              href="https://caniuse.com/mdn-api_navigation"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('checkSupport')} →
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-0 sm:p-4 max-w-5xl font-sans">
      <div className="mb-8 px-4 sm:px-0">
        <h1 className="text-4xl font-bold text-heading-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('description')}</p>
      </div>
      <NavigationDemo />
    </main>
  );
}
