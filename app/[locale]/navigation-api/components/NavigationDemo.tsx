'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import MiniNavBar from './MiniNavBar';
import DebugPanel from './DebugPanel';
import type { NavEntryInfo, NavEventLogEntry } from './DebugPanel';
import {
  AboutView,
  ArticleDetailView,
  ArticleListView,
  HomeView,
  ReferencesView,
} from './views';

/* ── Type declarations for Navigation API ─────────────── */

interface NavigationDestination {
  url: string;
}

interface NavigateEvent extends Event {
  navigationType: string;
  destination: NavigationDestination;
  canIntercept: boolean;
  hashChange: boolean;
  downloadRequest: string | null;
  intercept: (options: { handler: () => Promise<void> }) => void;
}

interface NavigationHistoryEntry {
  key: string;
  url: string | null;
  index: number;
  getState: () => unknown;
}

interface NavigationCurrentEntryChangeEvent extends Event {
  navigationType: string | null;
  from: NavigationHistoryEntry;
}

interface Navigation extends EventTarget {
  currentEntry: NavigationHistoryEntry;
  entries: () => NavigationHistoryEntry[];
  canGoBack: boolean;
  canGoForward: boolean;
  navigate: (
    url: string,
    options?: { state?: Record<string, unknown>; history?: 'auto' | 'push' | 'replace' }
  ) => { committed: Promise<NavigationHistoryEntry>; finished: Promise<NavigationHistoryEntry> };
  reload: () => { committed: Promise<NavigationHistoryEntry>; finished: Promise<NavigationHistoryEntry> };
  back: () => { committed: Promise<NavigationHistoryEntry>; finished: Promise<NavigationHistoryEntry> };
  forward: () => { committed: Promise<NavigationHistoryEntry>; finished: Promise<NavigationHistoryEntry> };
  traverseTo: (
    key: string
  ) => { committed: Promise<NavigationHistoryEntry>; finished: Promise<NavigationHistoryEntry> };
  addEventListener(type: 'navigate', listener: (event: NavigateEvent) => void, options?: AddEventListenerOptions): void;
  addEventListener(type: 'currententrychange', listener: (event: NavigationCurrentEntryChangeEvent) => void, options?: AddEventListenerOptions): void;
  removeEventListener(type: 'navigate', listener: (event: NavigateEvent) => void, options?: AddEventListenerOptions): void;
  removeEventListener(type: 'currententrychange', listener: (event: NavigationCurrentEntryChangeEvent) => void, options?: AddEventListenerOptions): void;
}

/* Navigation API is accessible via window.navigation (Chrome 102+, Firefox 147+, Safari 26.2+) */

function getNavigation(): Navigation | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).navigation as Navigation | undefined;
}

/* ── Route parsing ────────────────────────────────────── */

type Route =
  | { view: 'home' }
  | { view: 'articles' }
  | { view: 'article'; id: number }
  | { view: 'about' }
  | { view: 'references' };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/home';

  if (path === '/articles') {
    return { view: 'articles' };
  }
  if (path === '/about') {
    return { view: 'about' };
  }
  if (path === '/references') {
    return { view: 'references' };
  }

  const articleMatch = path.match(/^\/article\/(\d+)$/);
  if (articleMatch) {
    return { view: 'article', id: parseInt(articleMatch[1], 10) };
  }

  return { view: 'home' };
}

/* ── Component ────────────────────────────────────────── */

let eventIdCounter = 0;

export default function NavigationDemo() {
  const t = useTranslations('navigation-api');
  const [currentHash, setCurrentHash] = useState('');
  const [route, setRoute] = useState<Route>({ view: 'home' });
  const [entries, setEntries] = useState<NavEntryInfo[]>([]);
  const [currentState, setCurrentState] = useState<unknown>(null);
  const [eventLog, setEventLog] = useState<NavEventLogEntry[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const initialHashSet = useRef(false);

  /* ── Sync navigation state to React ──────────────────── */

  const syncState = useCallback(() => {
    const nav = getNavigation();
    if (!nav) {
      return;
    }

    const navEntries = nav.entries();
    const currentKey = nav.currentEntry?.key;

    setEntries(
      navEntries.map((e) => ({
        key: e.key,
        url: e.url ?? '',
        index: e.index,
        isCurrent: e.key === currentKey,
        state: e.getState?.() ?? null,
      }))
    );

    setCurrentState(nav.currentEntry?.getState?.() ?? null);
    setCanGoBack(nav.canGoBack);
    setCanGoForward(nav.canGoForward);
  }, []);

  /* ── Navigate helper ─────────────────────────────────── */

  const handleNavigate = useCallback(
    (hash: string, state?: Record<string, unknown>) => {
      const nav = getNavigation();
      if (!nav) {
        // Fallback: just set hash
        window.location.hash = hash;
        return;
      }

      const url = `${window.location.pathname}${window.location.search}${hash}`;
      nav.navigate(url, state ? { state } : undefined);
    },
    []
  );

  const handleBack = useCallback(() => {
    getNavigation()?.back();
  }, []);

  const handleForward = useCallback(() => {
    getNavigation()?.forward();
  }, []);

  const handleReload = useCallback(() => {
    getNavigation()?.reload();
  }, []);

  const handleTraverseTo = useCallback((key: string) => {
    getNavigation()?.traverseTo(key);
  }, []);

  const handleClearLog = useCallback(() => {
    setEventLog([]);
  }, []);

  /* ── Setup Navigation API listener ──────────────────── */

  useEffect(() => {
    const nav = getNavigation();

    if (!nav) {
      return;
    }

    // Set initial hash if none — use replace so #/home doesn't create an extra entry
    if (!window.location.hash && !initialHashSet.current) {
      initialHashSet.current = true;
    } else {
      // Parse existing hash
      const hash = window.location.hash;
      setCurrentHash(hash);
      setRoute(parseHash(hash));
    }

    syncState();

    const handleNavigateEvent = (event: NavigateEvent) => {
      // Don't intercept cross-origin or download navigations
      if (!event.canIntercept || event.downloadRequest !== null) {
        return;
      }

      const destUrl = event.destination.url;
      const destHash = new URL(destUrl).hash;

      // Only intercept hash navigations (our mini-SPA routes)
      // Let non-hash navigations pass through to Next.js router
      if (!destHash || !destHash.startsWith('#/')) {
        return;
      }

      // Log the event
      const logEntry: NavEventLogEntry = {
        id: ++eventIdCounter,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        navigationType: event.navigationType,
        destinationUrl: destUrl,
        hashChange: event.hashChange,
        canIntercept: event.canIntercept,
      };
      setEventLog((prev) => [...prev, logEntry]);

      // Intercept and render the appropriate view
      event.intercept({
        handler: async () => {
          const newRoute = parseHash(destHash);
          setRoute(newRoute);
          setCurrentHash(destHash);

          // Small delay to simulate async content loading
          await new Promise((r) => setTimeout(r, 50));

          // Sync state after navigation completes
          syncState();
        },
      });
    };

    nav.addEventListener('navigate', handleNavigateEvent);

    // Also listen for currententrychange to catch traversals
    const handleEntryChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      setRoute(parseHash(hash));
      syncState();
    };

    nav.addEventListener('currententrychange', handleEntryChange);

    // Navigate to #/home AFTER listeners are registered so the event gets logged.
    // Use setTimeout to ensure any in-progress Next.js client-side navigation
    // has settled before we trigger our own navigate call.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (initialHashSet.current && !window.location.hash) {
      timeoutId = setTimeout(() => {
        const url = `${window.location.pathname}${window.location.search}#/home`;
        nav.navigate(url, { history: 'replace' });
      }, 0);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      nav.removeEventListener('navigate', handleNavigateEvent);
      nav.removeEventListener('currententrychange', handleEntryChange);
    };
  }, [syncState]);

  /* ── Render current view ─────────────────────────────── */

  const viewProps = { t, tRaw: (key: string) => t.raw(key) as string, onNavigate: handleNavigate };

  let currentView: React.ReactNode;
  switch (route.view) {
    case 'articles':
      currentView = <ArticleListView {...viewProps} />;
      break;
    case 'article':
      currentView = <ArticleDetailView {...viewProps} articleId={route.id} />;
      break;
    case 'about':
      currentView = <AboutView {...viewProps} />;
      break;
    case 'references':
      currentView = <ReferencesView {...viewProps} />;
      break;
    default:
      currentView = <HomeView {...viewProps} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 px-4 sm:px-0">
      {/* Mini SPA area */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30 p-4 sm:p-6 min-h-[400px]">
        <MiniNavBar
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          currentHash={currentHash}
          onBack={handleBack}
          onForward={handleForward}
          onNavigate={(hash) => handleNavigate(hash)}
          onReload={handleReload}
          t={t}
        />
        <div className="mt-2">{currentView}</div>

        {/* State demo hint */}
        {route.view === 'article' && (
          <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-700 dark:text-amber-300">
            🔍 {t('stateDemo')}
          </div>
        )}
      </div>

      {/* Debug Panel */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <DebugPanel
          currentState={currentState}
          entries={entries}
          eventLog={eventLog}
          onClearLog={handleClearLog}
          onTraverseTo={handleTraverseTo}
          t={t}
        />
      </div>
    </div>
  );
}
