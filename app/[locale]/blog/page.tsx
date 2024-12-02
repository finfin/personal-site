import { getDictionary } from '../../i18n/dictionaries'
import { Locale } from '../../i18n/i18n-config'

export default async function BlogPage({
    params: { lang }
}: {
    params: { lang: Locale }
}) {
    const dict = await getDictionary(lang)

    return (
        <div>
            <h1>{dict.nav.blog}</h1>
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
