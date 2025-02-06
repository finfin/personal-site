import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button 元件', () => {
  test('應該正確渲染預設按鈕', () => {
    render(<Button>點擊我</Button>)

    const button = screen.getByRole('button', { name: '點擊我' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  test('應該支援不同的變體樣式', () => {
    render(<Button variant="destructive">刪除</Button>)

    const button = screen.getByRole('button', { name: '刪除' })
    expect(button).toHaveClass('bg-destructive')
  })

  test('禁用狀態應該正確顯示', () => {
    render(<Button disabled>禁用按鈕</Button>)

    const button = screen.getByRole('button', { name: '禁用按鈕' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('pointer-events-none')
  })

  test('應該正確處理點擊事件', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>點擊我</Button>)

    fireEvent.click(screen.getByRole('button', { name: '點擊我' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('應該支援自定義 className', () => {
    render(<Button className="custom-class">自定義按鈕</Button>)

    const button = screen.getByRole('button', { name: '自定義按鈕' })
    expect(button).toHaveClass('custom-class')
  })
})
