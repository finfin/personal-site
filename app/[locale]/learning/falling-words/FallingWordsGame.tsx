'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import styles from './falling-words.module.css'
import { DEFAULTS } from '@/lib/learning-words'

// ── Types ──────────────────────────────────────────────────────────────────
type WordEntry = { en: string; zh: string }
type GamePhase = 'idle' | 'playing' | 'paused' | 'gameOver'

interface Tile {
  id: number
  en: string
  zh: string
  x: number         // left% within game area
  y: number         // translateY px from spawn point (starts at -80)
  colorIdx: number  // 0–4, cycles through BUBBLE_COLORS
  revealed: boolean[]  // per-letter: true = visible (pre-filled or user-typed)
  prefilled: boolean[] // per-letter: true = was pre-filled at spawn
  givenCount: number   // how many were pre-filled at spawn
}

interface SparkleParticle {
  id: number
  x: number  // px from game area left
  y: number  // px from game area top
  angle: number
  dist: number
}

// ── Design system: 5 bubble color variants ─────────────────────────────────
const BUBBLE_COLORS = [
  { fill: '#EDE9FE', border: '#7C3AED', text: '#4C1D95' }, // Grape
  { fill: '#FFE4E6', border: '#FB7185', text: '#881337' }, // Coral
  { fill: '#FEF3C7', border: '#F59E0B', text: '#78350F' }, // Sunny
  { fill: '#D1FAE5', border: '#34D399', text: '#064E3B' }, // Mint
  { fill: '#DBEAFE', border: '#60A5FA', text: '#1E3A8A' }, // Sky
] as const

// ── Difficulty table ───────────────────────────────────────────────────────
//  level │ revealRatio │ maxTiles │ speed(px/s) │ spawnMs
const LEVELS = [
  { reveal: 0.60, maxTiles: 1, speed: 16, spawnMs: 3000 }, // Lv 1
  { reveal: 0.50, maxTiles: 1, speed: 18, spawnMs: 2800 }, // Lv 2
  { reveal: 0.40, maxTiles: 1, speed: 20, spawnMs: 2600 }, // Lv 3
  { reveal: 0.30, maxTiles: 2, speed: 22, spawnMs: 2400 }, // Lv 4
  { reveal: 0.20, maxTiles: 2, speed: 24, spawnMs: 2200 }, // Lv 5
  { reveal: 0.10, maxTiles: 2, speed: 26, spawnMs: 2000 }, // Lv 6
  { reveal: 0.00, maxTiles: 3, speed: 28, spawnMs: 1800 }, // Lv 7
  { reveal: 0.00, maxTiles: 3, speed: 30, spawnMs: 1600 }, // Lv 8
  { reveal: 0.00, maxTiles: 4, speed: 32, spawnMs: 1400 }, // Lv 9
  { reveal: 0.00, maxTiles: 5, speed: 34, spawnMs: 1200 }, // Lv 10+
] as const

const MAX_LIVES         = 3
const SCORE_PER_CHAR    = 10   // wordLength × SCORE_PER_CHAR
const TILE_WIDTH_APPROX = 140  // px, used for x-clamp
const WORDS_PER_LEVEL   = 10   // captures to advance one level

// ── Storage ────────────────────────────────────────────────────────────────
const K_BANK = 'fw-bank'
const K_HIGH = 'fw-high'

function sGet<T>(k: string): T | null {
  if (typeof window === 'undefined') { return null }
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : null } catch { return null }
}
function sSet(k: string, v: unknown) {
  if (typeof window === 'undefined') { return }
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}

// ── Utilities ──────────────────────────────────────────────────────────────
function shuffle<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

function isEligible(en: string): boolean {
  return en.length >= 2 && en.length <= 8 && /^[A-Z]+$/.test(en)
}

function getLevelCfg(level: number) { return LEVELS[Math.min(level - 1, LEVELS.length - 1)] }
function getLevel(captures: number) { return Math.floor(captures / WORDS_PER_LEVEL) + 1 }
function getFallSpeed(level: number) { return getLevelCfg(level).speed }
function getSpawnInterval(level: number) { return getLevelCfg(level).spawnMs }
function getMaxTiles(level: number) { return getLevelCfg(level).maxTiles }

/** Build a revealed[] array with random positions pre-filled based on level */
function buildRevealed(level: number, wordLen: number): boolean[] {
  const ratio = getLevelCfg(level).reveal
  const count = Math.floor(wordLen * ratio)
  const revealed = Array<boolean>(wordLen).fill(false)
  if (count <= 0) { return revealed }
  // Pick random indices to pre-fill
  const indices = Array.from({ length: wordLen }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  for (let i = 0; i < count; i++) { revealed[indices[i]] = true }
  return revealed
}

/** First unrevealed index, or -1 if all revealed */
function nextUnrevealed(tile: Tile): number {
  return tile.revealed.indexOf(false)
}

/** Whether user has typed anything on this tile (beyond pre-fill) */
function isFresh(tile: Tile): boolean {
  return tile.revealed.filter(Boolean).length === tile.givenCount
}

function loadWordBank(): WordEntry[] {
  const saved = sGet<[string, string][]>(K_BANK)
  const raw = saved ?? DEFAULTS
  return raw.filter(([en]) => isEligible(en)).map(([en, zh]) => ({ en, zh }))
}

// ── Component ──────────────────────────────────────────────────────────────
export default function FallingWordsGame() {
  const t = useTranslations('fallingWords')

  // ── React UI state ─────────────────────────────────────────────────────
  const [phase, setPhase]         = useState<GamePhase>('idle')
  const [tiles, setTiles]         = useState<Tile[]>([])
  const [score, setScore]         = useState(0)
  const [lives, setLives]         = useState(MAX_LIVES)
  const [captures, setCaptures]   = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [sparkles, setSparkles]   = useState<SparkleParticle[]>([])
  const [levelUp, setLevelUp]     = useState(false)
  const [hit, setHit]             = useState(false)

  // ── Mutable game state (single ref object, avoids stale closures) ──────
  const G = useRef({
    phase:     'idle' as GamePhase,
    tiles:     [] as Tile[],
    score:     0,
    lives:     MAX_LIVES,
    captures:  0,
    lockedId:  null as number | null,
    nextId:    0,
    wordBank:  [] as WordEntry[],
    prevLevel: 1,
    lastTs:    0,
    lastSpawn: 0,
    rafId:     null as number | null,
    sparkleId: 0,
  })

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const tileRefs    = useRef(new Map<number, HTMLDivElement>())
  const inputRef    = useRef<HTMLInputElement>(null)

  // Load high score once
  useEffect(() => {
    const saved = sGet<number>(K_HIGH)
    if (saved != null) { setHighScore(saved) }
  }, [])

  // ── syncTiles: push G.tiles into React state for re-render ─────────────
  const syncTiles = useCallback(() => {
    setTiles([...G.current.tiles])
  }, [])

  // ── Spawn a new tile ────────────────────────────────────────────────────
  const spawnTile = useCallback(() => {
    const g = G.current
    const active = new Set(g.tiles.map(t => t.en))
    const available = g.wordBank.filter(w => !active.has(w.en))
    if (!available.length) { return }

    const word = available[Math.floor(Math.random() * available.length)]
    const areaWidth = gameAreaRef.current?.clientWidth ?? 320
    const tileFrac = (TILE_WIDTH_APPROX / areaWidth) * 100
    const margin = 5
    const maxX = Math.max(margin, 92 - tileFrac)

    // Collect x% of tiles still near the top (y < 120px) to avoid overlap
    const nearTop = g.tiles.filter(t => t.y < 120).map(t => t.x)
    const minGap = tileFrac + 2 // minimum gap in % between tile centres

    // Try up to 12 random positions, pick the one with the largest clearance
    let bestX = margin + Math.random() * (maxX - margin)
    let bestDist = 0
    for (let attempt = 0; attempt < 12; attempt++) {
      const candidate = margin + Math.random() * (maxX - margin)
      const closest = nearTop.reduce((d, ox) => Math.min(d, Math.abs(candidate - ox)), Infinity)
      if (closest > bestDist) {
        bestDist = closest
        bestX = candidate
        if (closest >= minGap) { break } // good enough
      }
    }

    const level = getLevel(g.captures)
    const revealed = buildRevealed(level, word.en.length)
    const givenCount = revealed.filter(Boolean).length
    const colorIdx = g.nextId % BUBBLE_COLORS.length

    const tile: Tile = {
      id: g.nextId++,
      en: word.en,
      zh: word.zh,
      x: bestX,
      y: -80,
      colorIdx,
      revealed: [...revealed],
      prefilled: [...revealed],
      givenCount,
    }
    g.tiles = [...g.tiles, tile]

    // Auto-lock to this tile if nothing is locked
    if (g.lockedId == null) { g.lockedId = tile.id }

    syncTiles()
  }, [syncTiles])

  // ── Shake a specific tile on error ──────────────────────────────────────
  const shakeTile = useCallback((tileId: number) => {
    const el = tileRefs.current.get(tileId)
    if (!el) { return }
    el.classList.remove(styles.bubbleShake)
    void el.offsetWidth
    el.classList.add(styles.bubbleShake)
    setTimeout(() => { el.classList.remove(styles.bubbleShake) }, 300)
  }, [])

  // ── Capture a tile (correct word completed) ─────────────────────────────
  const captureTile = useCallback((tileId: number) => {
    const g = G.current
    const tile = g.tiles.find(t => t.id === tileId)
    if (!tile) { return }

    // Spawn sparkles at tile's DOM position
    const el = tileRefs.current.get(tileId)
    if (el && gameAreaRef.current) {
      const tr = el.getBoundingClientRect()
      const gr = gameAreaRef.current.getBoundingClientRect()
      const cx = tr.left - gr.left + tr.width / 2
      const cy = tr.top - gr.top + tr.height / 2
      const newSparkles: SparkleParticle[] = Array.from({ length: 6 }, (_, i) => ({
        id: g.sparkleId++,
        x: cx,
        y: cy,
        angle: i * 60 + Math.random() * 20,
        dist:  20 + Math.random() * 28,
      }))
      setSparkles(prev => [...prev, ...newSparkles])
      setTimeout(() => {
        const ids = new Set(newSparkles.map(s => s.id))
        setSparkles(prev => prev.filter(s => !ids.has(s.id)))
      }, 650)
    }

    // Score
    const gained = tile.en.length * SCORE_PER_CHAR
    g.score += gained
    setScore(g.score)

    // High score
    const prevHigh = sGet<number>(K_HIGH) ?? 0
    if (g.score > prevHigh) {
      sSet(K_HIGH, g.score)
      setHighScore(g.score)
    }

    // Captures + level up
    g.captures++
    setCaptures(g.captures)

    const newLevel = getLevel(g.captures)
    if (newLevel > g.prevLevel) {
      g.prevLevel = newLevel
      setLevelUp(true)
      setTimeout(() => setLevelUp(false), 1200)
    }

    // Unlock and remove
    if (g.lockedId === tileId) { g.lockedId = null }
    g.tiles = g.tiles.filter(t => t.id !== tileId)
    tileRefs.current.delete(tileId)

    // Auto-lock to the lowest remaining tile
    if (g.lockedId == null && g.tiles.length > 0) {
      const lowest = g.tiles.reduce((a, b) => (b.y > a.y ? b : a))
      g.lockedId = lowest.id
    }

    syncTiles()
  }, [syncTiles])

  // ── Lose a life (tile hit bottom) ───────────────────────────────────────
  const loseLife = useCallback((tileId: number) => {
    const g = G.current
    if (g.lockedId === tileId) { g.lockedId = null }
    g.tiles = g.tiles.filter(t => t.id !== tileId)
    tileRefs.current.delete(tileId)

    // Auto-lock to the lowest remaining tile
    if (g.lockedId == null && g.tiles.length > 0) {
      const lowest = g.tiles.reduce((a, b) => (b.y > a.y ? b : a))
      g.lockedId = lowest.id
    }
    g.lives--
    setLives(g.lives)
    syncTiles()

    // Flash the game area red
    setHit(true)
    setTimeout(() => { setHit(false) }, 400)

    if (g.lives <= 0) {
      g.phase = 'gameOver'
      setPhase('gameOver')
      if (g.rafId != null) { cancelAnimationFrame(g.rafId); g.rafId = null }
    }
  }, [syncTiles])

  // ── Process a typed letter ──────────────────────────────────────────────
  const processLetter = useCallback((letter: string) => {
    const g = G.current
    if (g.phase !== 'playing') { return }

    // If locked, compare against next unrevealed letter of locked tile
    if (g.lockedId != null) {
      const tile = g.tiles.find(t => t.id === g.lockedId)
      if (tile) {
        const pos = nextUnrevealed(tile)
        if (pos === -1) {
          captureTile(tile.id)
          return
        }
        if (letter === tile.en[pos]) {
          tile.revealed[pos] = true
          if (nextUnrevealed(tile) === -1) {
            captureTile(tile.id)
          } else {
            syncTiles()
          }
        } else {
          shakeTile(tile.id)
        }
        return
      }
      g.lockedId = null
    }

    // Find the lowest fresh tile whose first unrevealed letter matches
    const target = g.tiles
      .filter(t => isFresh(t))
      .filter(t => {
        const pos = nextUnrevealed(t)
        return pos !== -1 && t.en[pos] === letter
      })
      .sort((a, b) => b.y - a.y)[0]

    if (target) {
      g.lockedId = target.id
      const pos = nextUnrevealed(target)
      if (pos !== -1) { target.revealed[pos] = true }
      if (nextUnrevealed(target) === -1) {
        captureTile(target.id)
      } else {
        syncTiles()
      }
    }
  }, [captureTile, syncTiles, shakeTile])

  // ── Game loop ───────────────────────────────────────────────────────────
  const gameLoop = useCallback((ts: number) => {
    const g = G.current
    if (g.phase !== 'playing') { return }

    const dt = g.lastTs ? Math.min((ts - g.lastTs) / 1000, 0.1) : 0
    g.lastTs = ts

    const level      = getLevel(g.captures)
    const speed      = getFallSpeed(level)
    const areaHeight = gameAreaRef.current?.clientHeight ?? 560
    const toRemove: number[] = []

    // Move tiles + detect bottom collision
    for (const tile of g.tiles) {
      tile.y += speed * dt
      const el = tileRefs.current.get(tile.id)
      if (el) { el.style.transform = `translateY(${tile.y}px)` }
      const tileH = el?.offsetHeight ?? 80
      if (tile.y + tileH >= areaHeight) { toRemove.push(tile.id) }
    }

    // Process tiles that hit the ground
    for (const id of toRemove) {
      if (g.phase !== 'playing') { break }
      loseLife(id)
    }

    // Spawn
    if (g.phase === 'playing') {
      const maxTiles      = getMaxTiles(level)
      const spawnInterval = getSpawnInterval(level)
      if (g.tiles.length < maxTiles && ts - g.lastSpawn > spawnInterval) {
        g.lastSpawn = ts
        spawnTile()
      }
    }

    if (g.phase === 'playing') {
      g.rafId = requestAnimationFrame(gameLoop)
    }
  }, [loseLife, spawnTile])

  // ── Start / restart ─────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const g = G.current
    if (g.rafId != null) { cancelAnimationFrame(g.rafId); g.rafId = null }

    g.tiles     = []
    tileRefs.current.clear()
    g.score     = 0
    g.lives     = MAX_LIVES
    g.captures  = 0
    g.lockedId  = null
    g.nextId    = 0
    g.prevLevel = 1
    g.lastTs    = 0
    g.lastSpawn = 0
    g.wordBank  = shuffle(loadWordBank())

    setTiles([])
    setScore(0)
    setLives(MAX_LIVES)
    setCaptures(0)
    setSparkles([])
    setLevelUp(false)

    g.phase = 'playing'
    setPhase('playing')
    g.rafId = requestAnimationFrame(gameLoop)

    setTimeout(() => inputRef.current?.focus(), 50)
  }, [gameLoop])

  // ── Pause / resume ──────────────────────────────────────────────────────
  const pauseGame = useCallback(() => {
    const g = G.current
    if (g.phase !== 'playing') { return }
    if (g.rafId != null) { cancelAnimationFrame(g.rafId); g.rafId = null }
    g.phase = 'paused'
    setPhase('paused')
  }, [])

  const resumeGame = useCallback(() => {
    const g = G.current
    if (g.phase !== 'paused') { return }
    g.lastTs = 0
    g.phase = 'playing'
    setPhase('playing')
    g.rafId = requestAnimationFrame(gameLoop)
    inputRef.current?.focus()
  }, [gameLoop])

  // ── visibilitychange: auto-pause ────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) { pauseGame() } else { resumeGame() }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [pauseGame, resumeGame])

  // ── Keyboard input (desktop path) ───────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) { return }
      if (!/^[a-zA-Z]$/.test(e.key)) { return }
      e.preventDefault()
      const letter = e.key.toUpperCase()
      if (G.current.phase === 'idle') {
        startGame()
        setTimeout(() => processLetter(letter), 30)
      } else {
        processLetter(letter)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [startGame, processLetter])

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => { if (G.current.rafId != null) { cancelAnimationFrame(G.current.rafId) } }, [])

  // ── Derived display values ───────────────────────────────────────────────
  const level = getLevel(captures)

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      {/* Screen reader live region */}
      <div aria-atomic="false" aria-live="polite" className="sr-only" id="fw-live" />

      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.subtitle}>{t('subtitle')}</p>

      {/* HUD */}
      <div aria-label="Game stats" className={styles.hud} role="status">
        <div aria-label={`${t('lives')}: ${lives}`} className={styles.hudLives}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span
              aria-hidden="true"
              className={`${styles.heart} ${i >= lives ? styles.heartLost : ''}`}
              key={i}
            >
              ♥
            </span>
          ))}
        </div>
        <div className={styles.hudLevel}>
          <span className={styles.hudLabel}>{t('level')}</span>
          <span className={styles.hudValue}>{level}</span>
        </div>
        <div className={styles.hudScore}>
          <span className={styles.hudLabel}>{t('score')}</span>
          <span className={styles.hudValue}>{score}</span>
        </div>
        <div className={styles.hudBest}>
          <span className={styles.hudLabel}>{t('best')}</span>
          <span className={styles.hudValue}>{highScore}</span>
        </div>
      </div>

      {/* Game Area */}
      <div
        aria-label="Game area"
        className={`${styles.gameArea} ${hit ? styles.hitFlash : ''}`}
        onClick={() => {
          if (phase === 'idle') { startGame() }
          else if (phase === 'paused') { resumeGame() }
          else { inputRef.current?.focus() }
        }}
        ref={gameAreaRef}
        role="region"
      >
        {/* Falling tiles */}
        {tiles.map(tile => {
          const c = BUBBLE_COLORS[tile.colorIdx]
          const isLocked = G.current.lockedId === tile.id
          return (
            <div
              aria-hidden="true"
              className={`${styles.bubble} ${isLocked ? styles.bubbleActive : styles.bubbleClickable}`}
              key={tile.id}
              onClick={e => {
                e.stopPropagation()
                if (G.current.phase === 'playing') {
                  G.current.lockedId = tile.id
                  syncTiles()
                  inputRef.current?.focus()
                }
              }}
              ref={el => {
                if (el) { tileRefs.current.set(tile.id, el) }
                else { tileRefs.current.delete(tile.id) }
              }}
              style={{
                left: `${tile.x}%`,
                '--bubble-fill':   c.fill,
                '--bubble-border': c.border,
                '--bubble-text':   c.text,
                '--clay-edge':     c.border,
              } as React.CSSProperties}
            >
              <span className={styles.bubbleEn}>
                {tile.en.split('').map((ch, i) => {
                  const shown = tile.revealed[i]
                  const isCursor = isLocked && !shown && i === nextUnrevealed(tile)
                  const cls = isCursor
                    ? styles.letterCursor
                    : !shown
                      ? styles.letterHidden
                      : tile.prefilled[i]
                        ? styles.letterGiven
                        : styles.letterTyped
                  return (
                    <span className={cls} key={i}>
                      {shown ? ch : '_'}
                    </span>
                  )
                })}
              </span>
              <span className={styles.bubbleZh}>{tile.zh}</span>
            </div>
          )
        })}

        {/* Pop sparkles */}
        {sparkles.map(s => (
          <span
            aria-hidden="true"
            className={styles.sparkle}
            key={s.id}
            style={{
              left: s.x,
              top: s.y,
              '--tx': `${Math.cos(s.angle * Math.PI / 180) * s.dist}px`,
              '--ty': `${Math.sin(s.angle * Math.PI / 180) * s.dist}px`,
              background: BUBBLE_COLORS[s.id % BUBBLE_COLORS.length].border,
            } as React.CSSProperties}
          />
        ))}

        {/* Level-up banner */}
        {levelUp && (
          <div aria-live="polite" className={styles.levelBanner} role="status">
            {t('levelUp')} Lv.{level}
          </div>
        )}

        {/* Idle overlay */}
        {phase === 'idle' && (
          <div aria-label={t('start')} className={styles.overlay} role="dialog">
            <Play aria-hidden="true" className={styles.overlayIcon} />
            <span className={styles.overlayTitle}>{t('title')}</span>
            <span className={styles.overlayHint}>{t('startHint')}</span>
            <button
              className={styles.btnPrimary}
              onClick={e => { e.stopPropagation(); startGame() }}
            >
              {t('start')}
            </button>
          </div>
        )}

        {/* Paused overlay */}
        {phase === 'paused' && (
          <div aria-label={t('paused')} className={styles.overlay} role="dialog">
            <Pause aria-hidden="true" className={styles.overlayIcon} />
            <span className={styles.overlayTitle}>{t('paused')}</span>
            <button
              className={styles.btnPrimary}
              onClick={e => { e.stopPropagation(); resumeGame() }}
            >
              {t('resume')}
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {phase === 'gameOver' && (
          <div aria-label={t('gameOver')} className={styles.overlay} role="dialog">
            <RotateCcw aria-hidden="true" className={styles.overlayIcon} />
            <span className={styles.overlayTitle}>{t('gameOver')}</span>
            <div className={styles.overlayScore}>
              <span className={styles.overlayScoreVal}>{score}</span>
            </div>
            <button
              className={styles.btnPrimary}
              onClick={e => { e.stopPropagation(); startGame() }}
            >
              {t('restart')}
            </button>
          </div>
        )}

        {/* Mobile keyboard trigger (hidden input) */}
        <input
          aria-hidden="true"
          className={styles.hiddenInput}
          inputMode="text"
          onChange={e => {
            const ch = e.target.value.slice(-1).toUpperCase()
            if (/^[A-Z]$/.test(ch)) { processLetter(ch) }
            e.target.value = ''
          }}
          readOnly={phase !== 'playing'}
          ref={inputRef}
          tabIndex={-1}
          type="text"
          value=""
        />
      </div>

      {/* Secondary controls */}
      {phase === 'playing' && (
        <div className={styles.controls}>
          <button className={styles.btnSecondary} onClick={pauseGame}>
            <Pause aria-hidden="true" className="w-4 h-4" />
            {t('pause')}
          </button>
        </div>
      )}
    </div>
  )
}
