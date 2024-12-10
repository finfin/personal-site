import { Posts } from '../components/posts';
import {getLocale, getTranslations} from 'next-intl/server';
import { Link } from 'i18n/routing'
import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-TW' }
  ]
}

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('home');
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .filter((post) => post.language === locale)
    .slice(0, 5);

  return (
    <section>
      <div className="relative flex flex-col items-center justify-center text-center space-y-6 h-64">
        <div>

          <h1 className="font-bold mb-2 text-5xl bg-gradient-to-r from-heading-primary to-heading-secondary
          text-transparent bg-clip-text animate-gradient-x py-2">{t('title')}</h1>
          <h2 className="text-xl text-muted-foreground mt-4">{t('subtitle')}</h2>
        </div>
      </div>

      {t('description').split('\n').map((line, index) => (
        <p className="mb-4" key={index}>{line}</p>))
      }

      <div className="max-w-4xl mx-auto  my-8">
        <Card className='border-none'>
          <CardHeader className='px-0'>
            <CardTitle>{t('latest_posts')}</CardTitle>
          </CardHeader>
          <CardContent className='px-0'>
            <Posts posts={posts} />
            <div className="mt-4 text-center">
              <Link
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                href="/posts"
              >
                {t('view_all_posts')} →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
