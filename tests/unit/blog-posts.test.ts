import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";

describe("Markdownブログ記事", () => {
  it("日付の新しい順で記事一覧を取得する", async () => {
    const posts = await getAllPosts();

    expect(posts).toHaveLength(3);
    expect(posts[0]?.slug).toBe("nextjs-thinking-notes");
    expect(posts.every((post) => post.excerpt.length > 0)).toBe(true);
  });

  it("slugから記事本文を取得する", async () => {
    const post = await getPostBySlug("portfolio-renewal");

    expect(post?.title).toBe("ポートフォリオのリニューアルしました");
    expect(post?.content).toContain("ポートフォリオ作成");
  });

  it("不正または存在しないslugではnullを返す", async () => {
    await expect(getPostBySlug("../package")).resolves.toBeNull();
    await expect(getPostBySlug("missing-post")).resolves.toBeNull();
  });
});
