import Link from 'next/link'
import { formatDate } from '../[locale]/blog/utils'

interface BlogPost {
  metadata: {
    title: string
    publishedAt: string
    summary: string
  }
  slug: string
}

interface PostsProps {
  posts: BlogPost[]
}

export function Posts({ posts }: PostsProps) {
  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col gap-2"
          href={`/blog/${post.slug}`}
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-medium text-xl">{post.metadata.title}</h2>
            <p className="text-sm text-neutral-600">
              {formatDate(post.metadata.publishedAt, true)}
            </p>
            <p className="text-neutral-600">{post.metadata.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
