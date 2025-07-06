'use client';

import { useTranslations } from 'next-intl';
import CompositionMode from './components/CompositionMode';

export default function EmojiArchitectPage() {
  const t = useTranslations('emojiarchitect');

  return (
    <main className="container mx-auto px-0 sm:p-4 max-w-4xl font-sans">
      <div className="mb-8 px-0">
        <h1 className="text-4xl font-bold text-heading-primary mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('description')}
        </p>
        <p className="text-lg text-muted-foreground">
          Select base emojis to see all complex emojis containing them. For example: Select 👩 + <div className='inline'>🏻</div> to see 👩🏽‍❤️‍💋‍👨🏻 and other combinations.
        </p>
      </div>

      {/* Content */}
      <div className="min-h-screen">
        <CompositionMode />
      </div>

      {/* References */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-0">
        <h2 className="text-xl font-semibold mb-4">References</h2>
        <ul className="space-y-2">
          <li>
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              href="https://www.unicode.org/reports/tr51/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Unicode Technical Report #51: Unicode Emoji
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
