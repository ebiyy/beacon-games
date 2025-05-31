# CI/CD シークレット設定ガイド

このドキュメントでは、品質管理ワークフローに必要なGitHub Secretsの設定方法を説明します。

## 必要なシークレット一覧

### 1. SonarCloud設定

SonarCloudを使用するには、以下のシークレットが必要です：

- **SONAR_TOKEN**: SonarCloudのアクセストークン
  - [SonarCloud](https://sonarcloud.io/)にログイン
  - My Account → Security → Generate Tokens
  - プロジェクト用のトークンを生成してコピー

### 2. CodeScene設定（オプション）

CodeSceneを使用する場合は、以下のシークレットが必要です：

- **CODESCENE_PAT**: CodeSceneのPersonal Access Token
  - [CodeScene](https://app.codescene.io)にログイン
  - Account Settings → Security → Personal Access Tokens
  - 新しいトークンを作成してコピー
- **CODESCENE_PROJECT_ID**: CodeSceneのプロジェクトID
  - CodeSceneでプロジェクトを開く
  - URLの末尾の数字がProject ID（例: `/projects/1234` → `1234`）

**注意**: CodeSceneは有料サービスのため、無料で始める場合は、ワークフローファイルからCodeScene関連のステップを削除またはコメントアウトしてください。

## GitHub Secretsの設定方法

1. GitHubリポジトリの「Settings」タブを開く
2. 左側メニューの「Secrets and variables」→「Actions」を選択
3. 「New repository secret」ボタンをクリック
4. Name欄にシークレット名、Value欄に値を入力
5. 「Add secret」ボタンをクリック

## 最小構成での開始

コスト効率を重視する場合、以下の最小構成から始めることをお勧めします：

1. **必須**: なし（CodeQLは無料で追加設定不要）
2. **推奨**: SONAR_TOKEN（無料枠あり）
3. **オプション**: CodeScene関連（有料）

## ワークフローの調整

不要なステップは以下のように無効化できます：

```yaml
# CodeSceneを使わない場合はコメントアウト
# - name: CodeScene Delta Analysis
#   if: github.event_name == 'push' && github.ref == 'refs/heads/main'
#   continue-on-error: true
#   uses: empear-analytics/codescene-ci-cd@v2
#   env:
#     CODESCENE_DELTA_ANALYSIS_URL: ${{ secrets.CODESCENE_DELTA_ANALYSIS_URL }}
#     CODESCENE_USER: ${{ secrets.CODESCENE_USER }}
#     CODESCENE_PASSWORD: ${{ secrets.CODESCENE_PASSWORD }}
```

## トラブルシューティング

### SonarCloudが動作しない場合

1. トークンが正しく設定されているか確認
2. Organization名とProject Keyが正しいか確認（sonar-project.properties）
3. SonarCloudプロジェクトがGitHubと連携されているか確認

### ワークフローが失敗する場合

- `continue-on-error: true`を追加して、エラーがあっても続行するように設定
- 必須でないステップは削除またはコメントアウト

## 段階的な導入

1. **Phase 1**: CodeQLのみ（設定不要）
2. **Phase 2**: SonarCloud追加（無料枠）
3. **Phase 3**: 必要に応じてCodeScene追加（有料）

この順序で段階的に導入することで、コストを抑えながら品質管理を強化できます。
