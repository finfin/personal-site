/* eslint-disable no-console */
'use client'

import { useEffect, useState } from 'react'
import Editor from 'react-simple-code-editor'
import { Highlight, themes } from 'prism-react-renderer'
import { Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    // Native Temporal (Chrome 144+, Firefox 139+, Edge 144+)
    Temporal: unknown
    // UMD polyfill exposes the module namespace as lowercase `temporal`
    temporal?: { Temporal: unknown }
  }
}

const POLYFILL_URL =
  'https://cdn.jsdelivr.net/npm/@js-temporal/polyfill@0.4.4/dist/index.umd.min.js'

// Singleton — only inject the script once per page load
let _polyfillPromise: Promise<void> | null = null

function ensurePolyfill(): Promise<void> {
  if (_polyfillPromise !== null) {
    return _polyfillPromise
  }
  _polyfillPromise = new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && window.Temporal) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = POLYFILL_URL
    script.onload = () => {
      // UMD bundle sets window.temporal.Temporal, not window.Temporal
      if (!window.Temporal && window.temporal?.Temporal) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).Temporal = window.temporal.Temporal
      }
      resolve()
    }
    document.head.appendChild(script)
  })
  return _polyfillPromise
}

type OutputLine = { kind: 'log' | 'error'; text: string }

interface JSPlaygroundProps {
  /** Label shown at the top of the widget */
  title?: string
  /** Pre-filled code shown in the editor */
  defaultCode: string
  /** Inject the Temporal polyfill before running */
  useTemporal?: boolean
  className?: string
}

function serialize(a: unknown): string {
  if (a === null) {
    return 'null'
  }
  if (a === undefined) {
    return 'undefined'
  }
  if (typeof a === 'object') {
    try {
      return JSON.stringify(a, null, 2)
    } catch {
      return String(a)
    }
  }
  return String(a)
}

function highlightJS(code: string) {
  return (
    <Highlight code={code} language="javascript" theme={themes.vsDark}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <span key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
              {i < tokens.length - 1 ? '\n' : null}
            </span>
          ))}
        </>
      )}
    </Highlight>
  )
}

const EDITOR_STYLE: React.CSSProperties = {
  background: 'transparent',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 14,
  lineHeight: 1.625,
  minHeight: 160,
}

export function JSPlayground({
  className,
  defaultCode,
  title,
  useTemporal = false,
}: JSPlaygroundProps) {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [ready, setReady] = useState(!useTemporal)

  useEffect(() => {
    if (!useTemporal) {
      return
    }
    ensurePolyfill().then(() => setReady(true))
  }, [useTemporal])

  const run = () => {
    const lines: OutputLine[] = []

    const origLog = console.log
    const origWarn = console.warn
    const origError = console.error

    const capture =
      (kind: 'log' | 'error') =>
      (...args: unknown[]) => {
        lines.push({ kind, text: args.map(serialize).join(' ') })
      }

    console.log = capture('log')
    console.warn = capture('log')
    console.error = capture('error')

    try {
      if (useTemporal) {
        // Function constructor is intentional — this is an interactive sandbox
        new Function('Temporal', code)(window.Temporal)
      } else {
        new Function(code)()
      }
    } catch (e: unknown) {
      lines.push({
        kind: 'error',
        text: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
      })
    } finally {
      console.log = origLog
      console.warn = origWarn
      console.error = origError
    }

    setOutput(lines)
  }

  const reset = () => {
    setCode(defaultCode)
    setOutput([])
  }

  const hasOutput = output.length > 0

  return (
    <div
      className={cn(
        'not-prose my-6 overflow-hidden rounded-xl border border-zinc-700',
        className
      )}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-2">
          <span className="text-sm font-medium text-zinc-300">{title}</span>
          <div className="flex items-center gap-2">
            {useTemporal && (
              <span className="rounded-full bg-blue-900/50 px-2 py-0.5 font-mono text-xs text-blue-300">
                Temporal
              </span>
            )}
            <span className="rounded-full bg-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-400">
              JS
            </span>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="bg-zinc-900">
        <Editor
          highlight={highlightJS}
          onValueChange={setCode}
          padding={16}
          spellCheck={false}
          style={EDITOR_STYLE}
          textareaClassName="outline-none"
          value={code}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 border-t border-zinc-700 bg-zinc-900 px-4 py-2">
        <Button disabled={!ready} onClick={run} size="sm">
          <Play className="size-3" />
          {ready ? '執行' : '載入中…'}
        </Button>
        {(hasOutput || code !== defaultCode) && (
          <Button
            className="text-zinc-400 hover:text-zinc-100"
            onClick={reset}
            size="sm"
            variant="ghost"
          >
            <RotateCcw className="size-3" />
            重設
          </Button>
        )}
        {!ready && (
          <span className="text-xs text-zinc-500">正在載入 Temporal polyfill…</span>
        )}
      </div>

      {/* Output */}
      {hasOutput && (
        <div className="border-t border-zinc-700 bg-zinc-950 px-4 py-3">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-zinc-500">
            輸出
          </p>
          <div className="space-y-1 font-mono text-sm">
            {output.map((line, i) => (
              <div className="flex gap-2" key={i}>
                <span className="select-none text-zinc-600">›</span>
                <span
                  className={cn(
                    'whitespace-pre-wrap break-all',
                    line.kind === 'error' ? 'text-red-400' : 'text-emerald-400'
                  )}
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
