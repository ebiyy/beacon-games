# 現在のスプリント

## Week 1 (2025年5月31日〜)

### 今日のタスク

- [x] プロジェクト基盤構築
- [x] 開発環境セットアップ
- [x] CI/CD基本設定 (GitHub Actions)
- [x] 依存関係管理の最適化（Renovate/Dependabot対応）
- [x] バージョン戦略の策定と実装
- [x] GitHub Actions拡張設定（バンドルサイズ監視、PRラベラー、CodeQL）
- [x] 開発効率化ガイドライン追加（CLAUDE.md更新）

### 今週の目標

- [x] GitHub Actions CI/CDパイプライン構築
- [ ] MapLibre GL JS地図表示PoC ← 次はここ
- [ ] Next.js基本画面実装（進行中）
- [ ] WebSocketリアルタイム通信デモ（基本実装済み）

### ブロッカー

- なし

### 進捗メモ

- モノレポ構造完成
- pnpmに統一
- 基本的な開発環境構築完了
- CI/CDパイプライン構築完了（lint、test、type check）
- Renovate自動更新設定完了
- Next.js App Router基本実装完了
- 依存関係管理最適化完了
  - Renovate/Dependabot連携確立
  - バージョン戦略策定（安定性重視）
  - 自動PR処理フロー確立
- GitHub Actions拡張完了（2025/05/31 追加）
  - バンドルサイズ監視（size-limit-action）
  - PRサイズラベラー（XS〜XL自動分類）
  - CodeQLセキュリティスキャン（高・重大のみ）
  - Renovate週1バッチ更新に最適化
- プロフィット重視の開発ガイドライン策定
  - MVP優先アプローチ
  - 技術的負債の戦略的管理
  - 開発速度KPI設定（24時間以内のPRマージ等）
