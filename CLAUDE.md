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

### 必須のGitHub Actions

1. **Renovate** - 週1バッチ更新、minor自動マージ、major手動
2. **コード品質** - lint/typecheck/testの並列実行（ci.yml参照）
3. **size-limit** - +10KB以上で警告
4. **CodeQL** - 高・重大脆弱性のみ

### 推奨

- PRサイズラベラー、Lighthouse CI（週1）

### 避けるべきこと

- 過度な自動化、厳格リント、reviewdog系ツール

### 開発速度を優先する設定

- テスト最小限、リント自動修正優先、PR即マージ、rollback可能なデプロイ

### 現在のCI最適化ポイント

1. **ジョブ並列化** - lint/typecheck/testを並列実行、小規模PRは統合も検討
2. **キャッシュ戦略** - pnpmキャッシュ済み、ビルドアーティファクトも追加可能
3. **選択的実行** - `paths-ignore`で関連ファイルのみテスト
4. **高速化** - `pnpm test --reporter=dot`で簡潔出力

## 効率的な開発フロー

### 短期収益を最大化する開発戦略

1. **MVP優先アプローチ** - 最小機能で市場投入→フィードバック反映→収益化機能優先
2. **技術的負債の管理** - セキュリティ以外は許容、`// TODO: [TECH-DEBT]`でマーク
3. **開発速度のKPI** - PR:24h以内、新機能:2週間、バグ修正:1-3日
4. **コスト最適化** - 無料枠/OSS活用、自動スケーリング、ローカル開発優先

## セルフデバッグチェックリスト

### 問題解決時の確認事項

1. **複数の情報源を確認** - ツール出力とユーザー報告の両方を重視
2. **段階的検証** - 最小実装→動作確認→機能追加の順序を守る
3. **思い込みを避ける** - データに基づいて判断、**Playwrightのスクリーンショットは疑わない**
4. **ユーザーフィードバック優先** - ユーザーの体験報告を技術的推測より重視
5. **基本動作確認** - 純粋なHTML/JS検証でフレームワーク問題を切り分け
6. **開発サーバーの事前起動** - Playwright使用前に`nohup pnpm dev > /tmp/dev.log 2>&1 &`でバックグラウンド起動
