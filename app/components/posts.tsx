import { Link } from 'i18n/routing'
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
      <Card className="transition-colors dark:bg-black/10 bg-white/30 hover:bg-white/50 hover:dark:bg-black/30 ">
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
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
