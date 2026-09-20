import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import RSS from "rss";

const SITE_URL = "https://okamune.vercel.app";
const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

async function generate() {
  const feed = new RSS({
    title: "okamune home",
    description: "okamuneのポートフォリオ兼ブログ",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: "ja",
  });
  const fileNames = (await fs.readdir(BLOG_DIRECTORY)).filter((fileName) =>
    fileName.endsWith(".md"),
  );
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await fs.readFile(
        path.join(BLOG_DIRECTORY, fileName),
        "utf8",
      );
      const { data } = matter(source);
      return {
        slug: path.basename(fileName, ".md"),
        title: String(data.title),
        date: String(data.date),
        description: String(data.excerpt),
      };
    }),
  );

  posts
    .sort((left, right) => right.date.localeCompare(left.date))
    .forEach((post) => {
      feed.item({
        title: post.title,
        description: post.description,
        url: `${SITE_URL}/blogs/${post.slug}`,
        date: post.date,
      });
    });

  await fs.writeFile(
    path.join(process.cwd(), "public", "feed.xml"),
    feed.xml({ indent: true }),
  );
}

await generate();
