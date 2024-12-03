// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/*.mdx',
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
      default: 'zh-TW',
    },
    redirect_from: {
      type: 'list',
      of: { type: 'string' },
    },
  },
  computedFields: {
    path: {
      type: 'string',
      resolve: (post) => `/posts/${post.slug}`
    },
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post]
})
