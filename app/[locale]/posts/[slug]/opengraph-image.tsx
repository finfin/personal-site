import { findPostBySlugAndLocale } from '../utils'
import { ImageResponse } from 'next/og'
import { baseUrl } from '@/sitemap';

export const runtime = 'edge'
export const alt = 'Blog Post'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: { slug: string, locale: string } }) {

  const font = await fetch(
    new URL('/fonts/NotoSansTC-Medium.ttf', baseUrl)
  );

  if (!font.ok) {
    throw new Error('Failed to fetch the font file');
  }

  const fontData = await font.arrayBuffer();

  // const notoSansTCMediumFont = promises.readFile(join(fileURLToPath(import.meta.url), '../../../../assets/fonts/NotoSansTC-Medium.ttf'));
  const post = await findPostBySlugAndLocale(params.slug, params.locale)

  let backgroundImage: string
  try {
    // 從本地 content/images 目錄讀取社交圖片
    if (!post) {
      throw new Error('Social image not found')
    }

    backgroundImage = post.socialImage ? `${baseUrl}/images/posts/${post.socialImage}` : `${baseUrl}/images/default-og-background.png`

  } catch (_error) {
    console.error('Failed to fetch remote image', _error)
    backgroundImage = `${baseUrl}/images/default-og-background.png`
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
          data: fontData,
          weight: 500,
        },
      ],
    }
  )
}
