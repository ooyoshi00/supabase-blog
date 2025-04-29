import { Suspense } from 'react'
import BlogList from './BlogList'

const Blogs = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        ブログ記事一覧(開発中)
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      <Suspense fallback={<div>...loading</div>}>
        <BlogList />
      </Suspense>
    </div>
  )
}

export default Blogs
