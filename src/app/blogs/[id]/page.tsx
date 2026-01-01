import BlogPost from "./BlogPost";
import { notFound } from "next/navigation";
import { fetchPostById } from "@/lib/posts/repository";

const formatPostDate = (value: string) =>
  new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ params }: any) {
  const id = params.id;
  if (!id) {
    notFound();
  }

  const post = await fetchPostById(id);
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <BlogPost
          title={post.title}
          publishedAtLabel={formatPostDate(post.publishedAt)}
          content={post.content}
        />
      </article>
    </div>
  );
}
