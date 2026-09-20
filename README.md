# okamune home

Next.jsで構築したポートフォリオ兼ブログです。ブログ記事はデータベースを使わず、リポジトリ内のMarkdownファイルとして管理します。

## 開発

依存関係をインストールし、開発サーバーを起動します。

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ブログ記事の追加

1. `content/blog/<slug>.md` を追加します。ファイル名が記事URLのslugになります。
2. 記事画像を `public/images/blog/` に配置します。
3. Markdown本文から `/images/blog/<ファイル名>` で画像を参照します。

記事ファイルの例:

```md
---
title: "記事タイトル"
date: "2026-09-20"
excerpt: "記事一覧と検索結果に表示する概要です。"
tags:
  - Next.js
  - TypeScript
sourceUrl: "https://example.com/optional"
---

本文をMarkdownで記述します。

![画像の説明](/images/blog/example.png)
```

`title`、`date`、`excerpt` は必須です。`tags` と `sourceUrl` は省略できます。

## 確認

```bash
npm test
npm run lint
npm run build
```
