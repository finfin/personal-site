import { allPosts } from '../.contentlayer/generated'

export const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://www.thingsaboutweb.dev'
  : 'http://localhost:3000'

export default async function sitemap() {
  const posts = allPosts.map((post) => ({
    url: `${baseUrl}/${post.language}${post.path}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const routes = ['', '/en', '/zh-TW', '/en/posts', '/zh-TW/posts', '/en/about', '/zh-TW/about', '/en/emojiarchitect', '/zh-TW/emojiarchitect'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))


  return [...routes, ...posts]
}
