import { allPosts } from 'contentlayer/generated'

type Metadata = {
  title: string
  date: string
  summary: string
  socialImage?: string
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

interface Post {
  metadata: Metadata;
  slug: string;
  content: string;
}

export interface PostsWithPagination {
  posts: Post[];
  totalPages: number;
  currentPage: number;
}

export const POSTS_PER_PAGE = 20;

export function getPaginatedPosts(page: number = 1): PostsWithPagination {
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;

  const sortedPosts = allPosts
    .map(post => ({
      metadata: {
        title: post.title,
        date: post.date,
        summary: post.summary,
        socialImage: post.socialImage
      },
      slug: post.slug,
      content: post.body.raw
    }))
    .sort((a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
    );

  return {
    posts: sortedPosts.slice(startIndex, endIndex),
    totalPages: Math.ceil(sortedPosts.length / POSTS_PER_PAGE),
    currentPage: page
  };
}

export function findPostBySlugAndLocale(slug: string, locale: string) {
  return allPosts.find((post) => post.slug === slug && post.language === locale)
}

// export allPosts
export { allPosts }
