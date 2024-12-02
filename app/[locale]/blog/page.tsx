import {getTranslations} from 'next-intl/server';

export default async function BlogPage() {
    const t = await getTranslations('blog');

    return (
        <div>
            <h1>{t('title')}</h1>
            {/* blog content... */}
        </div>
    )
}

export async function generateStaticParams() {
    return [
        { lang: 'en' },
        { lang: 'zh-TW' }
    ]
}
