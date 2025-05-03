import fs from 'fs'
import path from 'path'

const DOMAIN = 'https://okamune.vercel.app/' // 本番環境のドメインに変更してください

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
  console.log('Sitemap generated successfully!')
}

generateSitemap() 