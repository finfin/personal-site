
'use client'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { mdxComponents } from '@/components/mdx'

export default function MDXPost({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent components={mdxComponents} />
}
