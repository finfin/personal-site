import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'Blog'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  let backgroundImage: string
  try {
    const localImageData = readFileSync(join(process.cwd(), 'app/assets/images/og-background.png'))
    backgroundImage = `data:image/png;base64,${localImageData.toString('base64')}`
  } catch {
    // 如果無法讀取背景圖片，使用預設背景圖片
    backgroundImage = ''
  }

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
