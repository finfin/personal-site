'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentPath = pathname

        // 如果當前路徑沒有語言前綴，直接添加
        if (!currentPath.match(/^\/(en|zh-TW)\//)) {
            const newPath = `/${e.target.value}`
            router.push(newPath)
            return
        }

        const newPath = currentPath.replace(/^\/(en|zh-TW)/, `/${e.target.value}`)
        router.push(newPath)
    }

    const currentLang = pathname?.split('/')[1] || 'en'

    return (
        <select
            className="w-20 bg-transparent"
            onChange={handleLanguageChange}
            value={currentLang}
        >
            <option value="en">English</option>
            <option value="zh-TW">中文</option>
        </select>
    )
}
