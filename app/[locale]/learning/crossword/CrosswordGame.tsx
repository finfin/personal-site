'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './crossword.module.css'

// ── Types ──────────────────────────────────────────────────────────────────
type WordEntry  = { en: string; zh: string }
type PlacedWord = WordEntry & { r: number; c: number; dir: 'A' | 'D'; num: number }
type PuzzleData = { grid: (string | null)[][]; words: PlacedWord[]; rows: number; cols: number }

// ── Storage ────────────────────────────────────────────────────────────────
const K_BANK   = 'cw-bank'
const K_PUZZLE = 'cw-puzzle'
const K_INPUT  = 'cw-input'
const K_ROUND  = 'cw-round'

function sGet<T>(k: string): T | null {
  if (typeof window === 'undefined') {return null}
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : null } catch { return null }
}
function sSet(k: string, v: unknown) {
  if (typeof window === 'undefined') {return}
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}

// ── Defaults ───────────────────────────────────────────────────────────────
const DEFAULTS: [string, string][] = [
  ['APPLE','蘋果'],['BOY','男孩'],['CAT','貓'],['DOG','狗'],['EGG','蛋'],
  ['FOX','狐狸'],['GIRL','女孩'],['HAT','帽子'],['INK','墨汁'],['JAM','果醬'],
  ['KID','小孩'],['LION','獅子'],['MOUSE','老鼠'],['NET','網子'],['OX','公牛'],
  ['PIG','豬'],['QUEEN','皇后'],['ROBOT','機器人'],['SUN','太陽'],['TIGER','老虎'],
  ['UMBRELLA','雨傘'],['VEST','背心'],['WATER','水'],['BOX','箱子'],['YAM','地瓜'],
  ['ZEBRA','斑馬'],['ONE','一'],['TWO','二'],['THREE','三'],['FOUR','四'],
  ['FIVE','五'],['SIX','六'],['SEVEN','七'],['EIGHT','八'],['NINE','九'],
  ['TEN','十'],['ELEVEN','十一'],['TWELVE','十二'],['THIRTEEN','十三'],['FOURTEEN','十四'], ['FIFTEEN', '十五'],
  ['ANGRY','生氣的'],['HAPPY','快樂的'],['SAD','難過的'],
  ['HUNGRY','飢餓的'],['THIRSTY','口渴的'],['BALL','皮球'],['CAR','車'],
  ['DOLL','洋娃娃'],['KITE','風箏'],['BLUE','藍色'],['GREEN','綠色'],
  ['PINK','粉紅色'],['PURPLE','紫色'],['RED','紅色'],['YELLOW','黃色'],
  ['BIRD','鳥'],['FROG','青蛙'],['RABBIT','兔子'],['DANCE','跳舞'],
  ['DRAW','畫圖'],['SING','唱歌'],['SWIM','游泳'],['FATHER','爸爸'],
  ['MOTHER','媽媽'],['BROTHER','兄弟'],['SISTER','姐妹'],['COOK','廚師'],
  ['DOCTOR','醫師'],['NURSE','護理師'],['STUDENT','學生'],['TEACHER','教師'],
  ['CLOUDY','陰天的'],['RAINY','下雨的'],['SUNNY','晴朗的'],['WINDY','颳風的'],
  ['COLD','冷的'],['HOT','熱的'],['WEATHER','天氣'],
  ['BOOK','書'],['ERASER','橡皮擦'],['MARKER','彩色筆'],['PEN','原子筆'],
  ['PENCIL','鉛筆'],['RULER','尺'],['CHAIR','椅子'],['DESK','書桌'],
  ['BEDROOM','臥室'],['KITCHEN','廚房'],['BATHROOM','浴室'],['RUN','跑步'],
  ['READ','閱讀'],['WRITE','寫字'],['SLEEP','睡覺'],['EAT','吃東西'],
]

// ── Pure utilities ─────────────────────────────────────────────────────────
function shuffle<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

function canPlace(g: (string | null)[][], w: string, r: number, c: number, d: string, S: number): boolean {
  for (let i = 0; i < w.length; i++) {
    const cr = d === 'A' ? r : r + i
    const cc = d === 'A' ? c + i : c
    if (cr < 0 || cr >= S || cc < 0 || cc >= S) {return false}
    const e = g[cr][cc]
    if (e && e !== w[i]) {return false}
    if (e === w[i]) {continue}
    if (d === 'A') {
      if ((cr > 0 && g[cr - 1][cc]) || (cr < S - 1 && g[cr + 1][cc])) {return false}
    } else if ((cc > 0 && g[cr][cc - 1]) || (cc < S - 1 && g[cr][cc + 1])) {return false}
  }
  if (d === 'A') {
    if (c > 0 && g[r][c - 1]) {return false}
    if (c + w.length < S && g[r][c + w.length]) {return false}
  } else {
    if (r > 0 && g[r - 1][c]) {return false}
    if (r + w.length < S && g[r + w.length][c]) {return false}
  }
  return true
}

function cntIx(g: (string | null)[][], w: string, r: number, c: number, d: string): number {
  let n = 0
  for (let i = 0; i < w.length; i++) {
    const cr = d === 'A' ? r : r + i
    const cc = d === 'A' ? c + i : c
    if (g[cr][cc] === w[i]) {n++}
  }
  return n
}

function generateCrossword(wl: WordEntry[]): PuzzleData {
  const S = 30
  const g: (string | null)[][] = Array.from({ length: S }, () => Array(S).fill(null))
  const placed: (WordEntry & { r: number; c: number; dir: 'A' | 'D' })[] = []

  const sorted = [...wl].sort((a, b) => b.en.length - a.en.length)
  const f = sorted[0]
  const sr = Math.floor(S / 2)
  const sc = Math.floor((S - f.en.length) / 2)
  for (let i = 0; i < f.en.length; i++) {g[sr][sc + i] = f.en[i]}
  placed.push({ ...f, r: sr, c: sc, dir: 'A' })

  for (let wi = 1; wi < sorted.length; wi++) {
    const w = sorted[wi]
    let best: { r: number; c: number; dir: 'A' | 'D' } | null = null
    let bs = -1
    for (let li = 0; li < w.en.length; li++) {
      for (const p of placed) {
        for (let pi = 0; pi < p.en.length; pi++) {
          if (w.en[li] !== p.en[pi]) {continue}
          const nd: 'A' | 'D' = p.dir === 'A' ? 'D' : 'A'
          const pr = p.dir === 'A' ? p.r : p.r + pi
          const pc = p.dir === 'A' ? p.c + pi : p.c
          const nr = nd === 'A' ? pr : pr - li
          const nc = nd === 'A' ? pc - li : pc
          if (canPlace(g, w.en, nr, nc, nd, S)) {
            const sc2 = cntIx(g, w.en, nr, nc, nd)
            if (sc2 > bs) { bs = sc2; best = { r: nr, c: nc, dir: nd } }
          }
        }
      }
    }
    if (best) {
      for (let i = 0; i < w.en.length; i++) {
        const row = best.dir === 'A' ? best.r : best.r + i
        const col = best.dir === 'A' ? best.c + i : best.c
        g[row][col] = w.en[i]
      }
      placed.push({ ...w, ...best })
    }
  }

  let r0 = S,
r1 = 0,
c0 = S,
c1 = 0
  for (let r = 0; r < S; r++) {for (let c = 0; c < S; c++) {
    if (g[r][c]) { r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c) }
  }}
  const rows = r1 - r0 + 1
  const cols = c1 - c0 + 1
  const tr = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => g[r + r0][c + c0])
  )
  const fw = placed.map(p => ({ en: p.en, zh: p.zh, r: p.r - r0, c: p.c - c0, dir: p.dir }))
  const nm: Record<string, number> = {}
  let nc = 0
  const words: PlacedWord[] = fw
    .sort((a, b) => a.r - b.r || a.c - b.c)
    .map(w => {
      const k = `${w.r},${w.c}`
      if (!nm[k]) {nm[k] = ++nc}
      return { ...w, num: nm[k] }
    })
  return { grid: tr, words, rows, cols }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CrosswordGame() {
  const [bank, _setBankState]   = useState<WordEntry[]>([])
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null)
  const [checkedCells, setCheckedCells] = useState<Record<string, 'ok' | 'no'>>({})
  const [doneWords,    setDoneWords]    = useState<Set<number>>(new Set())
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const [focusedCell,  setFocusedCell]  = useState<string | null>(null)
  const [roundNum,     setRoundNum]     = useState(1)
  const [msg,          setMsg]          = useState('')
  const [bankOpen,     setBankOpen]     = useState(false)
  const [importText,   setImportText]   = useState('')
  // Used to force-remount the board table on new puzzle
  const [puzzleVersion, setPuzzleVersion] = useState(0)
  // Saved input to restore after first render of a new puzzle
  const [pendingRestore, setPendingRestore] = useState<Record<string, string> | null>(null)

  // Refs for mutable values that don't need re-renders
  const inputRefs  = useRef<Record<string, HTMLInputElement | null>>({})
  const curWordRef = useRef<PlacedWord | null>(null)
  const curDirRef  = useRef<'A' | 'D'>('A')
  const bankRef    = useRef<WordEntry[]>([])
  const puzzleRef  = useRef<PuzzleData | null>(null)

  // Sync bank to ref & localStorage
  function setBankState(b: WordEntry[]) {
    _setBankState(b)
    bankRef.current = b
    sSet(K_BANK, b)
  }

  // Restore saved inputs after puzzleData state settles
  useLayoutEffect(() => {
    if (!pendingRestore) {return}
    Object.entries(pendingRestore).forEach(([k, v]) => {
      const el = inputRefs.current[k]
      if (el) {el.value = v}
    })
    setPendingRestore(null)
  }, [pendingRestore])

  // Init on mount
  useEffect(() => {
    let b = sGet<WordEntry[]>(K_BANK)
    if (!b || !b.length) {
      b = DEFAULTS.map(([en, zh]) => ({ en, zh }))
      sSet(K_BANK, b)
    }
    _setBankState(b)
    bankRef.current = b

    const rn = sGet<number>(K_ROUND) ?? 1
    setRoundNum(rn)

    const saved      = sGet<PuzzleData>(K_PUZZLE)
    const savedInput = sGet<Record<string, string>>(K_INPUT)

    if (saved?.words?.length) {
      puzzleRef.current = saved
      setPuzzleData(saved)
      if (savedInput) {setPendingRestore(savedInput)}
    } else {
      doGenerate(b)
    }

  }, [])

  // ── Puzzle generation ────────────────────────────────────────────────────
  function doGenerate(currentBank: WordEntry[]) {
    const eligible = currentBank.filter(w => /^[A-Z]+$/.test(w.en) && w.en.length >= 2 && w.en.length <= 10)
    if (eligible.length < 4) {
      puzzleRef.current = null
      setPuzzleData(null)
      return
    }
    const count = Math.min(Math.max(10, Math.floor(eligible.length * 0.4)), 20, eligible.length)
    let best: PuzzleData | null = null
    for (let t = 0; t < 10; t++) {
      const res = generateCrossword(shuffle(eligible).slice(0, count))
      if (!best || res.words.length > best.words.length) {best = res}
      if (best.words.length >= count * 0.7) {break}
    }
    if (!best) {return}

    // Clear stale refs before new board mounts
    inputRefs.current = {}
    curWordRef.current = null
    curDirRef.current  = 'A'
    puzzleRef.current  = best

    setPuzzleData(best)
    sSet(K_PUZZLE, best)
    sSet(K_INPUT, null)
    setCheckedCells({})
    setDoneWords(new Set())
    setHighlightedKey(null)
    setFocusedCell(null)
    setPuzzleVersion(v => v + 1)
  }

  function nextRound() {
    const newRound = roundNum + 1
    setRoundNum(newRound)
    sSet(K_ROUND, newRound)
    setMsg('')
    doGenerate(bankRef.current)
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function wordsAt(r: number, c: number): PlacedWord[] {
    const pd = puzzleRef.current
    if (!pd) {return []}
    return pd.words.filter(w => {
      for (let i = 0; i < w.en.length; i++) {
        const wr = w.dir === 'A' ? w.r : w.r + i
        const wc = w.dir === 'A' ? w.c + i : w.c
        if (wr === r && wc === c) {return true}
      }
      return false
    })
  }

  function moveInWord(r: number, c: number, delta: number) {
    const w = curWordRef.current
    if (!w) {return}
    const i  = w.dir === 'A' ? c - w.c : r - w.r
    const ni = i + delta
    if (ni >= 0 && ni < w.en.length) {
      const nr = w.dir === 'A' ? w.r : w.r + ni
      const nc = w.dir === 'A' ? w.c + ni : w.c
      inputRefs.current[`${nr},${nc}`]?.focus()
    }
  }

  // After typing a letter, advance to the next empty cell in the word.
  // If all remaining cells are filled, fall back to the immediate next cell.
  function advanceToNextEmpty(r: number, c: number) {
    const w = curWordRef.current
    if (!w) {return}
    const cur = w.dir === 'A' ? c - w.c : r - w.r
    // Search forward from cur+1 for an empty cell
    for (let i = cur + 1; i < w.en.length; i++) {
      const nr = w.dir === 'A' ? w.r : w.r + i
      const nc = w.dir === 'A' ? w.c + i : w.c
      if (!inputRefs.current[`${nr},${nc}`]?.value) {
        inputRefs.current[`${nr},${nc}`]?.focus()
        return
      }
    }
    // All forward cells filled — just move one step (standard behaviour)
    moveInWord(r, c, 1)
  }

  function saveCurrentInput() {
    const d: Record<string, string> = {}
    Object.entries(inputRefs.current).forEach(([k, el]) => {
      if (el?.value) {d[k] = el.value}
    })
    sSet(K_INPUT, d)
  }

  // ── Cell event handlers ──────────────────────────────────────────────────
  function handleFocus(r: number, c: number) {
    const ws = wordsAt(r, c)
    if (!curWordRef.current || !ws.includes(curWordRef.current)) {
      const w = ws.find(w => w.dir === curDirRef.current) ?? ws[0] ?? null
      curWordRef.current = w
      if (w) {curDirRef.current = w.dir}
    }
    setFocusedCell(`${r},${c}`)
    const cw = curWordRef.current
    setHighlightedKey(cw ? `${cw.dir}|${cw.num}` : null)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) {
    // Letter keys are fully handled in onKeyDown; ignore synthetic change events from there
    const v = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase()
    e.target.value = v.slice(-1)
    const key = `${r},${c}`
    setCheckedCells(prev => {
      if (!prev[key]) {return prev}
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (v) {advanceToNextEmpty(r, c)}
    saveCurrentInput()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) {
    const key = `${r},${c}`
    // Handle letter keys directly: overwrite + advance, then suppress onChange
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault()
      const letter = e.key.toUpperCase()
      const el = inputRefs.current[key]
      if (el) {el.value = letter}
      setCheckedCells(prev => {
        if (!prev[key]) {return prev}
        const next = { ...prev }
        delete next[key]
        return next
      })
      advanceToNextEmpty(r, c)
      saveCurrentInput()
      return
    }
    if (e.key === 'Backspace' && !inputRefs.current[key]?.value) {
      e.preventDefault()
      moveInWord(r, c, -1)
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const ws    = wordsAt(r, c)
      const other = ws.find(w => w.dir !== curDirRef.current)
      if (other) {
        curWordRef.current = other
        curDirRef.current  = other.dir
        setHighlightedKey(`${other.dir}|${other.num}`)
      }
    }
    if (['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(e.key)) {
      e.preventDefault()
      const dr = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp'  ? -1 : 0
      const dc = e.key === 'ArrowRight'? 1 : e.key === 'ArrowLeft'? -1 : 0
      inputRefs.current[`${r + dr},${c + dc}`]?.focus()
    }
  }

  // ── Check / Reveal ───────────────────────────────────────────────────────
  function checkAll() {
    const pd = puzzleRef.current
    if (!pd) {return}
    const newChecked: Record<string, 'ok' | 'no'> = {}
    const newDone    = new Set<number>()
    let allOk = true
    pd.words.forEach(w => {
      let wordOk = true
      for (let i = 0; i < w.en.length; i++) {
        const r  = w.dir === 'A' ? w.r : w.r + i
        const c  = w.dir === 'A' ? w.c + i : w.c
        const k  = `${r},${c}`
        const uv = inputRefs.current[k]?.value ?? ''
        if (uv === w.en[i]) {
          newChecked[k] = 'ok'
        } else {
          wordOk = false; allOk = false
          if (uv) {newChecked[k] = 'no'}
        }
      }
      if (wordOk) {newDone.add(w.num)}
    })
    setCheckedCells(newChecked)
    setDoneWords(newDone)
    setMsg(allOk ? '🎉 全部答對！按「下一關」繼續挑戰！' : '綠色＝對的，紅色＝再想想 💪')
  }

  function revealAll() {
    const pd = puzzleRef.current
    if (!pd) {return}
    const newValues: Record<string, string>       = {}
    const newChecked: Record<string, 'ok' | 'no'> = {}
    pd.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const k = `${r},${c}`
          const el = inputRefs.current[k]
          if (el) {el.value = cell}
          newValues[k]  = cell
          newChecked[k] = 'ok'
        }
      })
    })
    setCheckedCells(newChecked)
    setDoneWords(new Set(pd.words.map(w => w.num)))
    setMsg('答案都在這裡，下次靠自己喔 📖')
    sSet(K_INPUT, newValues)
  }

  // ── Word bank ────────────────────────────────────────────────────────────
  function importWords() {
    if (!importText.trim()) {return}
    let count = 0
    const newBank = [...bankRef.current]
    importText.trim().split('\n').forEach(raw => {
      const line = raw.trim()
      if (!line) {return}
      const parts = line.split(/[\s,\t]+/)
      if (parts.length < 2) {return}
      const en = parts[0].toUpperCase().replace(/[^A-Z]/g, '')
      const zh = parts.slice(1).join('')
      if (en.length < 2 || !zh) {return}
      if (!newBank.find(w => w.en === en)) { newBank.push({ en, zh }); count++ }
    })
    if (count > 0) {setBankState(newBank)}
    setImportText('')
    alert(`已匯入 ${count} 個新單字`)
  }

  function removeWord(en: string) {
    setBankState(bankRef.current.filter(w => w.en !== en))
  }

  function resetDefaults() {
    if (!confirm('恢復預設會覆蓋目前所有單字，確定嗎？')) {return}
    setBankState(DEFAULTS.map(([en, zh]) => ({ en, zh })))
  }

  function clearAll() {
    if (!confirm('確定要清除所有單字嗎？')) {return}
    setBankState([])
  }

  // ── Derived rendering values ─────────────────────────────────────────────
  const numMap: Record<string, number> = {}
  puzzleData?.words.forEach(w => { const k = `${w.r},${w.c}`; if (!numMap[k]) {numMap[k] = w.num} })

  const hlCells = new Set<string>()
  if (highlightedKey && puzzleData) {
    const [dir, numStr] = highlightedKey.split('|')
    const num = parseInt(numStr, 10)
    const hw = puzzleData.words.find(w => w.dir === dir && w.num === num)
    if (hw) {
      for (let i = 0; i < hw.en.length; i++) {
        const r = hw.dir === 'A' ? hw.r : hw.r + i
        const c = hw.dir === 'A' ? hw.c + i : hw.c
        hlCells.add(`${r},${c}`)
      }
    }
  }

  function cellClassName(r: number, c: number): string {
    const k   = `${r},${c}`
    const chk = checkedCells[k]
    if (chk === 'ok') {return `${styles.cell} ${styles.cellOk}`}
    if (chk === 'no') {return `${styles.cell} ${styles.cellNo}`}
    if (focusedCell === k) {return `${styles.cell} ${styles.cellFo}`}
    if (hlCells.has(k))   {return `${styles.cell} ${styles.cellHi}`}
    return styles.cell
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>📝 填字遊戲</h1>
        <div className={styles.round}>
          {puzzleData ? `第 ${roundNum} 關 ・ ${puzzleData.words.length} 個單字` : ''}
        </div>
        <button className={styles.gear} onClick={() => setBankOpen(true)} title="管理單字庫">⚙️</button>
      </header>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnCheck}`}  onClick={checkAll}>✔ 檢查</button>
        <button className={`${styles.btn} ${styles.btnNext}`}   onClick={nextRound}>🎲 下一關</button>
        <button className={`${styles.btn} ${styles.btnReveal}`} onClick={revealAll}>看答案</button>
      </div>

      <div className={styles.msg}>{msg}</div>

      {/* Puzzle area */}
      {!puzzleData ? (
        <p className={styles.emptyMsg}>單字庫不足，請先點 ⚙️ 匯入至少 4 個單字</p>
      ) : (
        <div className={styles.puzzleLayout}>
          {/* Clues – left panel */}
          <div className={styles.cluePanel}>
            <div className={styles.clues}>
              {(['A', 'D'] as const).map(dir => (
                <div key={dir}>
                  <h2 className={styles.clueHeading}>{dir === 'A' ? 'Across →' : 'Down ↓'}</h2>
                  <ul className={styles.clueList}>
                    {puzzleData.words
                      .filter(w => w.dir === dir)
                      .sort((a, b) => a.num - b.num)
                      .map(w => {
                        const isDone   = doneWords.has(w.num)
                        const isActive = highlightedKey === `${w.dir}|${w.num}`
                        const liClass  = isDone
                          ? `${styles.clueItem} ${styles.clueItemDone}`
                          : isActive
                            ? `${styles.clueItem} ${styles.clueItemActive}`
                            : styles.clueItem
                        return (
                          <li
                            className={liClass}
                            key={`${w.dir}-${w.num}`}
                            onClick={() => {
                              curWordRef.current = w
                              curDirRef.current  = w.dir
                              setHighlightedKey(`${w.dir}|${w.num}`)
                              inputRefs.current[`${w.r},${w.c}`]?.focus()
                            }}
                          >
                            <span className={styles.clueNum}>{w.num}.</span>
                            {w.zh}（{w.en.length}）
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Grid – right panel */}
          <div className={styles.boardPanel}>
            <div className={styles.board}>
              <table key={puzzleVersion} style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  {Array.from({ length: puzzleData.rows }, (_, r) => (
                    <tr key={r}>
                      {Array.from({ length: puzzleData.cols }, (_, c) => {
                        const cell = puzzleData.grid[r][c]
                        if (!cell) {return <td className={styles.cellEmpty} key={c} />}
                        const k = `${r},${c}`
                        return (
                          <td className={cellClassName(r, c)} key={c}>
                            {numMap[k] && <span className={styles.cellNum}>{numMap[k]}</span>}
                            <input
                              autoCapitalize="characters"
                              autoComplete="off"
                              autoCorrect="off"
                              className={styles.cellInput}
                              maxLength={1}
                              onChange={e => handleInput(e, r, c)}
                              onFocus={() => handleFocus(r, c)}
                              onKeyDown={e => handleKeyDown(e, r, c)}
                              ref={el => { inputRefs.current[k] = el }}
                              spellCheck={false}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Word bank modal */}
      {bankOpen && (
        <div
          className={styles.overlay}
          onClick={e => { if (e.target === e.currentTarget) {setBankOpen(false)} }}
        >
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              單字庫管理
              <button className={styles.modalClose} onClick={() => setBankOpen(false)}>&times;</button>
            </h2>
            <textarea
              className={styles.modalTextarea}
              onChange={e => setImportText(e.target.value)}
              placeholder={'apple 蘋果\ncat 貓\ndog 狗'}
              value={importText}
            />
            <p className={styles.modalHint}>每行一組：英文（空格）中文提示</p>
            <div className={styles.modalBtns}>
              <button className={`${styles.btn} ${styles.btnModal} ${styles.btnImp}`} onClick={importWords}>匯入</button>
              <button className={`${styles.btn} ${styles.btnModal} ${styles.btnDef}`} onClick={resetDefaults}>恢復預設</button>
              <button className={`${styles.btn} ${styles.btnModal} ${styles.btnClr}`} onClick={clearAll}>全部清除</button>
            </div>
            <div className={styles.wcount}>共 {bank.length} 個單字</div>
            <div className={styles.tags}>
              {[...bank].sort((a, b) => a.en.localeCompare(b.en)).map(w => (
                <span className={styles.tag} key={w.en}>
                  <span className={styles.tagEn}>{w.en.toLowerCase()}</span>
                  {w.zh}
                  <button className={styles.tagX} onClick={() => removeWord(w.en)}>&times;</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
