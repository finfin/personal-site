import { ImageResponse } from 'next/og'
import { baseUrl } from '@/sitemap'

export const alt = 'Blog'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  const backgroundImage = `${baseUrl}/images/default-og-background.png`

  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col items-center justify-end">
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
        <div tw="bg-[#242433]/70 p-2 w-full flex justify-center">
          <h2 tw="text-[44px] font-bold text-white justify-center text-center text-[#e4e1ec]">
            Things About Web Development
          </h2>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
