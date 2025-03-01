// components/stopwatch/stopwatch.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/utils'

type Lap = {
  id: string
  time: number
  total: number
}

export default function Stopwatch() {
  // 狀態管理
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [laps, setLaps] = useState<Lap[]>([])

  // 參考值 (避免閉包問題)
  const animationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef(0)
  const accumulatedTimeRef = useRef(0)

  // 副作用處理
  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current!)
  }, [])

  // 核心計時邏輯
  const updateTimer = () => {
    const currentTime = Date.now()
    setElapsedTime(accumulatedTimeRef.current + (currentTime - startTimeRef.current))
    animationRef.current = requestAnimationFrame(updateTimer)
  }

  // 事件處理
  const handleStart = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now()
      animationRef.current = requestAnimationFrame(updateTimer)
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    if (isRunning) {
      cancelAnimationFrame(animationRef.current!)
      accumulatedTimeRef.current += Date.now() - startTimeRef.current
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    cancelAnimationFrame(animationRef.current!)
    setElapsedTime(0)
    accumulatedTimeRef.current = 0
    setLaps([])
    setIsRunning(false)
  }

  const handleLap = () => {
    const lapTime = laps.length > 0
      ? elapsedTime - laps[laps.length - 1].total
      : elapsedTime

    setLaps([...laps, {
      id: crypto.randomUUID(),
      time: lapTime,
      total: elapsedTime
    }])
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-lg">
      {/* 時間顯示 */}
      <div className="text-4xl font-mono font-semibold text-primary">
        {formatTime(elapsedTime)}
      </div>

      {/* 控制按鈕 */}
      <div className="flex gap-2">
        <Button
          onClick={isRunning ? handlePause : handleStart}
          variant={isRunning ? 'destructive' : 'default'}
        >
          {isRunning ? '暫停' : '開始'}
        </Button>

        <Button
          disabled={elapsedTime === 0}
          onClick={handleReset}
          variant="outline"
        >
          重設
        </Button>

        <Button
          disabled={!isRunning}
          onClick={handleLap}
          variant="secondary"
        >
          計圈
        </Button>
      </div>

      {/* 計圈列表 */}
      {laps.length > 0 && (
        <div className="w-full mt-4 space-y-2">
          <h3 className="text-lg font-semibold">計圈記錄</h3>
          <div className="divide-y">
            {laps.map((lap, index) => (
              <div className="flex justify-between py-2" key={lap.id}>
                <span>第 {laps.length - index} 圈</span>
                <span className="font-mono">{formatTime(lap.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
