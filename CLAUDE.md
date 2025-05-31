# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定 / Language Settings

**重要**: このプロジェクトでは日本語でのコミュニケーションを使用してください。

- すべてのやり取りは日本語で行う
- コードのコメントは英語でOK
- ドキュメント作成時は指定がない限り日本語を使用

## Project Overview

This is a real-time emergency response simulation game platform project that enables rapid deployment of different themed emergency management games (similar to 112 Operator). The project contains business development plans from two AI models with different approaches:

- **Model A (NERVE)**: Ambitious unicorn-focused approach with neural/nervous system branding
- **Model B (MetroHelix)**: Pragmatic implementation-focused approach with urban DNA analysis theme

## Core Architecture Principles

### Technical Foundation

- **Single Game Engine**: One core engine that supports multiple emergency response themes
- **Plugin Architecture**: Theme-specific content loaded as plugins
- **Web-First Development**: Browser-based for instant accessibility
- **Real-time Operations**: WebSocket/Socket.io for multiplayer and real-time events
- **Data Integration**: OpenStreetMap and real-world data sources

### Key Design Goals

- Theme deployment time: 3 weeks → 3 days
- Operating cost reduction: 70% compared to Unity
- Market deployment: 10x faster
- Accessibility: One-click play in browsers

## Technology Stack

### Frontend

- React/Next.js with TypeScript
- WebGL for 2D/3D rendering
- State management with event sourcing pattern

### Backend

- Microservices architecture
- WebAssembly (Rust) for performance-critical components
- API-driven for external integrations

### Infrastructure

- Kubernetes deployment on AWS/GCP
- Real-time communication via WebSocket
- OpenStreetMap integration

## Development Approach

### When implementing features:

1. Consider both Model A and Model B perspectives
2. Prioritize web performance and instant playability
3. Design for theme extensibility from the start
4. Focus on real-world data integration capabilities

### Business Context

- Target: 3 titles in 24 months
- Revenue goal: 300M yen ARR
- Scale: 10,000-100,000 DAU support
- Dual market: Entertainment + Training/Education

## CI/CD Guidelines (プロフィット重視の実装)

### 必須のGitHub Actions (最小限かつ効果的)

#### 1. 依存関係の自動更新

- **Renovate** (既に導入済み) - 週1回のバッチ更新で騒がしさを削減
  - `schedule: ["before 09:00 on monday"]`
  - `minor`アップデートのみ自動マージ
  - `major`は手動レビュー

#### 2. コード品質の維持

```yaml
name: ci
on: [push, pull_request]

jobs:
  lint_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - name: Cache
        uses: actions/cache@v4
        with:
          path: ~/.pnpm-store
          key: ${{ runner.os }}-pnpm-${{ hashFiles('pnpm-lock.yaml') }}
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --run
```

#### 3. バンドルサイズ監視

- **ai/size-limit-action** - PRコメントでサイズ増加を通知
  - 閾値：+10KB以上で警告（ゲームアセットを考慮）

#### 4. セキュリティスキャン

- **CodeQL** - 重大な脆弱性のみに絞って運用
  - JavaScriptとTypeScriptのみスキャン
  - 高・重大レベルのみ通知

### 推奨（余裕があれば追加）

- **pull-request-size-labeler** - PRサイズの可視化（XS〜XXL）
- **Lighthouse CI** - パフォーマンススコアの定点観測（週1回）

### 避けるべきこと

- 過度な自動化（全てのPRに10個以上のチェック）
- 厳格すぎるリント設定（警告レベルでビルド失敗）
- reviewdog系のツール（2025年3月のセキュリティインシデントのため）

### 開発速度を優先する設定

- テストは最小限（クリティカルパスのみ）
- リントは自動修正可能なものを優先
- PRマージは基本的に開発者を信頼（管理者承認不要）
- デプロイは自動化しつつ、rollback可能な仕組みを確保

### 現在のCI最適化ポイント

既存の`.github/workflows/ci.yml`は効率的だが、さらなる高速化が可能：

1. **ジョブの並列化を最大化**

   - 現在は3つの独立したジョブ（lint, typecheck, test）で良い設定
   - ただし、小規模PRでは統合して実行時間を短縮することも検討

2. **キャッシュ戦略の最適化**

   - pnpmキャッシュは既に設定済み（良い）
   - ビルドアーティファクトもキャッシュ可能

3. **選択的実行の導入**

   - パス指定で関連ファイルのみテスト
   - `paths-ignore`で不要な実行を削減

4. **高速化オプション**
   ```yaml
   - name: Run tests
     run: pnpm test --reporter=dot # 簡潔な出力で高速化
   ```

## 効率的な開発フロー

### 短期収益を最大化する開発戦略

1. **MVP優先アプローチ**

   - 最小限の機能で市場投入
   - ユーザーフィードバックを即座に反映
   - 収益化機能を最優先で実装

2. **技術的負債の管理**

   - 意図的な技術的負債は許容（後でリファクタリング）
   - ただし、セキュリティとデータ整合性は妥協しない
   - 負債は`// TODO: [TECH-DEBT]`で明示的にマーク

3. **開発速度のKPI**

   - PRのマージまでの時間：24時間以内
   - 新機能のリリースサイクル：2週間
   - バグ修正：重大度に応じて1-3日

4. **コスト最適化**
   - 無料枠・OSSツールを最大限活用
   - クラウドリソースは自動スケーリング設定
   - 開発環境はローカル優先（クラウド開発環境は避ける）
