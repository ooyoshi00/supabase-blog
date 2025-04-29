import IntroCard from './IntroCard'
import Skills from './skills'
import { Suspense } from 'react'

const Home = () => {
  return (
    <>
      <IntroCard />
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">経歴</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>2021年 - 2024年: 不動産テック系会社 - Webエンジニア</li>
          <li>2024年 - 現在: スペースシェア系会社 - Webエンジニア</li>
        </ul>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <Skills />
      </Suspense>
    </>
  )
}

export default Home
