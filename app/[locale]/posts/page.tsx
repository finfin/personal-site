import { Posts } from '@/components/posts';
import { getLocale, getTranslations } from 'next-intl/server';
import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'


// export async function generateStaticParams() {
//   return [
//     { locale: 'en' },
//     { locale: 'zh-TW' }
//   ]
// }

export default async function PostsPage() {
  const locale = await getLocale();
  const t = await getTranslations('post');
    const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date))).filter((post) => post.language === locale);
    return (
      <div>
        <h1 className="mb-6 text-2xl font-semibold">
          {t('title')}
        </h1>
        <Posts posts={posts} />
      </div>
    )
}

