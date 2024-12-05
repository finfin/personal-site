import {Link} from 'i18n/routing'
import { format } from 'date-fns'
import { Post } from 'contentlayer/generated'
import { Card, CardContent, CardHeader } from '@/components/card'

interface PostsProps {
  posts: Post[]
}

function PostCard({post} : {post: Post}) {
  const {path, date, title, summary, slug} = post
  return (
    <Link href={path} key={slug}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <h2 className="font-medium text-xl">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {format(date, 'LLLL dd, yyyy')}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{summary}</p>
        </CardContent>
      </Card>
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
