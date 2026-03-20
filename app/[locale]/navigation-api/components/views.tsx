import type { ReactNode } from 'react';

/* ── Article definitions (content comes from i18n via t.raw) ── */

export interface Article {
  id: number;
  slug: string;
  titleKey: string;
  summaryKey: string;
  bodyKey: string;
}

export const articles: Article[] = [
  { id: 1, slug: 'design-goals', titleKey: 'article1_title', summaryKey: 'article1_summary', bodyKey: 'article1_body' },
  { id: 2, slug: 'standards-evolution', titleKey: 'article2_title', summaryKey: 'article2_summary', bodyKey: 'article2_body' },
  { id: 3, slug: 'usage', titleKey: 'article3_title', summaryKey: 'article3_summary', bodyKey: 'article3_body' },
  { id: 4, slug: 'browser-support', titleKey: 'article4_title', summaryKey: 'article4_summary', bodyKey: 'article4_body' },
  { id: 5, slug: 'known-limitations', titleKey: 'article5_title', summaryKey: 'article5_summary', bodyKey: 'article5_body' },
];

/* ── View components ──────────────────────────────────── */

interface ViewProps {
  t: (key: string) => string;
  tRaw: (key: string) => string;
  onNavigate: (hash: string, state?: Record<string, unknown>) => void;
}

export function HomeView({ t }: ViewProps): ReactNode {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('homeTitle')}</h2>
      <p className="text-muted-foreground leading-relaxed">
        {t('homeIntro')}
      </p>
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4 text-sm">
        💡 {t('homeTryIt')}
      </div>
    </div>
  );
}

export function ArticleListView({ t, tRaw, onNavigate }: ViewProps): ReactNode {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('articlesTitle')}</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <article
            className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            key={article.id}
            onClick={() =>
              onNavigate(`#/article/${article.id}`, {
                selectedId: article.id,
                from: 'article-list',
              })
            }
          >
            <h3 className="text-lg font-semibold mb-1">{tRaw(article.titleKey)}</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-3">
              {tRaw(article.summaryKey)}
            </p>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {t('readMore')}
            </span>
          </article>
        ))}
      </div>

      {/* References card */}
      <article
        className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        onClick={() => onNavigate('#/references')}
      >
        <h3 className="text-lg font-semibold mb-1">{t('references')}</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          {t('referencesSummary')}
        </p>
        <span className="text-sm text-blue-600 dark:text-blue-400">
          {t('readMore')}
        </span>
      </article>
    </div>
  );
}

export function ArticleDetailView({
  t,
  tRaw,
  onNavigate,
  articleId,
}: ViewProps & { articleId: number }): ReactNode {
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="text-muted-foreground">Article not found (id: {articleId})</div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('#/articles');
        }}
        type="button"
      >
        {t('backToArticles')}
      </button>
      <h2 className="text-2xl font-bold">{tRaw(article.titleKey)}</h2>
      <div className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
        {tRaw(article.bodyKey)}
      </div>
    </div>
  );
}

export function AboutView({ t }: ViewProps): ReactNode {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('aboutTitle')}</h2>
      <p className="text-muted-foreground leading-relaxed">
        {t('aboutContent')}
      </p>
      <div>
        <h3 className="font-semibold mb-2">{t('aboutFeatures')}</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>{t('aboutFeature1')}</li>
          <li>{t('aboutFeature2')}</li>
          <li>{t('aboutFeature3')}</li>
          <li>{t('aboutFeature4')}</li>
          <li>{t('aboutFeature5')}</li>
        </ul>
      </div>
    </div>
  );
}

const references = [
  { label: 'MDN — Navigation API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API' },
  { label: 'Chrome Developers — Navigation API', url: 'https://developer.chrome.com/docs/web-platform/navigation-api' },
  { label: 'WHATWG HTML Standard — Section 7.2', url: 'https://html.spec.whatwg.org/multipage/nav-history-apis.html#navigation-api' },
  { label: 'Can I Use — Navigation API', url: 'https://caniuse.com/mdn-api_navigation' },
];

export function ReferencesView({ t, onNavigate }: ViewProps): ReactNode {
  return (
    <div className="space-y-4">
      <button
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('#/articles');
        }}
        type="button"
      >
        {t('backToArticles')}
      </button>
      <h2 className="text-2xl font-bold">{t('references')}</h2>
      <div className="space-y-3">
        {references.map((ref) => (
          <a
            className="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            href={ref.url}
            key={ref.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {ref.label}
            </span>
            <span className="block text-xs text-muted-foreground mt-1 truncate">
              {ref.url}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
