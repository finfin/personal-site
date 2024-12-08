import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || 'Next.js Portfolio Starter'

  const imageData = readFileSync(join(process.cwd(), 'app/og/og-background.png'))
  const logoData = readFileSync(join(process.cwd(), 'app/og/dark-logo.png'))

  const base64Image = `data:image/png;base64,${imageData.toString('base64')}`
  const base64Logo = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div tw="relative flex flex-col w-full h-full items-center justify-center">
        <img
          alt="Background"
          src={base64Image}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'rotate(180deg)',
          }}
        />
        <div tw="absolute bottom-4 w-full px-10 flex justify-between gap-4 items-baseline">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight  text-white ">
            {title}
          </h2>
          <img
            alt="Logo"
            src={base64Logo}
            tw="flex-auto w-[210px] h-[70px] object-contain"
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
