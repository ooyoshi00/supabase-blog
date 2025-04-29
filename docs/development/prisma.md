# Prisma Client を使用して Vercel の PostgreSQL と通信する手順

このドキュメントでは、Prisma Client を使用して Vercel の PostgreSQL データベースと通信する手順を説明します。

## ステップ 1: Prisma のセットアップ

1. Prisma CLI をインストール

   ```bash
   npm install @prisma/client --save-dev
   ```

2. prismaの初期化

   ```bash
   npm prisma init
   ```

## ステップ 2: データベース接続の設定

1. Vercel ダッシュボードから PostgreSQL データベースの接続情報を取得
2. プロジェクトのルートディレクトリに .env ファイルを作成し、以下のようにデータベース接続情報を追加
    ```.env
    DATABASE_URL="postgresql://ユーザー名:パスワード@ホスト名:ポート/データベース名"
    ```
3. schema.prisma ファイルを開き、datasource ブロックの url を更新
    ```prisma
    datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
    }
    ```

## ステップ 3: モデルの定義とマイグレーション

1. schema.prisma ファイルにモデルを定義
    ```prisma
    model User {
    id    Int     @id @default(autoincrement())
    name  String
    email String  @unique
    }
    ```
2. マイグレーションを作成してデータベースに適用
    ```bash
    npx prisma migrate dev --name init
    ```

## ステップ 4: Prisma Clientの使用

1. インスタンスの生成

    ```ts
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();
    ```

2. データベースからデータの取得

    ```ts
    // userというテーブルから全てのデータを取得する場合
    const allUsers = await prisma.user.findMany();
    ```

## 設定ファイル等

- prisma/
    - prisma.schema: prismaのスキーマファイル
    - migrations/: `prisma migrate`コマンドにより生成されるファイル群
- .env: 環境変数ファイル(`DATABASE_URL`など)


## 参考
https://zenn.dev/msy/articles/8d991c79b739aa