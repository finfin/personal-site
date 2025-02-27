import { notFound } from 'next/navigation'
import MDXPost from '@/components/mdx-post'
import { format, parseISO } from 'date-fns'
import { baseUrl } from 'app/sitemap'
import { findPostBySlugAndLocale } from '../utils'
import { allPosts } from 'contentlayer/generated'
import { setRequestLocale } from 'next-intl/server'
import { PageProps } from '@/types'
import { unstable_ViewTransition as ViewTransition } from 'react'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    locale: post.language,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps<{slug: string, locale: string}>) {
  const { slug, locale } = await params;
  const post = findPostBySlugAndLocale(slug, locale)
  if (!post) {
    return
  }

  const {
    title,
    summary,
  } = post

  const alternateLanguages = allPosts
    .filter(p => p.slug === slug && p.language !== locale)
    .map(p => ({
      url: `${baseUrl}/${p.language}/posts/${p.slug}`,
      hreflang: p.language
    }));

  return {
    title,
    description: summary,
    openGraph: {
      description: summary,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/posts/${slug}`,
      languages: Object.fromEntries(
        alternateLanguages.map(({ url, hreflang }) => [hreflang, url])
      ),
    },
  }
}

// TODO: make this page Static Site Generation compatible
export default async function Blog({ params }: PageProps<{slug: string, locale: string}>) {
  const { slug, locale } = await params
  const post = findPostBySlugAndLocale(slug, locale)

  if (!post) {
    notFound()
  }
  setRequestLocale(locale);

  return (
    <section className='mb-4'>
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

      <ViewTransition name={`post-header-${slug}`}>
        <h1 className="font-semibold text-3xl md:text-4xl post-title">
          {post.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {format(parseISO(post.date), 'LLLL dd, yyyy')}
          </p>
        </div>
      </ViewTransition>
      <ViewTransition name={`post-content-${slug}`}>
        <article className="relative prose prose-neutral dark:prose-invert md:prose-xl">
          <MDXPost code={post.body.code} />
        </article>
      </ViewTransition>
    </section>
  )
}
