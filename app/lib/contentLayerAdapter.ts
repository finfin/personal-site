import { allPages } from 'contentlayer/generated'

export function getAboutContent(locale) {
  return allPages.find((page) => page.path === 'about' && page.language === locale)
}
