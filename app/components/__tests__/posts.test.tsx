import { render, screen } from '@testing-library/react'
import { Posts } from '../posts'
import { Post } from 'contentlayer/generated'

// 模擬文章資料
const mockPosts = [
  {
    title: '測試文章 1',
    date: '2024-01-01',
    slug: 'test-post-1',
    summary: '這是第一篇測試文章',
    path: '/blog/test-post-1',
    _id: 'test-1',
    _raw: {
      sourceFilePath: 'test-1.mdx',
      sourceFileName: 'test-1.mdx',
      sourceFileDir: 'posts',
      contentType: 'mdx',
      flattenedPath: 'test-1'
    },
    type: 'Post',
    isDraft: false,
    body: { raw: '', code: '' },
    language: 'zh-TW'
  },
  {
    title: '測試文章 2',
    date: '2024-01-02',
    slug: 'test-post-2',
    summary: '這是第二篇測試文章',
    path: '/blog/test-post-2',
    _id: 'test-2',
    _raw: {
      sourceFilePath: 'test-2.mdx',
      sourceFileName: 'test-2.mdx',
      sourceFileDir: 'posts',
      contentType: 'mdx',
      flattenedPath: 'test-2'
    },
    type: 'Post',
    isDraft: false,
    body: { raw: '', code: '' },
    language: 'zh-TW'
  }
] as Post[]

jest.mock('i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Posts 元件', () => {
  test('應該正確渲染文章列表', () => {
    render(<Posts posts={mockPosts} />)

    expect(screen.getByText('測試文章 1')).toBeInTheDocument()
    expect(screen.getByText('測試文章 2')).toBeInTheDocument()
    expect(screen.getByText('這是第一篇測試文章')).toBeInTheDocument()
    expect(screen.getByText('這是第二篇測試文章')).toBeInTheDocument()
  })

  test('每篇文章應該有正確的連結', () => {
    render(<Posts posts={mockPosts} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/blog/test-post-1')
    expect(links[1]).toHaveAttribute('href', '/blog/test-post-2')
  })

  test('沒有文章時應該顯示空列表', () => {
    const { container } = render(<Posts posts={[]} />)
    const postContainer = container.querySelector('.flex.flex-col.gap-6')
    expect(postContainer?.children.length).toBe(0)
  })
})
