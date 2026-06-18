<div align="center">

# HagiCode

<p><strong>HagiCode 是一個把 AI 編碼工具、遊戲化回饋系統，以及完整開發工作台整合在同一平台中的產品。</strong></p>

<p>你可以用它來理解儲存庫、撰寫提案、拆解任務、修改程式碼、整理提交、管理多個儲存庫，並在同一個工作台內持續累積可重複使用的知識。</p>

<a href="https://hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://hagicode.com/desktop/">Desktop</a>
·
<a href="https://hagicode.com/container/">Container</a>
·
<a href="https://apps.microsoft.com/detail/9N3PM0N3SVDW">Microsoft Store</a>
·
<a href="https://docs.hagicode.com/blog/">Blog</a>

</div>

[English](./README.md) · [简体中文](./README_cn.md) · [繁體中文](./README_zh-Hant.md) · [日本語](./README_ja-JP.md) · [한국어](./README_ko-KR.md) · [Deutsch](./README_de-DE.md) · [Français](./README_fr-FR.md) · [Español](./README_es-ES.md) · [Português (Brasil)](./README_pt-BR.md) · [Русский](./README_ru-RU.md)

---

## Microsoft Store And Add-ons

| 預覽 | 產品 | 說明 | 開始位置 |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## HagiCode 是什麼

HagiCode 並不是另一個只會聊天的程式碼對話框。它把 AI 帶進完整的軟體開發流程：理解儲存庫、規劃變更、實作程式碼、整理提交、追蹤知識，並讓從想法到封存的整條流程都保持可審閱。

![HagiCode 工作台總覽，展示工作階段、提交說明與頂部操作入口。](./src/assets/img/readme-sync/workspace-overview.png)

## 核心能力

### 1. 以 OpenSpec 驅動提案式 AI 編碼

面對非簡單工作時，HagiCode 不會直接跳進檔案修改，而是先從提案開始。OpenSpec 會把需求整理成範圍、任務、影響分析、驗證步驟，以及一條始終易於審閱的執行軌跡。

![HagiCode 提案工作階段檢視，展示工作流步驟、執行結果與歷史上下文。](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. 主流 Agent CLI 與 OmniRoute

HagiCode 支援 Codex、Claude Code、GitHub Copilot、OpenCode、Hermes、QoderCLI、Kiro、Kimi、Gemini、Pi、Reasonix、DeepAgents 和 Codebuddy。OmniRoute 把 CLI 的選擇與模型和訂閱層分開，讓團隊可以路由模型與端點，而不用把所有內容硬綁到單一預設堆疊上。

![OmniRoute 設定頁面，展示路由設定、端點控制與執行狀態。](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. 完整的開發工作台，而不只是聊天面板

這個工作台把原本容易散落在不同工具中的能力整合到同一條流程裡：

- `MonoSpecs` 用於多儲存庫清單、範圍與協作
- `Skills` 用於可安裝的工作流延伸與信任感知工具
- `Vault` 用於跨專案重複使用的知識沉澱
- `AI Compose Commit` 與 `code-server` 整合，用於把收尾工作也留在同一流程中完成

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="MonoSpecs 多儲存庫狀態總覽，展示多個儲存庫的變更狀態。" width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery，展示可搜尋的安裝型技能與來源篩選。" width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="Vault 工作區，展示可重用知識來源與工作台操作。" width="100%" />
</p>

### 4. 遊戲化回饋，同時維持操作上的實用性

HagiCode 把成就、每日報告、效率倍率、Token 吞吐量和主題化介面回饋視為產品的一部分，而不是裝飾性殘留。結果是一個能讓長時運行的 AI 工作保持可見的工作台，而不是把一切壓扁成無限滾動的聊天紀錄。

![成就大廳，展示每日進度、里程碑指標與長期回饋面板。](./src/assets/img/readme-sync/gamified-feedback.png)

## 官方入口

- [Website](https://hagicode.com/) 查看完整產品首頁
- [Product Overview](https://docs.hagicode.com/product-overview/) 查看官方公開產品介紹
- [Desktop](https://hagicode.com/desktop/) 進入本地優先的安裝與服務管理入口
- [Container](https://hagicode.com/container/) 查看自託管部署路徑
- [Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) 查看產品更新與長篇文章

## 開發此儲存庫

這個儲存庫包含 HagiCode 的公開官網。請在 `repos/site` 下執行：

```bash
npm install
npm run dev
npm run build
npm run preview
```

預設開發伺服器執行於 `http://localhost:31264`。
貢獻者說明請先閱讀 [`AGENTS.md`](./AGENTS.md) 與 [`CLAUDE.md`](./CLAUDE.md)。

## 正式環境部署

- 權威工作流：`.github/workflows/site-deploy-gh-pages.yml`
- 正式環境的事實來源：`gh-pages` 分支，而且只允許 GitHub Actions 發布
- 發布內容契約：分支根目錄保留 `esa.jsonc`，已驗證的 Astro 靜態快照放在 `dist/`
- `gh-pages` 後續的 R2 路徑：`deploy` job 成功後，`upload-r2` 會下載同一份已驗證的 `site-gh-pages-payload` artifact，只把 `.deploy/gh-pages/dist/` 的內容同步到 R2 bucket 根或可選前綴根，不會額外再建立一層 `dist/`
- 手動觸發路徑：`workflow_dispatch` 預設使用 `latest-gh-pages`，維護者可以直接根據最新 `gh-pages` 分支快照重新發布內容而不重新建置；只有需要從目前程式碼重新建置並發布時，才選擇 `current-ref-build`
- 必要的 R2 secrets：`R2_ENDPOINT`、`R2_BUCKET`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`；`R2_PREFIX` 為可選項，解析目標根路徑前會先去除首尾 `/`
- 故障排查：如果 `gh-pages` 已成功但 R2 上傳失敗，workflow 會在 `upload-r2` 失敗；請查看 GitHub step summary，確認解析後的 bucket、前綴根路徑，以及失敗發生在上傳前校驗還是同步階段
- 所需 GitHub 權限：deploy job 需要 `contents: write`；build job 保持唯讀
- 所需託管設定：讓正式環境讀取 `gh-pages/esa.jsonc`，並將 `gh-pages/dist/` 作為靜態資源目錄
- 首次部署檢查：確認工作流實際發布了 `esa.jsonc` 和 `dist/`，確認託管目標仍指向 `gh-pages`，確認 summary 中的 R2 bucket 或前綴根路徑符合預期，再開啟 `https://hagicode.com`
- 回滾路徑：回退來源提交，或從舊提交重新觸發部署，讓 CI 重新發布前一份快照

### Desktop Index 備援說明

桌面歷史索引 `https://index.hagicode.com/desktop/history/` 在此僅作為被引用的相依項。本站把它當成桌面指引的執行期備援目標，但此儲存庫本身不直接發布或維護該索引。

## 授權

此儲存庫以 [LICENSE](./LICENSE) 釋出。
