import { findPostBySlugAndLocale } from '../utils'
import { ImageResponse } from 'next/og'
import { promises, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url';

// export const runtime = 'edge'
export const alt = 'Blog Post'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

const notoSansTCMediumFont = promises.readFile(join(fileURLToPath(import.meta.url), '../../../../assets/fonts/NotoSansTC-Medium.ttf'));

export default async function Image({ params }: { params: { slug: string, locale: string } }) {
  const post = await findPostBySlugAndLocale(params.slug, params.locale)

  let backgroundImage: string
  try {
    // 從本地 content/images 目錄讀取社交圖片
    if (!post?.socialImage) {
      throw new Error('Social image not found')
    }
    const socialImagePath = join(process.cwd(), 'content/images', post.socialImage)
    const imageData = readFileSync(socialImagePath)

    // 根據檔案副檔名判斷 MIME type
    const extension = post.socialImage.split('.').pop()?.toLowerCase() || ''
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    }
    const mimeType = mimeTypes[extension] || 'image/png'

    backgroundImage = `data:${mimeType};base64,${imageData.toString('base64')}`
  } catch (_error) {
    console.error('Failed to fetch remote image', _error)
    const localImageData = readFileSync(join(process.cwd(), 'app/assets/images/og-background.png'))
    backgroundImage = `data:image/png;base64,${localImageData.toString('base64')}`
  }

  if (!post) {
    return new ImageResponse(
      (
        <div tw="w-full h-full bg-white flex items-center justify-center">
          Post not found
        </div>
      ),
      size
    )
  }

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex flex-col items-center justify-end "
      >
        <img
          alt="Background"
          src={backgroundImage}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div tw="bg-[#242433]/80 px-8 flex justify-center  rounded-xl m-4 min-h-30 items-center">
          <h2 style={{
            fontFamily: 'Noto Sans TC',
            fontWeight: 500,
          }} tw="text-[44px] font-bold text-white justify-center text-center text-[#e4e1ec]">
            {post.title}
          </h2>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Sans TC',
          data: await notoSansTCMediumFont,
          weight: 500,
        },
      ],
    }
  )
}
