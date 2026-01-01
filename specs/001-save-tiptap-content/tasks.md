---

description: "Task list for feature implementation"
---

# Tasks: ブログ作成内容の保存

**Input**: Design documents from `/specs/001-save-tiptap-content/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 本機能ではテスト追加を行う（Vitest + React Testing Library）。

**Organization**: ユーザーストーリーごとに独立実装・独立検証できるように分割する。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並行実行可能（別ファイルで依存なし）
- **[Story]**: 対象のユーザーストーリー（US1, US2, US3）
- すべてのタスクに具体的なファイルパスを含める

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: テスト導入と最小限の開発基盤準備

- [ ] T001 Vitest設定を追加する `vitest.config.ts`
- [ ] T002 テスト初期化を追加する `tests/setup.ts`
- [ ] T003 [P] テスト実行スクリプトと依存を追加する `package.json`
- [ ] T004 [P] テスト用ディレクトリを追加する `tests/unit/.gitkeep`
- [ ] T005 [P] テスト用ディレクトリを追加する `tests/integration/.gitkeep`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのストーリーに共通する基盤整備

- [ ] T006 下書き保存用のテーブル作成を追加する `supabase/migrations/001_create_drafts.sql`
- [ ] T007 [P] Draft/MediaAssetの型定義を追加する `src/lib/drafts/types.ts`
- [ ] T008 [P] Supabaseの下書きリポジトリを追加する `src/lib/drafts/repository.ts`

**Checkpoint**: 基盤整備完了（ユーザーストーリー実装に進める）

---

## Phase 3: User Story 1 - 下書きを保存する (Priority: P1) 🎯 MVP

**Goal**: `/blogs/new`の入力内容を保存し、再訪時に復元できる

**Independent Test**: 入力→保存→再読み込みで内容が復元され、成功フィードバックが表示される

### Tests for User Story 1

- [ ] T009 [P] [US1] 下書きシリアライズの単体テストを追加する `tests/unit/draft-serialization.test.ts`
- [ ] T010 [P] [US1] 保存・復元フローの結合テストを追加する `tests/integration/drafts-save-load.test.tsx`

### Implementation for User Story 1

- [ ] T011 [US1] 下書き保存/取得APIを実装する `src/app/api/drafts/me/route.ts`
- [ ] T012 [US1] 下書き変換ロジックを実装する `src/lib/drafts/service.ts`
- [ ] T013 [US1] クライアント用APIヘルパーを追加する `src/lib/drafts/client.ts`
- [ ] T014 [US1] 画面初期化時の下書き読み込みを実装する `src/app/blogs/new/Editor.tsx`
- [ ] T015 [US1] 保存ボタンと保存処理の連携を実装する `src/app/blogs/new/EditorToolBar.tsx`
- [ ] T016 [US1] 保存成功のフィードバックを実装する `src/app/blogs/new/Editor.tsx`

**Checkpoint**: User Story 1 を単独で検証可能

---

## Phase 4: User Story 2 - 保存失敗時に再試行できる (Priority: P2)

**Goal**: 保存失敗時に編集内容を保持し、再試行できる

**Independent Test**: 保存失敗時に内容が残り、再試行で保存できる

### Tests for User Story 2

- [ ] T017 [P] [US2] 保存失敗時の再試行テストを追加する `tests/integration/drafts-save-failure.test.tsx`

### Implementation for User Story 2

- [ ] T018 [US2] 保存失敗時のエラーメッセージと再試行導線を実装する `src/app/blogs/new/Editor.tsx`
- [ ] T019 [US2] APIエラーレスポンスを統一する `src/app/api/drafts/me/route.ts`

**Checkpoint**: User Story 2 を単独で検証可能

---

## Phase 5: User Story 3 - 画像が正しく復元される (Priority: P3)

**Goal**: 画像の順序と参照が復元時に正しく適用される

**Independent Test**: 複数画像の順序が維持され、欠落参照は非表示になる

### Tests for User Story 3

- [ ] T020 [P] [US3] 画像参照の順序/更新の単体テストを追加する `tests/unit/image-refs.test.ts`

### Implementation for User Story 3

- [ ] T021 [US3] 画像参照の順序・最新参照反映を実装する `src/lib/drafts/service.ts`
- [ ] T022 [US3] 参照欠落時に画像を除外する処理を実装する `src/lib/drafts/service.ts`
- [ ] T023 [US3] 復元画像の順序適用を実装する `src/app/blogs/new/Editor.tsx`

**Checkpoint**: User Story 3 を単独で検証可能

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: ドキュメント整備と検証手順の明確化

- [ ] T024 [P] クイックスタートの検証手順を更新する `specs/001-save-tiptap-content/quickstart.md`
- [ ] T025 [P] API契約の補足メモを追加する `specs/001-save-tiptap-content/contracts/README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし
- **Foundational (Phase 2)**: Setup完了が前提
- **User Stories (Phase 3+)**: Foundational完了が前提
- **Polish (Phase 6)**: 主要ストーリー完了後

### User Story Dependencies

- **User Story 1 (P1)**: Foundational完了後に開始、他ストーリーへの依存なし
- **User Story 2 (P2)**: Foundational完了後に開始、US1とUI共有はあるが独立検証可能
- **User Story 3 (P3)**: Foundational完了後に開始、US1の保存/復元が前提

### Parallel Opportunities

- Phase 1の [P] タスクは並行実行可能
- Phase 2の [P] タスクは並行実行可能
- User Story内のテストは [P] タスクとして並行実行可能

---

## Parallel Example: User Story 1

```bash
Task: "下書きシリアライズの単体テストを追加する tests/unit/draft-serialization.test.ts"
Task: "保存・復元フローの結合テストを追加する tests/integration/drafts-save-load.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1（Setup）
2. Phase 2（Foundational）
3. Phase 3（US1）
4. US1のみを独立検証

### Incremental Delivery

1. Setup + Foundational 完了
2. US1 完了 → 検証
3. US2 完了 → 検証
4. US3 完了 → 検証

