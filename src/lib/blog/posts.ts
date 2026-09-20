import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const MARKDOWN_EXTENSION = ".md";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type BlogPostSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  sourceUrl?: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

function requireString(
  value: unknown,
  fieldName: string,
  fileName: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fileName}: frontmatterの${fieldName}は必須です`);
  }

  return value.trim();
}

function parseTags(value: unknown, fileName: string): string[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.some((tag) => typeof tag !== "string")) {
    throw new Error(
      `${fileName}: frontmatterのtagsは文字列の配列にしてください`,
    );
  }

  return value.map((tag) => tag.trim()).filter(Boolean);
}

function parsePost(fileName: string, source: string): BlogPost {
  const slug = path.basename(fileName, MARKDOWN_EXTENSION);
  const { data, content } = matter(source);
  const title = requireString(data.title, "title", fileName);
  const date = requireString(data.date, "date", fileName);
  const excerpt = requireString(data.excerpt, "excerpt", fileName);

  if (Number.isNaN(Date.parse(date))) {
    throw new Error(`${fileName}: frontmatterのdateが正しい日付ではありません`);
  }

  const sourceUrl = data.sourceUrl;
  if (sourceUrl !== undefined && typeof sourceUrl !== "string") {
    throw new Error(
      `${fileName}: frontmatterのsourceUrlは文字列にしてください`,
    );
  }

  if (sourceUrl && !/^https?:\/\//.test(sourceUrl)) {
    throw new Error(
      `${fileName}: frontmatterのsourceUrlはHTTP(S) URLにしてください`,
    );
  }

  return {
    slug,
    title,
    date,
    excerpt,
    tags: parseTags(data.tags, fileName),
    sourceUrl: sourceUrl?.trim() || undefined,
    content: content.trim(),
  };
}

async function readPostFile(fileName: string): Promise<BlogPost> {
  const source = await fs.readFile(path.join(BLOG_DIRECTORY, fileName), "utf8");
  return parsePost(fileName, source);
}

export const getAllPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const entries = await fs.readdir(BLOG_DIRECTORY, { withFileTypes: true });
  const fileNames = entries
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith(MARKDOWN_EXTENSION),
    )
    .map((entry) => entry.name);
  const posts = await Promise.all(fileNames.map(readPostFile));

  return posts
    .sort((left, right) => right.date.localeCompare(left.date))
    .map(({ content: _content, ...summary }) => summary);
});

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!SLUG_PATTERN.test(slug)) {
      return null;
    }

    try {
      return await readPostFile(`${slug}${MARKDOWN_EXTENSION}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }

      throw error;
    }
  },
);
