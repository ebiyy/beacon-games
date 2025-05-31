# Beacon Games

リアルタイム緊急対応シミュレーションゲームプラットフォーム

## 依存関係管理

- **Renovate**: pnpmパッケージの自動更新を管理
- **Dependabot**: GitHub Actionsの更新のみを管理（pnpm非対応のため）

## セットアップ

このプロジェクトはpnpmを使用します。

```bash
# pnpmのインストール（まだの場合）
mise use --global pnpm@latest

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## パッケージ管理

**重要**: このプロジェクトではpnpmのみを使用してください。npmやyarnは使用しないでください。

```bash
# パッケージの追加
pnpm add <package-name>

# 開発依存関係の追加
pnpm add -D <package-name>

# 特定のワークスペースにパッケージを追加
pnpm add <package-name> --filter @beacon-games/web
```

## プロジェクト構造

- `apps/web` - Next.jsフロントエンド
- `apps/api` - Fastify APIサーバー
- `packages/core` - 共通型定義とユーティリティ
- `packages/engine` - ゲームエンジン
- `packages/ui` - 共通UIコンポーネント
- `packages/themes` - テーマプラグイン
