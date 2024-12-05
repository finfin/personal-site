import { Posts } from '@/components/posts';
import { getLocale, getTranslations } from 'next-intl/server';
import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export default async function PostsPage() {
  const locale = await getLocale();
  const t = await getTranslations('post');
    const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).filter((post) => post.language === locale);
    return (
        <div>
          <div className='flex flex-col space-y-1.5 p-6'>
            <h1 className='text-2xl font-semibold leading-none'>{t('title')}</h1>
          </div>
          <Posts posts={posts} />
        </div>
    )
}

export async function generateStaticParams() {
    return [
        { lang: 'en' },
        { lang: 'zh-TW' }
    ]
}
