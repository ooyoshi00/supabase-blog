'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Breadcrumbs = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')

  return (
    <nav className="bg-white py-2 px-4 shadow-md">
      <ol className="flex space-x-2 text-sm">
        <li>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ホーム
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          return (
            <li key={href}>
              <span className="mx-2 text-gray-500">/</span>
              <Link href={href} className="text-blue-600 hover:text-blue-800">
                {segment}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
