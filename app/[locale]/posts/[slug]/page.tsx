import { notFound } from 'next/navigation'
import MDXPost from '@/components/mdx-post'
import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import { baseUrl } from 'app/sitemap'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug)
  if (!post) {
    return
  }

  const {
    title,
    date,
    summary,
    socialImage,
  } = post
  const ogImage = socialImage
    ? socialImage
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    summary,
    openGraph: {
      title,
      summary,
      type: 'article',
      date,
      url: `${baseUrl}/${post.path}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      summary,
      images: [ogImage],
    },
  }
}

// TODO: make this page Static Site Generation compatible
export default async function Blog({ params }: Props ) {
  const { slug } = await params
  const post = allPosts.find((post) => post.slug === slug)
  if (!post) {
    notFound()
  }

  return (
    <section className='[view-transition-name:blog-post]'>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: post.summary,
            image: post.socialImage
              ? `${baseUrl}${post.socialImage}`
              : `/og?title=${encodeURIComponent(post.title)}`,
            url: `${baseUrl}/${post.path}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
        suppressHydrationWarning
        type="application/ld+json"
      />
      <h1 className="font-semibold text-2xl tracking-tighter">
        {post.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {format(parseISO(post.date), 'LLLL dd, yyyy')}
        </p>
      </div>
      <article className="prose">
        <MDXPost code={post.body.code} />
      </article>
    </section>
  )
}
