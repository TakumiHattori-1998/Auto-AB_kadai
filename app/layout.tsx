import '@/styles/globals.css' // Tailwind CSSのスタイルをインポート
import { Inter } from 'next/font/google' // フォントをインポート（オプション）
import Head from 'next/head'
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Auto-AB',
  description: 'Auto-AB application',
}


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <Head>
            <title>Auto AB - welcome</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>


        <body>
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className={`${lusitana.className}text-2xl font-bold`}>Auto AB</h1>
                    <nav>
                        <Link href="/auth/signin" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition-colors">
                        sign in
                        </Link>
                    </nav>
                </div>
            </header>
            {children}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto text-center">
                <p>&copy; 2024 Auto AB. All rights reserved.</p>
                </div>
            </footer>
        </body>
      </html>
    )
  }