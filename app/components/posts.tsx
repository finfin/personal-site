import {Link} from '@/i18n/routing'
import { format } from 'date-fns'
import { Post } from 'contentlayer/generated'

interface PostsProps {
  posts: Post[]
}

function PostCard({post} : {post: Post}) {
  const {path, date, title, summary, slug} = post
  return (
    <Link
      className="flex flex-col gap-2"
      href={path}
      key={slug}
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-xl">{title}</h2>
        <p className="text-sm text-neutral-600">
          {format(date, 'LLLL dd, yyyy')}
        </p>
        <p className="text-neutral-600">{summary}</p>
      </div>
    </Link>
  )
}

export function Posts({ posts }: PostsProps) {
  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
