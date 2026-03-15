<div align="center">

<h1>Smart · Efficient · Interesting AI Coding Assistant</h1>

<p>HagiCode official website repository entry, focusing on OpenSpec, multi-Agent parallel execution, Hero Dungeon, and Hero Battle experiences currently displayed on the homepage.</p>

<img src="./public/img/home/亮色主题主界面.png" alt="Hagicode Light Theme Main Interface" width="880" />

<br />

<a href="https://hagicode.com/">🌐 Visit Website</a>
·
<a href="https://hagicode.com/desktop/">🖥️ Desktop</a>
·
<a href="https://hagicode.com/container/">🐳 Container</a>
·
<a href="https://docs.hagicode.com/product-overview/">📚 Product Overview</a>

</div>

[简体中文](./README_cn.md)

---

## Repository Purpose

`repos/site` is HagiCode's official Astro site repository. This README no longer preserves historical marketing snapshots, but directly reflects the current product narrative on the homepage:

- **Smart**: OpenSpec 9-stage workflow connects ideas, proposals, reviews, tasks, implementation, testing, and archiving into a structured process.
- **Efficient**: Agents like Claude Code, Codex, and Qwen · GLM can drive multiple instances in parallel, converting wait time into continuous throughput.
- **Interesting**: Hero Dungeon, squad grouping, Prompt visualization, and Hero Battle reports make daily AI coding collaboration more like an advancable adventure.

## Current Homepage Block Mapping

- **Hero**: The hero section centers on "Smart · Efficient · Interesting" with website, desktop, container, and product overview as main entry points.
- **Activity Metrics**: Homepage displays real-time Docker Hub pull counts, active users, and active sessions, sourced from `public/activity-metrics.json`.
- **Features Showcase**: Three modules for Smart/Efficient/Interesting respectively carry OpenSpec, multi-Agent parallel matrix, and Hero Dungeon/Hero Battle narratives.
- **Evidence**: Homepage currently uses 6 interface screenshots and 3 Bilibili videos to help visitors quickly judge product form and workflow.
- **Install Options**: Desktop and container installation options remain as bottom CTAs on the homepage, consistent with entry descriptions in the README.

## Three Core Features

### Smart

- OpenSpec provides a 9-stage workflow from `Idea` to `Archive`, helping teams connect requirements breakdown, review, implementation, and archiving.
- The current homepage emphasizes structured AI workflows rather than the old version's scattered feature lists or single-point prompt experiences.
- Product positioning, product overview links, and screenshot descriptions at the top of the README are all based on this main narrative.

### Efficient

- The current homepage efficiency narrative focuses on "multi-Agent / multi-instance parallel" organizing proposals, implementation, fixes, and reviews into a continuous throughput execution matrix.
- The currently displayed parallel execution matrix includes `Claude Code`, `Codex`, `Qwen · GLM`, with additional notes about supporting CLIs like `GitHubCopilot`, `CodebuddyCli`, `OpenCodeCli`, `IFlowCli`.
- Typical parallel scenarios include: proposal drafting, design review, feature implementation, regression fixes, problem investigation, and copy optimization.

### Interesting

- Hero Dungeon organizes proposals, dungeon execution, and Prompt visualization workbenches into more intuitive "dungeon" experiences.
- Squad grouping assigns different responsibilities to roles like `Spec Strategist`, `Patch Runner`, and `Prompt Artist`, strengthening collaboration sense and visual feedback.
- Hero Battle reports use XP, levels, and dungeon progression to review daily execution results, keeping the README focused on current homepage dungeon and battle report experiences.

## Current Homepage Screenshots

<table>
<tr>
<td align="center">
<img src="./public/img/home/亮色主题主界面.png" alt="Hagicode Light Theme Main Interface Screenshot" width="360" />
<br />
Light Theme Main Interface
</td>
<td align="center">
<img src="./public/img/home/暗色主题主界面.png" alt="Hagicode Dark Theme Main Interface Screenshot" width="360" />
<br />
Dark Theme Main Interface
</td>
</tr>
<tr>
<td align="center">
<img src="./public/img/home/实时token消耗报告.png" alt="Hagicode Real-time Token Usage Screenshot" width="360" />
<br />
Real-time Token Usage
</td>
<td align="center">
<img src="./public/img/home/multi-agent-workspace.svg" alt="Hagicode Multi-Agent Parallel Workspace Diagram" width="360" />
<br />
Multi-Agent Parallel Workspace
</td>
</tr>
<tr>
<td align="center">
<img src="./public/img/home/hero-dungeon-workspace.svg" alt="Hagicode Hero Dungeon Squad Diagram" width="360" />
<br />
Hero Dungeon Squad
</td>
<td align="center">
<img src="./public/img/home/hero-battle-report.svg" alt="Hagicode Hero Battle Report Diagram" width="360" />
<br />
Hero Battle Report
</td>
</tr>
</table>

These screenshots are consistent with the current display order in `repos/site/src/components/home/ShowcaseSection.tsx`, only keeping resources still used on the homepage.

## Video Demos

- [Daily Hagi Half Hour, AI Multi-task Programming Practice](https://www.bilibili.com/video/BV1pirZBuEzq/): The main recommended video on the current homepage, for quickly understanding Hagicode's overall workflow and multi-task experience.
- [AI Actually Playing Games While Writing Code](https://www.bilibili.com/video/BV1KxwMzxEVK/): Shows the product's fun interactions during real coding, emphasizing the "Interesting" narrative.
- [GPT Codex in Hagicode Test](https://www.bilibili.com/video/BV1yqPmzTEqP/): Focuses on Codex's actual performance in Hagicode, helping visitors judge model integration effects.

## Installation Options

| Method | Use Case | Current Homepage Emphasis | Entry |
| --- | --- | --- | --- |
| Desktop | Personal development, quick start | Local run, supports Windows/macOS/Linux, out-of-box | [Download Desktop App](https://hagicode.com/desktop/) |
| Container | Team deployment, remote access | Server deployment, data persistence, supports Docker Compose Builder | [View Container Deployment](https://hagicode.com/container/) |

## Local Development

```bash
cd repos/site
npm install
npm run dev
npm run build
npm run preview
```

More currently valid repository scripts:

- `npm run typecheck`: TypeScript type checking
- `npm run test`: Run Vitest tests
- `npm run update-metrics`: Refresh homepage activity metrics data

## Repository Structure Overview

- `src/pages/`: Website page entries including homepage, desktop, and container pages
- `src/components/home/`: Homepage Hero, activity metrics, three features, screenshots, video, and installation entry components
- `public/img/home/`: Display resources shared between current README and homepage
- `scripts/`: Site build and activity metrics update scripts

---

<div align="center">

<a href="https://hagicode.com/">Website</a>
|
<a href="https://github.com/HagiCode-org/site">GitHub</a>
|
<a href="https://docs.hagicode.com/blog/">Blog</a>
|
<a href="https://docs.astro.build/">Astro Docs</a>

<p>Built for the current homepage narrative, not a historical snapshot.</p>

</div>
