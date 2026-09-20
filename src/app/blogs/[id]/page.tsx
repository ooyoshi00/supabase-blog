import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import BlogPost from "./BlogPost";

const formatPostDate = (value: string) =>
  new Date(value).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

type BlogPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ id: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function Page({ params }: BlogPageProps) {
  const { id } = await params;

  const post = await getPostBySlug(id);
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article>
        <BlogPost
          title={post.title}
          publishedAtLabel={formatPostDate(post.date)}
          content={post.content}
          sourceUrl={post.sourceUrl}
        />
      </article>
    </div>
  );
}
