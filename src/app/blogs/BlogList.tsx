import { getAllPosts } from "@/lib/blog/posts";
import Sidebar from "../_component/SideBar";
import BlogCard from "./BlogCard";

const formatPostDate = (value: string) =>
  new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const BlogList = async () => {
  const posts = await getAllPosts();
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">最新の記事</h1>
        {posts.length === 0 ? (
          <div className="text-sm text-gray-600 bg-white rounded-lg p-6 shadow-sm">
            公開済みの記事はまだありません。
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={formatPostDate(post.date)}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default BlogList;
