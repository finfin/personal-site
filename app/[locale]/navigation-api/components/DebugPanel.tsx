import { useEffect, useRef } from 'react';

export interface NavEventLogEntry {
  id: number;
  timestamp: string;
  navigationType: string;
  destinationUrl: string;
  hashChange: boolean;
  canIntercept: boolean;
}

export interface NavEntryInfo {
  key: string;
  url: string;
  index: number;
  isCurrent: boolean;
  state: unknown;
}

interface DebugPanelProps {
  t: (key: string) => string;
  entries: NavEntryInfo[];
  currentState: unknown;
  eventLog: NavEventLogEntry[];
  onClearLog: () => void;
  onTraverseTo: (key: string) => void;
}

export default function DebugPanel({
  t,
  entries,
  currentState,
  eventLog,
  onClearLog,
  onTraverseTo,
}: DebugPanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [eventLog.length]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold">{t('debugPanel')}</h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Entries */}
        <details className="group" open>
          <summary className="cursor-pointer px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 select-none">
            {t('entries')} ({entries.length})
          </summary>
          <div className="px-3 pb-3 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {entries.map((entry) => (
                <div
                  className={`flex items-center gap-2 text-xs rounded px-2 py-1.5 font-mono ${
                    entry.isCurrent
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                      : 'bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                  }`}
                  key={entry.key}
                >
                  <span className="text-gray-400 dark:text-gray-600 w-4 text-right shrink-0">
                    {entry.index}
                  </span>
                  <span className="truncate flex-1" title={entry.url}>
                    {extractHash(entry.url)}
                  </span>
                  {entry.isCurrent ? (
                    <span className="text-[10px] bg-blue-200 dark:bg-blue-800 rounded px-1 shrink-0">
                      {t('current')}
                    </span>
                  ) : (
                    <button
                      className="text-[10px] bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-1.5 py-0.5 shrink-0 transition-colors"
                      onClick={() => onTraverseTo(entry.key)}
                      type="button"
                    >
                      {t('goTo')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Current State */}
        <details className="group" open>
          <summary className="cursor-pointer px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 select-none">
            {t('currentState')}
          </summary>
          <div className="px-4 pb-3">
            <pre className="text-xs font-mono bg-white dark:bg-gray-800/50 rounded p-2 overflow-x-auto whitespace-pre-wrap text-gray-600 dark:text-gray-400">
              {currentState
                ? JSON.stringify(currentState, null, 2)
                : t('noState')}
            </pre>
          </div>
        </details>

        {/* Event Log */}
        <details className="group" open>
          <summary className="cursor-pointer px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 select-none flex items-center justify-between">
            <span>{t('eventLog')} ({eventLog.length})</span>
            {eventLog.length > 0 && (
              <button
                className="text-[10px] bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-1.5 py-0.5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearLog();
                }}
                type="button"
              >
                {t('clearLog')}
              </button>
            )}
          </summary>
          <div className="px-3 pb-3 max-h-64 overflow-y-auto">
            {eventLog.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic px-1">
                {t('noEvents')}
              </p>
            ) : (
              <div className="space-y-1.5">
                {eventLog.map((entry) => (
                  <div
                    className="text-xs font-mono bg-white dark:bg-gray-800/50 rounded p-2 space-y-0.5"
                    key={entry.id}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 dark:text-gray-600">
                        {entry.timestamp}
                      </span>
                      <span
                        className={`px-1.5 rounded text-[10px] font-semibold cursor-help ${
                          navTypeColor(entry.navigationType)
                        }`}
                        title={navTypeTooltip(entry.navigationType)}
                      >
                        {entry.navigationType}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 truncate" title={entry.destinationUrl}>
                      → {extractHash(entry.destinationUrl)}
                    </div>
                    <div className="flex gap-3 text-gray-400 dark:text-gray-500">
                      <span>hash: {String(entry.hashChange)}</span>
                      <span>intercept: {String(entry.canIntercept)}</span>
                    </div>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

function extractHash(url: string): string {
  try {
    const u = new URL(url);
    return u.hash || '(none)';
  } catch {
    const idx = url.indexOf('#');
    return idx >= 0 ? url.slice(idx) : url;
  }
}

function navTypeColor(type: string): string {
  switch (type) {
    case 'push':
      return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300';
    case 'replace':
      return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
    case 'traverse':
      return 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300';
    case 'reload':
      return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
  }
}

function navTypeTooltip(type: string): string {
  switch (type) {
    case 'push':
      return 'navigationType: "push" — triggered by navigation.navigate()';
    case 'replace':
      return 'navigationType: "replace" — triggered by navigation.navigate(url, { history: "replace" })';
    case 'traverse':
      return 'navigationType: "traverse" — triggered by back() / forward() / traverseTo()';
    case 'reload':
      return 'navigationType: "reload" — triggered by navigation.reload()';
    default:
      return `navigationType: "${type}"`;
  }
}
