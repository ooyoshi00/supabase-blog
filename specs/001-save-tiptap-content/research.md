# Research: ブログ作成内容の保存

## Decision 1: 保存先と画像管理方針

- **Decision**: 下書きはSupabaseのデータベースに保存し、画像はSupabaseのストレージ参照として管理する
- **Rationale**: 既存依存にSupabaseがあり、DBとストレージを同一基盤で運用できるため
- **Alternatives considered**: ローカルストレージ保存、外部の画像CDNのみで管理

## Decision 2: 下書きの単位

- **Decision**: ユーザーごとに下書きは1件のみ保持し、保存時は既存下書きを更新する
- **Rationale**: `/blogs/new`の利用目的が単一作成フローであり、UXとテストが単純化するため
- **Alternatives considered**: 複数下書きの保持、全ユーザー共通の単一下書き

## Decision 3: 画像参照の更新と欠落時挙動

- **Decision**: 画像は最新参照に追従し、参照が失われた場合は本文から非表示にする
- **Rationale**: 再編集時の最新状態を優先し、欠落時も編集継続できるため
- **Alternatives considered**: 保存時スナップショット固定、欠落時にプレースホルダ表示

## Decision 4: テスト方針

- **Decision**: Vitest + React Testing Libraryで単体/結合テストを追加し、保存・復元の主要導線をカバーする
- **Rationale**: 既存のTypeScript/React構成と親和性が高く、導入コストが低いため
- **Alternatives considered**: E2Eのみ導入、テスト追加を見送る
