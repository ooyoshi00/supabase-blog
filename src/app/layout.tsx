import ToastProvider from "@/app/_component/providers/ToastProvider";
import type { Metadata, Viewport } from "next";
import { M_PLUS_1 } from "next/font/google";
import { createClient } from "../../utils/supabase/server";
import "./globals.css";
import Header from "@/app/_component/appHeader";

const mPlus1 = M_PLUS_1({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | okamune home",
    default: "okamune home",
  },
  description:
    "エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。",
  openGraph: {
    title: "okamune home",
    description:
      "エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "okamune home",
    description:
      "エンジニアとして活動しているokamuneに関するホームページです。なんでもできる中級エンジニアに僕はなりたい。",
  },
  other: {
    "google-site-verification": "google84a51d916f8f11be",
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// ルートレイアウト
const RootLayout = async ({ children }: RootLayoutProps) => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <html lang="ja">
      <body className={mPlus1.className}>
        <ToastProvider />
        <div className="flex min-h-screen flex-col">
          <Header user={user} />

          <main className="flex-1">{children}</main>

          <footer className="border-t py-2">
            <div className="flex flex-row items-center justify-center text-sm gap-4">
              <div>関連アカウント: </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://x.com/okamune_web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  X
                </a>
                <a
                  href="https://zenn.dev/yoshiooon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Zenn
                </a>
                <a
                  href="https://qiita.com/okamune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Qiita
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
