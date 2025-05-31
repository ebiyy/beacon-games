# Webリアルタイムシミュレーション基盤 技術設計ドキュメント (CTO草案)

---

## 1. 目的とビジョン

* **目的**: 112‑Operator 型リアルタイム・リソースマネジメントゲームを Web 技術で横展開できる共通基盤を構築し、テーマ変更による迅速な新規タイトル投入を可能にする。
* **北極星指標**: “クリック⇨3 秒以内にプレイ開始、60 FPS 持続、月次アップデート無ダウンタイム”
* **事業ゴール**: 24 か月内に 3 タイトル、年間 ARR 3 億円を達成。

---

## 2. 対象タイトルと代表要件

| 名称                    | 主テーマ     | 固有要件              | リリース優先度 |
| --------------------- | -------- | ----------------- | ------- |
| Crisis Command        | 多災害レスキュー | 天候API、リアルタイム地震データ | ★★★     |
| Wildlife Guard        | 自然保護     | 衛星写真タイル、動物AI      | ★★☆     |
| Cyber Shield Operator | CSIRT    | ネットワーク拓撲UI、脅威ログ   | ★☆☆     |

共通機能: 地図描画、ユニット経路探索、インシデント処理、LiveOps／A/B 配信。

---

## 3. アーキテクチャ概要

```
┌────────────┐  Service Worker  ┌──────────┐
│   React UI + Deck.gl │◀─────────────┤  Asset CDN │
└────────────┘                 └──────────┘
        ▲ WebAssembly (Rust)            ▲
        │ SharedArrayBuffer              │
┌────────────┐  WebSocket   ┌────────────┐
│  Incident   │────────────▶│   Sync     │
│  Engine     │             │  Gateway   │
└────────────┘             └────────────┘
        ▲ gRPC                         ▲
┌────────────┐             ┌────────────┐
│ Pathfinding │◀──────────▶│  Event Bus │(NATS)
└────────────┘             └────────────┘
        ▲                         ▲
┌────────────┐           ┌────────────────┐
│ PostGIS +  │  CDC      │  Data Lake     │
│ RedisJSON  │──────────▶│ (ClickHouse)   │
└────────────┘           └────────────────┘
```

---

## 4. 技術スタック選定

| レイヤ     | 採用技術                                     | 主要理由                    |
| ------- | ---------------------------------------- | ----------------------- |
| クライアント  | **React 19**, Vite, Zustand              | 既存フロントスキル資産活用／DX 高      |
| 地図描画    | MapLibre GL JS + WebGL2 / **WebGPU (β)** | OSM ベクタタイルをネイティブ扱い      |
| 描画補助    | Deck.gl InstancedLayer                   | 万単位アイコンでも 60 FPS        |
| 計算モジュール | Rust + wasm‑bindgen + Rayon              | 高速並列 A\* ／シミュレーション      |
| オフライン   | PWA / Service Worker v3                  | ホットアップデート・キャッシュ         |
| デスクトップ  | **Tauri** (Rust Core)                    | 同一コードベース、20 MB 以下       |
| 通信      | WebSocket (uWebSockets.js) + ProtoBuf    | 双方向差分同期・軽量              |
| BackEnd | Go 1.23 マイクロサービス                         | gRPC x Kubernetes       |
| Stream  | NATS JetStream                           | スケールアウト & at‑least‑once |
| DB      | PostgreSQL 16 + PostGIS, RedisJSON       | 位置情報／高速 K‑V             |
| 分析      | ClickHouse + Grafana Tempo               | 専用 OLAP                 |
| CI/CD   | GitHub Actions → ArgoCD                  | 全環境 GitOps              |

---

## 5. コアモジュール設計

### 5.1 Incident Engine

* YAML/JSON で状態遷移を宣言的定義。
* 条件演算は LuaJIT→WASM でホットプラグ。

### 5.2 Pathfinding & AI

* 道路グラフをタイル毎にプリロード。
* マルチスレッド A\* (Rayon) + ALT ヒューリスティック。
* 移動コストは気象/交通をリアルタイム参照。

### 5.3 Map Layer Abstraction

* Abstract Map Adaptor で OSM / 衛星 / 拡張タイルを差し替え可能。
* UI はスタイル JSON だけで再テーマ化。

### 5.4 Asset & Theme Layer

* Lottie / SVG スプライトを theme‑id で動的ロード。
* I18n は ICU MessageFormat、音声は TTS キャッシュ。

---

## 6. 外部 API & データフロー

| API               | 用途    | キャッシュ戦略        |
| ----------------- | ----- | -------------- |
| OpenWeather / 気象庁 | 天候・気温 | 5 min SWR      |
| USGS / 地震速報       | 災害トリガ | Push (Webhook) |
| GTFS (交通)         | 遅延シミュ | 1 h LRU        |
| Mapbox Satellite  | 衛星タイル | CDN edge cache |

---

## 7. CI/CD & QA

1. **Mono‑repo (Turborepo)** でフロント／バックエンド／Rust を統合。
2. PR マージで GitHub Actions →

   * Rust unit test & wasm‑pack
   * Front lint/Vitest
   * Go test & staticcheck
3. ArgoCD が dev/stg/prod に Progressive Delivery (Argo Rollouts)。
4. **Playwright E2E**: シナリオ 50 本 / コンカレント 10。
5. Chaos Mesh によるレイテンシ注入 → SLO 監視。

---

## 8. セキュリティ & ガバナンス

* SLSA Level 3 ビルドパイプライン。
* OAuth2/OIDC (Auth0) + WebAuthn (FIDO2) ログイン。
* BackEnd IAM は **OPA Gatekeeper** でポリシー as code。
* 個人情報は KMS 暗号化、GDPR/JIS Q 15001 準拠。

---

## 9. 人員計画 (初年度)

| ロール             | 人数 | 主担当                          |
| --------------- | -- | ---------------------------- |
| フロントエンド         | 2  | React, Deck.gl, 状態管理         |
| Rust/WASM       | 2  | Pathfinding, Incident Engine |
| Go/Infra        | 2  | API, DevOps, Observability   |
| Game Designer   | 1  | インシデント脚本, バランス               |
| Product Manager | 1  | スプリント管理, KPI 分析              |
| QA / SRE        | 1  | E2E, SLO 設計                  |

---

## 10. スケジュールフェーズ (MVP1基準)

| フェーズ               | 月数        | マイルストーン                           |
| ------------------ | --------- | --------------------------------- |
| 0. Kick‑off        | 0.5       | 仕様確定, リポジトリ準備                     |
| 1. Core Engine PoC | 1.5       | Rust A\* & マップ描画 60 FPS           |
| 2. MVP             | 3         | Crisis Command α版, Pathfinding v1 |
| 3. β & Load Test   | 2         | 同時 5k ユーザー耐性                      |
| 4. リリース v1         | 1         | PWA + Tauri 配信                    |
| 5. Theme Swap      | 2         | Wildlife Guard プロト                |
| **計**              | **10 ヶ月** |                                   |

---

## 11. コスト試算 (12 か月)

| 項目                         | 月額         | 年額           |
| -------------------------- | ---------- | ------------ |
| クラウド (GKE, Cloud SQL, CDN) | 80 万円      | 960 万円       |
| Mapタイル課金                   | 20 万円      | 240 万円       |
| API サブスク (気象等)             | 10 万円      | 120 万円       |
| 人件費 (8 名)                  | 700 万円     | 8,400 万円     |
| その他 (TTS, SaaS)            | 15 万円      | 180 万円       |
| **合計**                     | **825 万円** | **9,900 万円** |

---

## 12. リスク & 対策

| リスク                  | 影響       | 対策                  |
| -------------------- | -------- | ------------------- |
| WASM マルチスレッド iOS 非対応 | モバイル性能低下 | サーバーオフロード + ストリーム描画 |
| Map タイル料高騰           | OPEX 増   | 独自タイル生成パイプライン構築     |
| Unity/競合の先行          | シェア獲得失敗  | Web 即時体験 + 教育連携差別化  |
| リソース集中で技術負債          | 開発速度低下   | 四半期アーキレビュー / ADR 運用 |

---

## 13. 将来展望

* **WebGPU 本格対応**で GPU パーティクルや 3D 軽量演出を統合。
* **生成 AI** による音声・イベントテキスト動的生成でコンテンツコスト削減。
* **B2B 訓練ツール**への OEM 提供で ARR 多角化。

---

© 2025 Project Aether Studios  (Internal Draft)

---

## 14. 初月タスクブレークダウン（Day 1–30）

### Week 1 (Day 1–7)

* **Day 1–2**   Kick‑offワークショップ、技術選定最終確定、リポジトリ／ブランチ運用策定。Turborepo モノレポを初期化。
* **Day 3**     Terraform で Dev GKE クラスタをブートストラップ。GitHub Secrets 登録、CI スケルトンをプッシュ。
* **Day 4–5**  Vite + React スキャフォールド、MapLibre で東京 10km² タイルを60 FPS 表示。wasm‑bindgen "hello" を組込み。
* **Day 6**     Rust ワークスペース生成、A\* PathFinder v0.1（4方向グリッド）をRayon並列化。
* **Day 7**     Dev レビュー：コーディング規約・ADR テンプレート合意。

### Week 2 (Day 8–14)

* **Day 8–9**  Service Worker POC：アセットキャッシュとホットアップデート試験。
* **Day 10–11** Go 製 WebSocket Gateway を実装。React Hook で接続維持とリトライ。
* **Day 12**    PostGIS & RedisJSON スキーマ設計、DB マイグレーションツール導入。
* **Day 13**    ClickHouse テレメトリ基盤を ArgoCD でデプロイ。
* **Day 14**    スプリントデモ：FPS/メモリ測定し初期ベンチマーク確定。

### Week 3 (Day 15–21)

* **Day 15–16** OSM 5 km グラフ取り込み、PathFinder v0.2 実装 & wasm ベンチ。
* **Day 17**    Incident Engine スケルトン（YAML ローダ + 状態遷移）を Rust で構築。
* **Day 18**    Deck.gl でユニット instancing, ドラッグ&ドロップ UI, インシデントカード表示。
* **Day 19**    Observability: Sentry + Grafana Tempo 導入、フロント/バックエンド Trace 取得。
* **Day 20–21** Hardening：ESLint/Prettier/Dependabot、CI にペンテストジョブ追加。

### Week 4 (Day 22–30)

* **Day 22–23** OpenWeather API 統合、天候係数を PathCost へ適用、UI オーバレイ。
* **Day 24–25** IndexedDB にソルブ済みインシデントを保存しオフライン同期 POC。
* **Day 26**    Auth0 Dev テナントで OAuth2/OIDC, トークンを Gateway まで伝搬。
* **Day 27–28** k6 で 100 同時ブラウザ負荷試験、レイテンシ分布を収集し対策リスト化。
* **Day 29**    リスクレビュー＆ロードマップ更新、投資家向け進捗デック作成。
* **Day 30**    MVP α Gate Review：次フェーズ Go/No‑Go 決定、タスクロールオーバー。

**月末成果物**

* PoC リポジトリ & Dev クラスタ稼働
* MVP α版 インタラクティブデモ動画（<=3 分）
* ADR 5 本 & ベンチマークレポート

---

## 15. MetroHelix デザイン指針 & CDO 提言（Design v0.1）

### 15.1 ブランド・アイデンティティ

| 項目          | 方針                                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **ブランドコア**  | “Metro(都市) の DNA を解析し、再構築する” 体験を視覚化                                                                                          |
| **タグライン**   | *Decode the City. React in Real‑Time.*                                                                                       |
| **ロゴ初期案**   | 円柱螺旋を 45° に倒し、ノード接続線で地下鉄路線図を暗示。メインシェイプはシンプルな二重螺旋「M/H」を兼ねる。                                                                   |
| **カラーパレット** | `HelixRed #EC3A4E` (Primary Alert)、`UrbanSky #165EFF` (Primary Info)、`Concrete #26292E` (BG)、`SignalWhite #F5F7FA` (Surface) |
| **トーン&マナー** | “緊急感 × 都市クリーンテック” — 無機質な UI にワンポイントの警戒色／マイクロアニメで息を吹き込む                                                                       |

### 15.2 デザイン原則 (MetroHelix DNA)

1. **Clarity First** — 情報密度>演出。1 スクリーンに最大 3 レイヤー視覚階層。
2. **Immediate Feedback** — 50 ms 以内に視覚・音で応答。
3. **Spatial Context** — 常に地図とユニットアイコンの位置関係を迷わせない。
4. **Accessible Intensity** — 緊急色は色弱対応＋モーション併用で冗長化。

### 15.3 デザインシステム構築計画

| フェーズ | Deliverable                              | ツール                                |
| ---- | ---------------------------------------- | ---------------------------------- |
| DS‑0 | Design Token 定義 (色/タイポ/余白/影)             | Style Dictionary → Tailwind Config |
| DS‑1 | Figma UI Kit (Atoms〜Organisms)           | Figma                              |
| DS‑2 | Storybook + Chromatic Visual Regression  | React 19                           |
| DS‑3 | Map Theme Manifest (JSON) — 路線色・ヒートマップ係数 | 自前 CLI                             |

### 15.4 タイポグラフィ & アイコン

* **和文**: Noto Sans JP (閲覧性) / **欧文**: Inter Variable (UI).
* 数字は Tabular Lining を強制でカウンター表示ブレなし。
* アイコン: Lucide + カスタム 16px グリッド、SVG ストローク 1.5px 固定。

### 15.5 カラーユースケース

| カテゴリ              | 色               | 目的     | コントラスト比目標 |
| ----------------- | --------------- | ------ | --------- |
| Critical Incident | HelixRed        | 即時注意喚起 | ≥ 4.5:1   |
| Info Incident     | UrbanSky        | 通知系    | ≥ 3.0:1   |
| Unit Ready        | Emerald #00C48C | 正常     | ≥ 3.0:1   |
| Disabled          | Concrete 60%    | 非活性    | N/A       |

### 15.6 モーション & マイクロインタラクション

| 要素                 | アニメーション指針                           | 実装                                            |
| ------------------ | ----------------------------------- | --------------------------------------------- |
| Incident Spawn     | 120ms ease‑out zoom + glow          | Framer Motion                                 |
| Unit Dispatch Drag | 8px shadow raise, cursor snap       | Framer + Pointer Events                       |
| Map Zoom           | `easeInOutQuad 250ms` for step zoom | Deck.gl Controller                            |
| Alert Pulse        | 1s sine‑wave opacity                | CSS Keyframe (prefers-reduced-motion respect) |

### 15.7 アクセシビリティ & ローカライズ

* **WCAG 2.2 AA** 遵守、キーボードループ & ARIA Live Region。
* **Color‑Blind Safe** パレット (Sim Daltonism シミュ)。
* **多言語**: ICU + CLDR; レイアウト変化は Auto Layout で割付。

### 15.8 オーディオ UX

* 緊急度マッピング: Critical=Buzzer, Major=Beep, Minor=Soft Click。
* **キャプション**: 通報音声は WebVTT で同期字幕; テキスト通報は TTS fallback。

### 15.9 マーケティング & ブランド資産

* **Landing Page**: Hero Lottie (helix morph → 地図)。
* **OG 画像**: ダーク BG + HelixRed スパイライン。
* **Booth Material**: Map heatmap を半透明アクリル板印刷し奥行き演出。

### 15.10 次アクション (30 Days)

1. Figma フレームワーク起票 → Token Export PoC (Day 3)。
2. ロゴ v1.0 & アニメーションバリアント作成 (Day 7)。
3. Storybook & ThemeProvider 統合 (Day 14)。
4. Accessibility Audit (Day 25)。
5. カスタム Map Style JSON 公開 (Day 28)。

---

© 2025 Project Aether Studios  / Chief Design Office Draft

---

## 16. CBO Critical Branding Insights & Recommendations (v0.1)

### 16.1 Brand North Star & Promise

| 項目                 | 提言                                                        |
| ------------------ | --------------------------------------------------------- |
| **Brand Essence**  | “Decode & Empower Cities” ― 都市の潜在データを解読し、行動変革を促すプラットフォーム。 |
| **Brand Promise**  | 「あなたの決断が、都市を動かす。」ユーザー主体でリアルタイムに世界を変える能動感を保証。              |
| **Emotional Hook** | 高揚感 (Adrenaline) × 貢献感 (Purpose) の両立。                     |

### 16.2 Market Positioning & Differentiation

1. **Category Creation vs. Red Ocean**

   * 単なる“運営シム”ではなく **“Urban Decision Engine”** と新カテゴリを宣言し競合比較を避ける。
2. **3 つの差別化軸**

   * *Instant Playability* (Web)
   * *Authentic Data* (外部 API 活用)
   * *Modular Storyverse* (Theme Swap)
3. **Competitor Mapping**: City Skylines / SimCity は Sandbox; 112 Operator は PC niche; MetroHelix は【Real Data × Web 即時】で未充足領域を占有。

### 16.3 Brand Architecture (Long‑Term)

```
MetroHelix (Masterbrand)
├── Helix Play (B2C Game Layer)
│      ├── Crisis Command
│      ├── Wildlife Guard
│      └── Cyber Shield Operator
└── Helix Pro (B2B Training SaaS)
       ├── Helix Pro Responder (自治体)
       └── Helix Pro Logistics (3PL)
```

* **Masterbrand 戦略**で“Helix”の価値を蓄積。サブブランドは接尾辞で機能分化。
* **ブランド伸張阻害**を防ぐため、アイコン・パレットは HelixRed / UrbanSky のコアのみ維持し、子ブランドでサブカラー拡張。

### 16.4 Tone & Voice

| シーン    | Tone                   | Voice Guide (JP/EN)                |
| ------ | ---------------------- | ---------------------------------- |
| マーケ素材  | Energetic & Bold       | 「都市が、目を覚ます。」 / "Awaken the City."  |
| ゲーム内UX | Direct & Assuring      | 「すぐに対応してください」 / "Take action now." |
| B2B提案  | Confident & Insightful | データドリブンな裏付け＋ケース実績を強調               |

### 16.5 Go‑To‑Market Roadmap (Brand Layer)

| フェーズ  | KPI                  | アクション                                                   |
| ----- | -------------------- | ------------------------------------------------------- |
| Pre-α | Waitlist 3k          | Landing Page + Behind-the-scenes Devlog (Medium / Note) |
| β公開   | DAU 10k / Discord 5k | Influencer シミュ配信 + Community Challenge (最速クリア)          |
| GA    | LTV > ¥5,000         | 教育機関とのタイアップ教材、CSR コラボ発表                                 |

### 16.6 Brand Risk Radar

| リスク          | 影響    | 緩和策                              |
| ------------ | ----- | -------------------------------- |
| “災害ゲー” 不謹慎批判 | PR炎上  | 教訓・教育性を前面、監修者クレジットを明記            |
| データ利用ポリシー違反  | 法務コスト | API T\&C 准拠チェックリスト、LegalレビューGate |
| 名称 & ロゴ類似他社  | TM 紛争 | 商標先行調査 (JP/US/EU) → TM 出願 Day 1  |

### 16.7 Brand Equity Measurement

* **Quantitative**: unaided/advert recall, NPS, branded search volume.
* **Qualitative**: Community sentiment (Discord/Reddit) sentiment analysis, B2B 試用インタビュー。
* **Loop**: Quarterly Brand Health Report → C-suite OKR に反映。

### 16.8 Immediate Next Steps (Next 21 Days)

1. 商標調査 & Helix 系列ドメイン確保 (Day 5)。
2. ロゴ v0.8 を法務レビューへ (Day 10)。
3. Landing 用 Brand Narrative Video (60s anim) シナリオ決定 (Day 14)。
4. Brand Guidelines v1.0 (Figma → PDF) 公開 (Day 21)。

---

© 2025 Project Aether Studios  / Chief Branding Office Draft
