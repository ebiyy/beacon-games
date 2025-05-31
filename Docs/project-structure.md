# プロジェクト構造とフォルダ命名戦略

## 推奨プロジェクトフォルダ名

### メインプロジェクト

```
beacon-games/
```

### 理由

1. ブランド名を明確に反映
2. GitHub組織名としても使用可能
3. npm スコープ `@beacon` と一貫性
4. 短く覚えやすい

## プロジェクト構造

```
beacon-games/
├── apps/                      # アプリケーション
│   ├── web/                   # Next.js フロントエンド
│   ├── api/                   # Go バックエンド API
│   └── admin/                 # 管理画面
│
├── packages/                  # 共有パッケージ（monorepo）
│   ├── @beacon/core/          # コアゲームエンジン
│   ├── @beacon/engine/        # レンダリングエンジン
│   ├── @beacon/themes/        # テーマシステム
│   ├── @beacon/ui/            # 共通UIコンポーネント
│   └── @beacon/types/         # 型定義
│
├── services/                  # マイクロサービス
│   ├── game-server/           # ゲームサーバー (Rust)
│   ├── matchmaking/           # マッチメイキング
│   └── analytics/             # 分析サービス
│
├── themes/                    # ゲームテーマ
│   ├── emergency-response/    # 総合緊急対応
│   ├── medical/              # 救急医療
│   ├── fire/                 # 消防
│   └── disaster/             # 災害対応
│
├── tools/                     # 開発ツール
│   ├── theme-generator/       # テーマ生成ツール
│   ├── map-converter/         # 地図データ変換
│   └── scenario-editor/       # シナリオエディタ
│
├── docs/                      # ドキュメント
│   ├── api/                   # API ドキュメント
│   ├── development/           # 開発ガイド
│   └── design/               # デザインドキュメント
│
├── infrastructure/           # インフラ設定
│   ├── kubernetes/           # k8s マニフェスト
│   ├── terraform/            # IaC
│   └── docker/               # Dockerfile
│
└── config/                   # 設定ファイル
    ├── eslint/               # ESLint 設定
    ├── prettier/             # Prettier 設定
    └── typescript/           # TypeScript 設定
```

## Git リポジトリ戦略

### モノレポ構造（推奨）

```bash
# メインリポジトリ
github.com/beacon-games/beacon

# 関連リポジトリ
github.com/beacon-games/lighthouse-engine  # OSS化時に分離
github.com/beacon-games/theme-marketplace  # テーママーケット
github.com/beacon-games/community-themes   # コミュニティテーマ
```

### 開発環境セットアップ

```bash
# ghq を使用した場合
ghq get beacon-games/beacon
cd $(ghq root)/github.com/beacon-games/beacon

# 直接クローン
git clone git@github.com:beacon-games/beacon.git
cd beacon
```

## パッケージ命名規則

### npm パッケージ

```json
{
  "name": "@beacon/core",
  "name": "@beacon/engine",
  "name": "@beacon/theme-medical"
}
```

### Docker イメージ

```
beacon-games/game-server:latest
beacon-games/web-app:latest
beacon-games/api:latest
```

### Kubernetes リソース

```yaml
namespace: beacon-production
deployment: beacon-game-server
service: beacon-api
```

## ファイル命名規則

### TypeScript/JavaScript

```typescript
// コンポーネント: PascalCase
GameMap.tsx
EmergencyUnit.tsx

// ユーティリティ: camelCase
gameHelpers.ts
eventQueue.ts

// 型定義: PascalCase
GameTypes.ts
ThemeInterface.ts

// 定数: UPPER_SNAKE_CASE
gameConstants.ts
```

### 設定ファイル

```
beacon.config.ts        # メイン設定
beacon.theme.json       # テーマ設定
.beacon.env            # 環境変数
```

## 移行手順（現在の tmp から）

```bash
# 1. 新しいリポジトリ作成
cd ~/ghq/github.com/ebiyy/
mkdir beacon-games
cd beacon-games
git init

# 2. 既存ファイルの移動
cp -r ../tmp/Docs ./docs/design/
cp ../tmp/CLAUDE.md ./
cp ../tmp/README.md ./docs/

# 3. 初期構造の作成
mkdir -p apps/{web,api,admin}
mkdir -p packages/@beacon/{core,engine,themes,ui,types}
mkdir -p services/{game-server,matchmaking,analytics}
mkdir -p themes/{emergency-response,medical,fire,disaster}
mkdir -p tools/{theme-generator,map-converter,scenario-editor}

# 4. monorepo セットアップ
npm init -y
npx lerna init
```

## 推奨事項

1. **フォルダ名は `beacon-games` を使用**

   - ブランドと一致
   - 将来の組織名として使用可能

2. **モノレポ構造を採用**

   - パッケージ間の依存関係管理が容易
   - 統一的なビルド・テスト環境

3. **早期に GitHub 組織を作成**

   - `beacon-games` 組織を確保
   - チーム開発の準備

4. **CI/CD パイプラインの早期構築**
   - GitHub Actions でのビルド自動化
   - プレビュー環境の自動デプロイ
