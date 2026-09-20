import { promises as fs } from "node:fs";
import path from "node:path";

const SITE_URL = "https://okamune.vercel.app";
const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const STATIC_PATHS = ["", "/blogs"];

async function generateSitemap() {
  const blogPaths = (await fs.readdir(BLOG_DIRECTORY))
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => `/blogs/${path.basename(fileName, ".md")}`);
  const urls = [...STATIC_PATHS, ...blogPaths]
    .map(
      (pathname) => `  <url>
    <loc>${SITE_URL}${pathname}</loc>
  </url>`,
    )
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  await fs.writeFile(
    path.join(process.cwd(), "public", "sitemap.xml"),
    sitemap,
  );
}

await generateSitemap();
