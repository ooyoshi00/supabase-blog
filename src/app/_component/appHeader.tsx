'use client'
import { User } from '@supabase/supabase-js'
import { LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'

type HeaderProps = {
  user: User | null
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますが、宜しいですか？')) {
      return
    }

    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/"
                className={`hover:text-blue-200 transition-colors ${
                  pathname === '/' ? 'font-bold' : ''
                }`}
              >
                ホーム
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className={`hover:text-blue-200 transition-colors ${
                  pathname === '/blogs' ? 'font-bold' : ''
                }`}
              >
                ブログ
              </Link>
            </li>
            {process.env.IS_DEV && (
              <li>
                <Link
                  href="/rss"
                  className={`hover:text-blue-200 transition-colors ${
                    pathname === '/rss' ? 'font-bold' : ''
                  }`}
                >
                  RSS
                </Link>
              </li>
            )}
            {process.env.IS_DEV && (
              <li>
                <Link
                  href="/rss"
                  className={`hover:text-blue-200 transition-colors ${
                    pathname === '/portfolio' ? 'font-bold' : ''
                  }`}
                >
                  経歴
                </Link>
              </li>
            )}
          </ul>

          <div className="text-sm font-bold">
            {user ? (
              <div className="flex items-center space-x-5">
                <Link href="/blog/new" className="hover:text-blue-200 transition-colors">
                  投稿
                </Link>

                <Link href="/settings/profile" className="hover:text-blue-200 transition-colors">
                  設定
                </Link>

                <div className="cursor-pointer hover:text-blue-200 transition-colors" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </div>
              </div>
            ) : (
                <div className="flex items-center space-x-5">
                  <Link href="/login" className="hover:text-blue-200 transition-colors flex gap-1">
                    <LogIn className="h-5 w-5" />
                    <span>管理者ログイン</span>
                  </Link>
                {/* <Link href="/signup" className="hover:text-blue-200 transition-colors">サインアップ</Link> */}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
