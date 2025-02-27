import { Link } from 'i18n/routing'
import { format } from 'date-fns'
import { Post } from 'contentlayer/generated'
import { Card, CardContent, CardHeader } from '@/components/card'
import { unstable_ViewTransition as ViewTransition } from 'react'

interface PostsProps {
  posts: Post[]
}

function PostCard({post} : {post: Post}) {
  const {path, date, title, summary, slug} = post

  return (
    <Link href={path} key={slug}>

      <Card className="transition-colors dark:bg-black/10 bg-white/30 hover:bg-white/50 hover:dark:bg-black/30 ">
        <CardHeader>
          <ViewTransition name={`post-header-${slug}`}>
            <h2 className="font-medium text-xl post-title">{title}</h2>

            <p className="text-sm text-muted-foreground">
              {format(date, 'LLLL dd, yyyy')}
            </p>
          </ViewTransition>
        </CardHeader>
        <CardContent>
          <ViewTransition name={`post-content-${slug}`}>
            <p className="text-muted-foreground">{summary}</p>
          </ViewTransition>
        </CardContent>
      </Card>
    </Link>
  )
}

export function Posts({ posts }: PostsProps) {
  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
