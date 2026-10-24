<div align="center">

# HagiCode

[![license](https://img.shields.io/badge/license-AGPL--3.0-ffd43b)](./LICENSE)
[![last commit](https://img.shields.io/github/last-commit/HagiCode-org/site)](https://github.com/HagiCode-org/site/commits/main)
[![website](https://img.shields.io/website?url=https%3A%2F%2Fhagicode.com&label=website)](https://hagicode.com)

<p><strong>HagiCode 是一個把 AI 編碼工具、遊戲化回饋系統，以及完整開發工作台整合在同一平台中的產品。</strong></p>

<p>你可以用它來理解儲存庫、撰寫提案、拆解任務、修改程式碼、整理提交、管理多個儲存庫，並在同一個工作台內持續累積可重複使用的知識。</p>

<a href="https://www.hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://www.hagicode.com/desktop/">Desktop</a>
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
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://www.hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
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

- [Website](https://www.hagicode.com/) 查看完整產品首頁
- [Product Overview](https://docs.hagicode.com/product-overview/) 查看官方公開產品介紹
- [Desktop](https://www.hagicode.com/desktop/) 進入本地優先的安裝與服務管理入口
- [Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) 查看產品更新與長篇文章

## 授權

此儲存庫依據 [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE) 釋出。
