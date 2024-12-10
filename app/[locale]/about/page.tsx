import {getTranslations} from 'next-intl/server';
import { getAboutContent } from '@/lib/contentLayerAdapter';
import MDXPost from '@/components/mdx-post'

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-TW' }
  ]
}

export default async function About({ params }) {
  const t = await getTranslations('about');
  const { locale } = await params;
  const aboutContent = getAboutContent(locale);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">
        {t('title')}
      </h1>

      <div className='prose prose-neutral dark:prose-invert'>
        {aboutContent && <MDXPost code={aboutContent.body.code} />}
      </div>
    </section>
  )
}
