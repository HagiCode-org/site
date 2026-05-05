<div align="center">

# HagiCode

<p><strong>HagiCode は、AI コーディングツール、ゲーム化されたフィードバックシステム、そして完全な開発ワークスペースを 1 つのプラットフォームにまとめた製品です。</strong></p>

<p>リポジトリの理解、提案の作成、タスクの分解、コードの変更、コミットの整理、複数リポジトリの管理、そして再利用可能な知識の蓄積までを、同じワークスペースから行えます。</p>

<a href="https://hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://hagicode.com/desktop/">Desktop</a>
·
<a href="https://hagicode.com/container/">Container</a>
·
<a href="https://store.steampowered.com/app/4625540/Hagicode/">Steam</a>
·
<a href="https://docs.hagicode.com/blog/">Blog</a>

</div>

[English](./README.md) · [简体中文](./README_cn.md) · [繁體中文](./README_zh-Hant.md) · [日本語](./README_ja-JP.md) · [한국어](./README_ko-KR.md) · [Deutsch](./README_de-DE.md) · [Français](./README_fr-FR.md) · [Español](./README_es-ES.md) · [Português (Brasil)](./README_pt-BR.md) · [Русский](./README_ru-RU.md)

---

## Steam 製品一覧

| プレビュー | 製品 | 概要 | 開始先 |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/steam/hagicode-wide-capsule.png" alt="HagiCode の Steam ワイドカプセル画像" width="280" /> | **HagiCode** | Steam 上の基本アプリ。Cloud Saves、Workshop 対応、そしてデスクトップ版を最も分かりやすく導入できる公開ルートを提供します。 | [Steam で開く](https://store.steampowered.com/app/4625540/Hagicode/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus の Steam バンドル用ワイドカプセル画像" width="280" /> | **Hagicode Plus** | より完全な構成に進むためのバンドル案内。HagiCode 本体と Turbo Engine DLC をまとめた導線です。 | [バンドルガイドを読む](https://docs.hagicode.com/en/bundles/hagicode-plus/) · [Steam でバンドルを見る](https://store.steampowered.com/bundle/73989/Hagicode_Plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC の Steam ワイドカプセル画像" width="280" /> | **Turbo Engine DLC** | HagiCode 向け DLC。最大 32 の同時オンラインセッションと、より多くのカスタマイズオプションを解放します。 | [DLC を見る](https://store.steampowered.com/app/4635480/Hagicode__Turbo_Engine/) |

## HagiCode とは

HagiCode は、単なるコード用チャットボックスとして作られたものではありません。AI をソフトウェア開発の全工程に持ち込み、リポジトリの理解、変更の計画、コード実装、コミット整理、知識の蓄積、そしてアイデアからアーカイブまでの流れ全体をレビュー可能な形で維持します。

![セッション、コミットメモ、主要アクションが統合された HagiCode ワークスペースの概要。](./src/assets/img/readme-sync/workspace-overview.png)

## 中核機能

### 1. OpenSpec による提案駆動型 AI コーディング

複雑な作業では、HagiCode はすぐにファイル編集へ進まず、まず提案から始めます。OpenSpec は依頼内容を、スコープ、タスク、影響分析、検証手順、そして常にレビューしやすい実行履歴へと整理します。

![ワークフローステップ、実行結果、履歴コンテキストを表示する HagiCode の提案セッション画面。](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. 主要 Agent CLI と OmniRoute

HagiCode は Codex、Claude Code、GitHub Copilot、OpenCode、Hermes、QoderCLI、Kiro、Kimi、Gemini、DeepAgents、Codebuddy をサポートします。OmniRoute は CLI の選択をモデルやサブスクリプション層から切り離し、チームが単一の既定スタックに固定されずにモデルとエンドポイントをルーティングできるようにします。

![ルーティング設定、エンドポイント制御、実行状態を表示する OmniRoute 設定画面。](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. チャットペインではなく、完全な開発ワークスペース

このワークスペースは、通常は別々のツールに散らばる機能を 1 つの流れにまとめます。

- `MonoSpecs` はマルチリポジトリの棚卸し、スコープ、調整を担当
- `Skills` はインストール可能なワークフロー拡張と信頼性を意識したツールを担当
- `Vault` はプロジェクトをまたいで再利用できる知識の蓄積を担当
- `AI Compose Commit` と `code-server` 連携は、最後の仕上げまで同じ流れの中で完了できるようにします

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="複数リポジトリの変更状態を示す MonoSpecs の概要画面。" width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="検索可能なインストール型スキルとソースフィルターを表示する HagiCode Skills Gallery。" width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="再利用可能な知識ソースとワークスペース操作を表示する Vault ワークスペース。" width="100%" />
</p>

### 4. 実務に役立つゲーム化フィードバック

HagiCode は、実績、日次レポート、効率倍率、トークン処理量、テーマ化された UI フィードバックを装飾ではなく製品機能として扱います。その結果、長時間走る AI 作業を見えるまま保てるワークスペースになり、すべてが無限スクロールのチャットに押し込まれることがありません。

![日々の進捗、マイルストーン指標、長期的なフィードバックを表示する実績ホール。](./src/assets/img/readme-sync/gamified-feedback.png)

## 公式エントリーポイント

- [Website](https://hagicode.com/) で製品サイト全体を見る
- [Product Overview](https://docs.hagicode.com/product-overview/) で公式の公開製品紹介を見る
- [Desktop](https://hagicode.com/desktop/) でローカルファーストの導入とサービス管理を見る
- [Container](https://hagicode.com/container/) でセルフホストのデプロイ経路を見る
- [Steam](https://store.steampowered.com/app/4625540/Hagicode/) でプラットフォームネイティブ配布を備えた Steam 版を見る
- [Blog](https://docs.hagicode.com/blog/) で製品更新と長文記事を見る

## このリポジトリを開発する

このリポジトリには HagiCode の公開サイトが含まれています。`repos/site` で次を実行してください。

```bash
npm install
npm run dev
npm run build
npm run preview
```

既定の開発サーバーは `http://localhost:31264` で動作します。
コントリビューター向けの案内は [`AGENTS.md`](./AGENTS.md) と [`CLAUDE.md`](./CLAUDE.md) から確認してください。

## 本番デプロイ

- 権威あるワークフロー: `.github/workflows/site-deploy-gh-pages.yml`
- 本番環境のソースオブトゥルース: `gh-pages` ブランチ。公開は GitHub Actions のみが行います
- 公開ペイロード契約: ブランチ直下に `esa.jsonc` を置き、検証済みの Astro スナップショットを `dist/` に配置します
- `gh-pages` 後の R2 経路: `deploy` job が成功すると、`upload-r2` は同じ検証済み `site-gh-pages-payload` artifact をダウンロードし、`.deploy/gh-pages/dist/` の中身だけを R2 の bucket ルートまたは任意の prefix ルートへ同期します。追加の `dist/` セグメントは作成しません
- 手動実行の経路: `workflow_dispatch` は既定で `latest-gh-pages` を使うため、メンテナーは最新の `gh-pages` ブランチスナップショットから再ビルドなしで再公開できます。現在の ref から手動で再ビルドして公開したい場合だけ `current-ref-build` を選んでください
- 必須の R2 secrets: `R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`。`R2_PREFIX` は任意で、ターゲットルートを解決する前に先頭と末尾の `/` を取り除きます
- 障害切り分け: `gh-pages` が成功しても R2 アップロードが失敗した場合、workflow は `upload-r2` で失敗します。GitHub の step summary を確認し、解決された bucket、prefix ルート、失敗が転送前の検証か同期中かを確認してください
- 必要な GitHub 権限: deploy job には `contents: write` が必要で、build job は読み取り専用のままにします
- 必要なホスティング設定: 本番ホストが `gh-pages/esa.jsonc` を読み、`gh-pages/dist/` を静的配信ディレクトリとして使うようにします
- 初回デプロイ時の確認: ワークフローが `esa.jsonc` と `dist/` を公開したことを確認し、ホスティング先が引き続き `gh-pages` を見ていることを確かめ、summary に期待どおりの R2 bucket または prefix ルートが表示されることを確認したうえで `https://hagicode.com` を開きます
- ロールバック方法: ソース変更を戻すか、古いコミットから再デプロイして、CI に前のスナップショットを再公開させます

### Desktop Index フォールバック

`https://index.hagicode.com/desktop/history/` にあるデスクトップ履歴インデックスは、ここでは参照される依存先にすぎません。サイトはこれをデスクトップ案内の実行時フォールバック先としてリンクしますが、このリポジトリ自体がそのインデックスを公開したり管理したりはしません。

## ライセンス

このリポジトリは [LICENSE](./LICENSE) の下で公開されています。
