'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentPath = pathname
        console.log('currentPath', currentPath)
        console.log('selected value', e.target.value)

        // 如果當前路徑沒有語言前綴，直接添加
        if (!currentPath.match(/^\/[a-z-]+\//)) {
            const newPath = `/${e.target.value}`
            console.log('newPath (no prefix)', newPath)
            router.push(newPath)
            return
        }

        const newPath = currentPath.replace(/^\/[a-z-]+/, `/${e.target.value}`)
        console.log('newPath (with replace)', newPath)
        router.push(newPath)
    }

    const currentLang = pathname?.split('/')[1] || 'en'
    console.log('currentLang', currentLang)

    return (
        <select
            onChange={handleLanguageChange}
            value={currentLang}
            className="w-20 bg-transparent"
        >
            <option value="en">English</option>
            <option value="zh-TW">中文</option>
        </select>
    )
}
