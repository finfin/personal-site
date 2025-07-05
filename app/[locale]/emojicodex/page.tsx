'use client';

import { useTranslations } from 'next-intl';
import CompositionMode from './components/CompositionMode';

export default function EmojiCodexPage() {
  const t = useTranslations('emojicodex');

  return (
    <main className="container mx-auto p-4 max-w-4xl font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-heading-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Content */}
      <div className="min-h-screen">
        <CompositionMode />
      </div>
    </main>
  );
}
