import { baseUrl } from 'app/sitemap'
import { allPosts } from '@/[locale]/posts/utils'
import { Post } from 'contentlayer/generated'

export async function GET() {
  const itemsXml = allPosts
    .sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1
      }
      return 1
    })
    .map(
      (post: Post) =>
        `<item>
          <title>${post.title}</title>
          <link>${baseUrl}/${post.language}/posts/${post.slug}</link>
          <description>${post.summary || ''}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
