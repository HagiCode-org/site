<div align="center">

<h1>Smart · Efficient · Interesting AI Coding Assistant</h1>

<p>HagiCode turns ideas into shipped work with OpenSpec workflows, multi-agent parallel execution, and Hero Dungeon battle reports that keep AI coding visible, structured, and fun.</p>

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

## Product story

- **Smart** - OpenSpec gives teams a structured path from idea, proposal, and design to implementation, testing, and archive.
- **Efficient** - Claude Code, Codex, and other CLI agents can drive multiple agents and instances in parallel, so proposals, fixes, and reviews keep moving together.
- **Interesting** - Hero Dungeon rosters, battle reports, and visual workspaces make daily AI coding feel more like a coordinated adventure than a pile of disconnected chats.

## Visual Tour

The gallery below uses site-owned assets copied into `repos/site`, so GitHub can render current product evidence without deep-linking into the docs repository.
Instead of relying on one hero screenshot or old metrics cards, this tour walks through the active proposal flow, quick execution mode, skill safety surfaces, Hero identity, and desktop controls.

<p>
  <img src="./public/img/readme/proposal-nine-stage-overview.png" alt="Nine-stage HagiCode proposal timeline showing optimization, drafting, review, execution, and archive states." width="100%" />
  <br />
  <strong>Proposal stages at a glance</strong><br />
  <sub><strong>UI screenshot.</strong> Track proposal work from optimization through archive in one nine-stage timeline.</sub>
</p>

<p>
  <img src="./public/img/readme/review-inline-comments.png" alt="HagiCode review view showing an inline file comment editor with optimization and issue tags." width="100%" />
  <br />
  <strong>Inline review and annotations</strong><br />
  <sub><strong>UI screenshot.</strong> Review files with inline annotations before sending focused feedback back to AI.</sub>
</p>

<p>
  <img src="./public/img/readme/execution-code-changes.png" alt="Git diff view in HagiCode after proposal execution, showing applied documentation changes." width="100%" />
  <br />
  <strong>Execution result with code diff</strong><br />
  <sub><strong>UI screenshot.</strong> Inspect the applied diff immediately after plan execution finishes.</sub>
</p>

<p>
  <img src="./public/img/readme/normal-session-result.png" alt="HagiCode normal chat session showing a completed project analysis result card." width="100%" />
  <br />
  <strong>Normal session execution result</strong><br />
  <sub><strong>UI screenshot.</strong> Use quick chat sessions for focused tasks when you do not need a full proposal flow.</sub>
</p>

<p>
  <img src="./public/img/readme/skill-management.png" alt="Skill details panel showing trust status, install metadata, and the managed command that HagiCode will run." width="100%" />
  <br />
  <strong>Skill trust and managed command</strong><br />
  <sub><strong>UI screenshot.</strong> Verify the install source, trust status, and exact managed command for every skill.</sub>
</p>

<p>
  <img src="./public/img/readme/hero-highlights.webp" alt="Stylized rune mage cat hero illustration representing HagiCode's Hero Dungeon theme." width="100%" />
  <br />
  <strong>Hero highlight and personality layer</strong><br />
  <sub><strong>Product visual.</strong> Hero Dungeon personas and battle-report theming give long-running AI sessions a memorable identity.</sub>
</p>

<p>
  <img src="./public/img/readme/desktop-start-service.png" alt="HagiCode Desktop dashboard with the start service control and service status card." width="100%" />
  <br />
  <strong>Desktop start service control</strong><br />
  <sub><strong>UI screenshot.</strong> Start or monitor the local HagiCode service from the desktop dashboard.</sub>
</p>

<p>
  <img src="./public/img/readme/desktop-version-management.png" alt="HagiCode Desktop version management view showing installed packages, dependencies, and available releases." width="100%" />
  <br />
  <strong>Desktop version management</strong><br />
  <sub><strong>UI screenshot.</strong> Switch installed packages, dependencies, and release tracks from the desktop version center.</sub>
</p>

## Why HagiCode

- **Proposal-driven by default** - OpenSpec keeps scope, tasks, and archive history connected so AI work stays reviewable.
- **Built for parallel throughput** - the current product showcase highlights real-time token tracking, multi-agent workspaces, and execution views that are designed for multiple streams at once.
- **Memorable to use** - Hero Dungeon and Hero Battle report views add narrative, feedback, and momentum to team workflows.

## Star History

Track how the `HagiCode-org/site` repository has grown over time:

<p align="center">
  <a href="https://star-history.com/#HagiCode-org/site&Date">
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcset="https://api.star-history.com/svg?repos=HagiCode-org/site&type=Date&theme=dark"
      />
      <source
        media="(prefers-color-scheme: light)"
        srcset="https://api.star-history.com/svg?repos=HagiCode-org/site&type=Date"
      />
      <img
        alt="Star History Chart for HagiCode-org/site"
        src="https://api.star-history.com/svg?repos=HagiCode-org/site&type=Date"
      />
    </picture>
  </a>
</p>

## Getting Started

Start with the official product entry points:

- [hagicode.com](https://hagicode.com/) for the full homepage experience
- [Desktop](https://hagicode.com/desktop/) to install the local app
- [Container](https://hagicode.com/container/) for the self-hosted deployment path
- [Product Overview](https://docs.hagicode.com/product-overview/) for the documentation entry

Run the site locally from `repos/site`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The dev server runs on `http://localhost:31264` by default. For contributor-oriented details, start with [`AGENTS.md`](./AGENTS.md) and [`CLAUDE.md`](./CLAUDE.md).

## Homepage activity metrics

The homepage activity metrics module is now a runtime consumer of the canonical JSON hosted by the index site:

- Source: `https://index.hagicode.com/activity-metrics.json`
- Single source of truth: `repos/index` generates and publishes the only homepage metrics asset that `repos/site` is allowed to consume
- Ownership: the data is generated and published from `repos/index`, not from `repos/site`
- Failure mode: if the remote asset is unavailable, the homepage keeps the existing empty-state fallback instead of breaking the rest of the page
- Maintenance boundary: if homepage metrics look wrong or stale, investigate the index repository and index deployment first instead of re-adding a local refresh script or local JSON copy in this repository

## License

This repository is released under the terms in [LICENSE](./LICENSE).

---

Ready to explore the full product story? Visit [hagicode.com](https://hagicode.com/) and choose the experience that fits your workflow.
