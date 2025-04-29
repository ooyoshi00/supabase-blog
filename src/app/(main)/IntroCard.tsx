const startYear = 2020
const IntroCard = () => {
  const workYear = new Date().getFullYear() - startYear
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-blue-600">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">okamune</h1>
      <p className="text-gray-600">
        大学で情報工学を専攻し、新卒でフロントエンドエンジニアとして採用。現在は領域関わらず、アプリケーションの設計・開発にも携わっています。
        <br />
        今年で実務
        {workYear}
        年目となります。
      </p>
    </div>
  )
}

export default IntroCard
