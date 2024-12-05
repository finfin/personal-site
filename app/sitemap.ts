import { allPosts } from '../.contentlayer/generated'

export const baseUrl = 'https://www.thingsaboutweb.dev'

export default async function sitemap() {
  const posts = allPosts.map((post) => {
    // TODO: generate sitemap for every locale
    // const locales = ['en', 'zh-TW']
    // const routes = locales.map((locale) => ({
    //   url: `${baseUrl}/${locale}/${post.path}`,
    return {
    url: `${baseUrl}/${post.path}`,
    lastModified: new Date().toISOString().split('T')[0],
  }})

  const routes = ['', '/posts'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...posts]
}
