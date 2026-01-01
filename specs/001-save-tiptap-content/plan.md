# Implementation Plan: ブログ作成内容の保存

**Branch**: `001-save-tiptap-content` | **Date**: 2025-12-31 | **Spec**: `specs/001-save-tiptap-content/spec.md`
**Input**: Feature specification from `/specs/001-save-tiptap-content/spec.md`

## Summary

`/blogs/new` のTiptap入力内容（本文・画像参照）をユーザーごとに1件の下書きとして保存し、再訪時に復元する。保存失敗時は編集内容を保持して手動再試行とし、画像は最新参照に追従、参照消失時は非表示にする方針で実装する。

## Technical Context

**Language/Version**: TypeScript 5.3.3  
**Primary Dependencies**: Next.js 15.3, React 19, @supabase/supabase-js, Tiptap 3  
**Storage**: Supabase（データベース + 画像ストレージ）  
**Testing**: Vitest + React Testing Library（本機能で導入）  
**Target Platform**: Web（ブラウザ）  
**Project Type**: Web（Next.js App Router）  
**Performance Goals**: 保存結果のフィードバックを5秒以内に表示  
**Constraints**: ユーザーごとに下書き1件、画像は最新参照に追従、参照消失時は非表示  
**Scale/Scope**: 1ユーザーあたり下書き1件、同時アクティブ100人規模を想定

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] 仕様・計画・成果物は日本語で記載する
- [x] 既存スタック（Next.js + Supabase）を前提に設計する
- [x] 重要ロジックのテスト追加方針を含める
- [x] 認証前提・入力検証・秘密情報非保存の方針を維持する

## Project Structure

### Documentation (this feature)

```text
specs/001-save-tiptap-content/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── blogs/
│   │   ├── new/
│   │   │   ├── page.tsx
│   │   │   ├── Editor.tsx
│   │   │   └── EditorToolBar.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       └── (新規: 下書き保存/取得のルート)
└── lib/

tests/
├── unit/
└── integration/
```

**Structure Decision**: 単一のNext.jsアプリ構成を維持し、APIルートは`src/app/api`配下に追加する。

## Phase 0: Outline & Research

- 既存スタックでの下書き保存・画像参照管理の方針を整理
- 保存/取得のAPI契約を最小構成で確定
- テスト導入の最小構成（Vitest + React Testing Library）を決定

**Output**: `specs/001-save-tiptap-content/research.md`

## Phase 1: Design & Contracts

- `data-model.md`: Draft / MediaAsset の属性・関係・制約を定義
- `contracts/`: 下書き保存・取得のAPI契約（OpenAPI）を定義
- `quickstart.md`: 開発・検証の最短手順を記載
- エージェントコンテキスト更新（必要な技術情報のみ）

**Output**: `data-model.md`, `contracts/*`, `quickstart.md`

## Phase 1: Constitution Re-check

- [x] 日本語ドキュメント維持
- [x] 既存スタック尊重（追加依存はテスト用途のみ）
- [x] テスト追加方針が明確
- [x] セキュリティ/入力検証の方針を維持

## Phase 2: Implementation Planning

- 画面側の保存/復元フロー整理
- APIルートとSupabase永続化処理の実装順序決定
- テスト対象の優先順位を確定

