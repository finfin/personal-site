export interface LayoutProps<T> {
  params: Promise<T>
}

// searchParams are only available in page.js segments.
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
export interface PageProps<T> extends LayoutProps<T> {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

