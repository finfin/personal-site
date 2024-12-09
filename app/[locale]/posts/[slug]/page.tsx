import { notFound } from 'next/navigation'
import MDXPost from '@/components/mdx-post'
import { format, parseISO } from 'date-fns'
import { baseUrl } from 'app/sitemap'
import { findPostBySlugAndLocale } from '../utils'
import { allPosts } from 'contentlayer/generated'

type Props = {
  params: Promise<{ slug: string, locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    locale: post.language,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  const post = findPostBySlugAndLocale(slug, locale)
  if (!post) {
    return
  }

  const {
    title,
    summary,
  } = post

  return {
    title,
    description: summary,
  }
}

// TODO: make this page Static Site Generation compatible
export default async function Blog({ params }: Props ) {
  const { slug, locale } = await params
  const post = findPostBySlugAndLocale(slug, locale)

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
      <h1 className="font-semibold text-2xl">
        {post.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {format(parseISO(post.date), 'LLLL dd, yyyy')}
        </p>
      </div>
      <article className="relative prose prose-neutral dark:prose-invert prose-lg">
        <MDXPost code={post.body.code} />
      </article>
    </section>
  )
}
