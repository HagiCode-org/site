<div align="center">

# HagiCode

<p><strong>HagiCode 是一个把 AI 编程工具、游戏化反馈系统和综合型开发工作台合并在一起的产品。</strong></p>

<p>你可以用它理解仓库、写提案、拆任务、修改代码、整理提交、管理多仓库，并在同一个工作台里持续沉淀可复用的知识。</p>

<a href="https://hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://hagicode.com/desktop/">Desktop</a>
·
<a href="https://hagicode.com/container/">Container</a>
·
<a href="https://docs.hagicode.com/blog/">Blog</a>

</div>

[English](./README.md)

---

## HagiCode 是什么

HagiCode 不是另一个只会聊天的代码框。它把 AI 拉进完整的软件开发过程，让理解仓库、规划改动、实现代码、整理提交、沉淀知识，以及从想法到归档的可审阅流程都落在同一个工作台里。

![HagiCode 工作台总览，展示会话、提交说明和顶部操作入口。](./public/img/readme-sync/workspace-overview.png)

## 核心能力

### 1. 用 OpenSpec 驱动提案式 AI 编码

面对稍微复杂一点的需求，HagiCode 会先写提案，而不是直接改文件。OpenSpec 会把请求整理成范围、任务、影响分析、验证方式和可追踪的执行轨迹，让后续实现更稳定，也更容易审阅。

![HagiCode 提案会话详情视图，展示工作流步骤、执行结果与历史上下文。](./public/img/readme-sync/open-spec-proposal-workflow.png)

### 2. 主流 Agent CLI 与 OmniRoute 组合使用

HagiCode 当前支持 Codex、Claude Code、GitHub Copilot、OpenCode、Hermes、QoderCLI、Kiro、Kimi、Gemini、DeepAgents 和 Codebuddy。OmniRoute 把 CLI 体验与模型、订阅和端点路由分开管理，让团队不必把所有选择硬绑定到单一默认栈上。

![OmniRoute 设置页，展示路由配置、端点控制和运行状态。](./public/img/readme-sync/omniroute-routing.png)

### 3. 它是完整开发工作台，不只是聊天窗口

这个工作台把本来容易散在不同工具里的能力收进同一条流程：

- `MonoSpecs` 负责多仓库清单、范围和协同
- `Skills` 负责可安装的工作流扩展与授信管理
- `Vault` 负责跨项目复用的知识沉淀
- `AI Compose Commit` 与 `code-server` 集成负责把最后一段工作也留在同一工作流里完成

<p align="center">
  <img src="./public/img/readme-sync/monospecs-multi-repo.png" alt="MonoSpecs 多仓库状态总览，展示多个仓库的变更状态。" width="49%" />
  <img src="./public/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery，展示可搜索的技能列表与来源筛选。" width="49%" />
</p>

<p align="center">
  <img src="./public/img/readme-sync/vault-workspace.png" alt="Vault 工作区，展示可复用知识源和工作台操作入口。" width="100%" />
</p>

### 4. 游戏化反馈不是装饰，而是可用反馈系统

HagiCode 把成就、日报、效率倍率、Token 吞吐和主题化界面反馈当成正式产品能力，而不是附属装饰。这样长流程 AI 协作就不会被压扁成一条无限滚动的聊天记录。

![成就大厅，展示每日进度、阶段指标和长期反馈入口。](./public/img/readme-sync/gamified-feedback.png)

## 官方入口

- [Website](https://hagicode.com/) 查看完整产品官网
- [Product Overview](https://docs.hagicode.com/product-overview/) 查看 canonical 产品介绍
- [Desktop](https://hagicode.com/desktop/) 进入本地优先的安装与服务管理入口
- [Container](https://hagicode.com/container/) 查看自托管部署路径
- [Blog](https://docs.hagicode.com/blog/) 查看产品更新与长文内容

## 开发这个仓库

这个仓库承载 HagiCode 的公开官网内容。在 `repos/site` 下运行：

```bash
npm install
npm run dev
npm run build
npm run preview
```

默认开发服务器地址是 `http://localhost:31264`。
贡献者说明优先查看 [`AGENTS.md`](./AGENTS.md) 和 [`CLAUDE.md`](./CLAUDE.md)。

## 许可协议

本仓库遵循 [LICENSE](./LICENSE)。
