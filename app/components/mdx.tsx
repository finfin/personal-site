import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'
import { CodePen } from '@/components/codepen'
import '@/styles/highlight-monokai.css'
import { cn } from '@/lib/utils'

function Table({ data }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  const href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a rel="noopener noreferrer" target="_blank" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function createHeading(level) {
  const Heading = ({ children, className, ...props }) => {
    return React.createElement(
      `h${level}`,
      { className: cn('scroll-mt-20', className), ...props },
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

function img({ src, width, height, alt, ...props }) {
  console.log(props);
  return (
    <figure className={'relative w-full aspect-(--image-aspect) max-h-[70vh] rounded-lg'} style={{'--image-aspect': `${height}/${width}`} as React.CSSProperties }>
      <Image alt={alt} layout="fill" objectFit="contain" src={src} />
    </figure>
  )
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: img,
  a: CustomLink,
  Table,
  CodePen
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...mdxComponents, ...(props.components || {}) }}
    />
  )
}
