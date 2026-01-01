# Data Model: ブログ作成内容の保存

## Draft

- **Purpose**: `/blogs/new`で作成中の下書きを保持する
- **Primary Owner**: ユーザー
- **Key Fields**:
  - `draftId`: 下書き識別子
  - `userId`: 作成者の識別子（ユーザーごとに1件）
  - `content`: 本文の構造化データ（段落・見出し・画像参照）
  - `imageRefs`: 本文内で参照される画像の一覧
  - `updatedAt`: 最終更新時刻
- **Constraints**:
  - ユーザーごとに1件のみ保持する
  - 画像参照は最新の参照に追従する
  - 画像参照が失われた場合は本文から非表示にする

## MediaAsset

- **Purpose**: 下書き内で使用される画像の参照情報を保持する
- **Key Fields**:
  - `assetId`: 画像識別子
  - `userId`: 作成者の識別子
  - `draftId`: 関連する下書き識別子
  - `storageRef`: 画像の参照情報
  - `order`: 本文内の表示順序
  - `updatedAt`: 最終更新時刻

## Relationships

- Draft 1 --- N MediaAsset
- MediaAsset は Draft の imageRefs から参照される

## State Transitions

- `Draft`:
  - 未作成 → 保存済み
  - 保存済み → 更新済み
