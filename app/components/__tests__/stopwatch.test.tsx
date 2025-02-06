import { act, fireEvent, render, screen } from '@testing-library/react'
import Stopwatch from '../stopwatch'

describe('Stopwatch 元件', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('應該正確渲染初始狀態', () => {
    render(<Stopwatch />)

    expect(screen.getByText('00:00:00.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重設' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '計圈' })).toBeDisabled()
  })

  test('點擊開始按鈕後應該開始計時', () => {
    render(<Stopwatch />)

    const startButton = screen.getByRole('button', { name: '開始' })
    fireEvent.click(startButton)

    // 前進 1 秒
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('00:00:01.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '暫停' })).toBeInTheDocument()
  })

  test('點擊暫停按鈕後應該停止計時', () => {
    render(<Stopwatch />)

    // 開始計時
    fireEvent.click(screen.getByRole('button', { name: '開始' }))

    // 前進 2 秒
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // 暫停
    fireEvent.click(screen.getByRole('button', { name: '暫停' }))

    // 再前進 1 秒
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // 時間應該保持在 2 秒
    expect(screen.getByText('00:00:02.00')).toBeInTheDocument()
  })

  test('點擊重置按鈕後應該回到初始狀態', () => {
    render(<Stopwatch />)

    // 開始計時
    fireEvent.click(screen.getByRole('button', { name: '開始' }))

    // 前進 3 秒
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // 重置
    fireEvent.click(screen.getByRole('button', { name: '重設' }))

    expect(screen.getByText('00:00:00.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重設' })).toBeDisabled()
  })
})
