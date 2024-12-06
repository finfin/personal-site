import { Link } from 'i18n/routing'
export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        404 - Page Not Found
      </h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link href="/">
        <span className="text-accent-600 hover:underline">Go back home</span>
      </Link>
    </section>
  )
}
