import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

interface MiniNavBarProps {
  t: (key: string) => string;
  currentHash: string;
  onNavigate: (hash: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
}

const navItems = [
  { hash: '#/home', key: 'home' },
  { hash: '#/articles', key: 'articles' },
  { hash: '#/about', key: 'about' },
];

export default function MiniNavBar({
  t,
  currentHash,
  onNavigate,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
}: MiniNavBarProps) {
  const isActive = (hash: string) => {
    if (hash === '#/home') {
      return currentHash === '#/home' || currentHash === '' || currentHash === '#/';
    }
    if (hash === '#/articles') {
      return currentHash === '#/articles' || currentHash.startsWith('#/article');
    }
    return currentHash === hash;
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
      {/* Back / Forward */}
      <div className="flex items-center gap-1 mr-2">
        <button
          aria-label={t('back')}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={!canGoBack}
          onClick={onBack}
          title={t('back')}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label={t('forward')}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          disabled={!canGoForward}
          onClick={onForward}
          title={t('forward')}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          aria-label={t('reload')}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onReload}
          title={t('reload')}
          type="button"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {navItems.map(({ hash, key }) => (
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive(hash)
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            key={hash}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(hash);
            }}
            type="button"
          >
            {t(key)}
          </button>
        ))}
      </nav>

      {/* URL display */}
      <div className="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-800/50 rounded px-2 py-1 max-w-48 truncate">
        <span className="text-gray-300 dark:text-gray-600">…</span>
        {currentHash || '#/home'}
      </div>
    </div>
  );
}
