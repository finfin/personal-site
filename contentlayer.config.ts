// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import highlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm';
import rehypeImgSize from 'rehype-img-size';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'content/posts/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string',
      description: 'The URL path of the post',
      required: true,
    },
    date: {
      type: 'date',
      required: true
    },
    summary: {
      type: 'string',
      description: 'The summary of the post',
      required: true,
    },
    socialImage: {
      type: 'string',
      // required: true,
    },
    isDraft: {
      type: 'boolean',
      default: false,
    },
    language: {
      type: 'enum',
      options: ['en', 'zh-TW'],
      default: 'en',
    },
  },
  computedFields: {
    path: {
      type: 'string',
      resolve: (post) => `/posts/${post.slug}`
    },
  },
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'content/pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: {
      type: 'string',
      required: true,
    },
    path: {
      type: 'string',
      required: true,
    },
    language: {
      type: 'enum',
      options: ['en', 'zh-TW'],
      default: 'en',
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Page],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // [rehypeImgSize, { dir: 'public' }],
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'prepend',
        properties: {
          className: ['anchor'],
          ariaLabel: 'Anchor',
        },
      }],
      highlight,

    ],
  },
})
