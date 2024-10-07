"use client"

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            Auto AB
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            トップページに戻る
          </Link>
        </div>
      </div>
    </header>
  )
}