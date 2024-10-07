import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">


      <main className="flex-grow">
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">全自動のWebデザイン最適化サービス</h2>
            <p className="text-xl mb-8">デザイン開発から分析まで、Webデザインの改善サイクルを一気通貫で自動化</p>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors">
              get started
            </Link>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">主な特徴</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries({
                'デザイン生成': 'ABテストの分析結果を踏まえて、生成AIがKPIを向上させるWebデザイン、実装を自動で生成',
                'ABテスト': '好みのデザインを選択するだけで、すぐにテストを実行',
                'アナリティクス': 'テストの結果を記録して、AIが成功パターンを見つけ出します'
              }).map(([title, description], index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-semibold mb-2">{title}</h4>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}