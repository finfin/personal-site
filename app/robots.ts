import { baseUrl } from 'app/sitemap'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: [
          '/image',
          '/og',
          '/*/opengraph-image',
          '/_next',
          '/manifest.webmanifest'
        ],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
