# 完了したタスク

## 2025年5月31日 完了分

### 1. プロジェクト基盤構築

- [x] Gitリポジトリ初期化
- [x] GitHubリポジトリ作成（https://github.com/ebiyy/beacon-games）
- [x] 初回コミット
- [x] プロジェクト分析
- [x] Turborepoによるモノレポ構造の初期化
- [x] 基本的なディレクトリ構造の作成
  - `apps/web` - Next.jsフロントエンド
  - `apps/api` - バックエンドAPI
  - `packages/core` - 共通ロジック
  - `packages/engine` - ゲームエンジン
  - `packages/themes` - テーマプラグイン
  - `packages/ui` - 共通UIコンポーネント

### 2. 開発環境セットアップ

- [x] TypeScript設定
  - ルートレベルの共通設定
  - 各パッケージの個別設定
- [x] ESLint/Prettier設定
  - ルートレベルの設定
  - 各アプリケーションの設定
  - フォーマット統一
- [x] Git hooks (Husky)
  - pre-commitフック設定
  - lint-staged統合
- [x] Tailwind CSS設定
  - 共通のデザイントークン
  - カラーパレット定義
- [x] Fastify + WebSocketサーバー基本実装
  - ヘルスチェックエンドポイント
  - WebSocket接続サンプル
- [x] pnpmによるモノレポ管理
  - packageManagerフィールド設定
  - .npmrc設定
  - ワークスペース設定

### 3. パッケージ初期実装

- [x] @beacon-games/core
  - 基本的な型定義（Position, GameEvent, Unit, Player, GameState）
  - 定数定義（GAME_CONSTANTS, EVENT_TYPES, UNIT_TYPES）
  - ユーティリティ関数（calculateDistance, generateId）
- [x] tsup設定
  - 各パッケージのビルド設定
  - CommonJS/ESM両対応
