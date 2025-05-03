import ToastProvider from '@/app/_component/providers/ToastProvider'
import type { Metadata, Viewport } from 'next'
import { M_PLUS_1 } from 'next/font/google'
import { createClient } from '../../utils/supabase/server'
import './globals.css'
import Header from '@/app/_component/appHeader'

const mPlus1 = M_PLUS_1({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | okamune home',
    default: 'okamune home',
  },
  description: 'エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。',
  openGraph: {
    title: 'okamune home',
    description: 'エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'okamune home',
    description: 'エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。',
  },
}

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
}

interface RootLayoutProps {
  children: React.ReactNode
}

// ルートレイアウト
const RootLayout = async ({ children }: RootLayoutProps) => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  return (
    <html lang="ja">
      <body className={mPlus1.className}>
        <ToastProvider />
        <div className="flex min-h-screen flex-col">
          <Header user={user} />

          <main className="flex-1">{children}</main>

          <footer className="border-t py-2">
            <div className="flex flex-col items-center justify-center text-sm space-y-5">
              <div>©FullStackChannel. ALL Rights Reserved.</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
