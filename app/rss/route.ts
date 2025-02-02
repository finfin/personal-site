import { baseUrl } from '@/sitemap'
import { allPosts } from '@/[locale]/posts/utils'
import { Post } from 'contentlayer/generated'
import { escapeXml } from '@/lib/utils'

export async function GET() {
  const itemsXml = allPosts
    .sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1
      }
      return 1
    })
    .map(
      (post: Post) => {


        return `<item>
          <title>${escapeXml(post.title)}</title>
          <link>${baseUrl}/${post.language}/posts/${post.slug}</link>
          <description>${escapeXml(post.summary || '')}</description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        </item>`
      }

    )
    .join('\n')
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Things About Web Development</title>
        <link>${baseUrl}</link>
        <description>RSS feed of things about web development</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
