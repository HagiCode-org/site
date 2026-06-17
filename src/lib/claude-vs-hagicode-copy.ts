import {
  DEFAULT_LOCALE,
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';

/* ------------------------------------------------------------------ */
/*  Section content types                                              */
/* ------------------------------------------------------------------ */

export interface CompareSectionIntro {
  readonly title: string;
  readonly lead: string;
}

export interface CompareClaudeFeature {
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface CompareClaudeCapabilities {
  readonly sectionTitle: string;
  readonly features: readonly CompareClaudeFeature[];
  readonly modelTitle: string;
  readonly modelParagraphs: readonly string[];
  readonly ecosystemTitle: string;
  readonly ecosystemParagraphs: readonly string[];
}

export interface CompareHagiCodeAdvantage {
  readonly title: string;
  readonly summary: string;
  readonly details: readonly string[];
}

export interface CompareHagiCodeAdvantages {
  readonly sectionTitle: string;
  readonly advantages: readonly CompareHagiCodeAdvantage[];
}

export interface CompareSummary {
  readonly sectionTitle: string;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
  readonly closing: string;
}

export interface ClaudeVsHagicodePageModel {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly ui: {
    readonly pageTitle: string;
    readonly subtitle: string;
    readonly badge: string;
    readonly backLink: string;
  };
  readonly intro: CompareSectionIntro;
  readonly claudeCapabilities: CompareClaudeCapabilities;
  readonly hagiCodeAdvantages: CompareHagiCodeAdvantages;
  readonly summary: CompareSummary;
}

/* ------------------------------------------------------------------ */
/*  Locale-resolved catalog                                            */
/* ------------------------------------------------------------------ */

type LocalizedModel = Partial<Record<SiteLocale, ClaudeVsHagicodePageModel>>;

const catalog: LocalizedModel = {
  'zh-CN': {
    seo: {
      title: 'Claude Vs HagiCode —— 为什么 Claude 配合 HagiCode 才能发挥全部实力',
      description:
        '了解 Claude 的主要功能、模型特点和插件生态，并从多线程并行、OpenSpec 提案、AI 提交、Preset Task、游戏化界面、Agents 管理、Monospecs、Vault 和 OmniRoute 等角度，看 HagiCode 如何让 Claude 的实力更上一层楼。',
    },
    ui: {
      pageTitle: 'Claude Vs HagiCode',
      subtitle: '为什么 Claude 配合 HagiCode 才能发挥全部实力',
      badge: '对比分析',
      backLink: '← 返回文档',
    },
    intro: {
      title: 'Claude 配合 HagiCode，发挥全部实力',
      lead:
        'Claude 是目前全球公认最强大的 AI 编程助手之一，凭借超长上下文窗口、深度推理能力和高度安全的模型对齐，赢得了大量开发者的信赖。不过 Claude 本身是一个模型能力的载体，而 HagiCode 是一个专门为 AI 编程场景设计的桌面工作台——两者各有所长，配合使用才能真正发挥 Claude 的全部实力。',
    },
    claudeCapabilities: {
      sectionTitle: 'Claude 的核心能力',
      features: [
        {
          title: '代码生成与编辑',
          paragraphs: [
            'Claude 可以根据自然语言描述生成完整的代码文件、组件或函数，也能理解现有代码库的结构并在此基础之上进行增量修改。从简单的工具函数到复杂的前后端架构，Claude 都能处理。',
          ],
        },
        {
          title: '代码分析与审查',
          paragraphs: [
            'Claude 擅长阅读和理解大型代码库。你可以把一整个仓库的代码交给它，它会帮你梳理模块关系、发现潜在 bug、提出性能优化建议，甚至指出安全漏洞。',
          ],
        },
        {
          title: '对话式编程协作',
          paragraphs: [
            '与传统的代码补全工具不同，Claude 支持持续的多轮对话。你可以先提出一个模糊的想法，在讨论过程中逐步细化需求，Claude 会在每一轮对话中记住前面的上下文，让协作过程像和高级工程师配对编程一样自然。',
          ],
        },
      ],
      modelTitle: '模型特点',
      modelParagraphs: [
        'Claude 支持高达 200K token 的上下文窗口，这意味着你可以一次性把大量代码文件、文档甚至整本书放进去，而 Claude 能够在整个窗口范围内保持一致的记忆和理解。对于需要跨文件修改的复杂任务，这个能力是质的提升。',
        'Claude 的推理链（chain-of-thought）能力非常突出。面对复杂的逻辑问题、架构设计决策或多步骤的编程任务时，Claude 会展现出接近人类高级工程师的思考深度，不会只给结论而不说明推理过程。',
        'Anthropic 在模型安全方面投入了大量研究。Claude 在遇到不确定的问题时会坦诚说明，而不是编造答案。在处理涉及安全、隐私或伦理的代码场景时，Claude 会主动提示风险。',
      ],
      ecosystemTitle: '插件与工具生态',
      ecosystemParagraphs: [
        'MCP（Model Context Protocol）是 Anthropic 主导的开放协议，允许开发者构建自己的工具和资源连接器，让 Claude 能够直接访问本地文件系统、数据库、API 等外部系统。MCP 正在成为 AI 编程工具生态的通用标准。',
        'Claude Code 是 Anthropic 官方的终端编程工具，可以直接在命令行中与 Claude 协作，支持文件读写、shell 命令执行、Git 操作等，是目前最接近原生 Claude 编程体验的工具。',
        '越来越多的 IDE、DevOps 平台和代码托管服务开始集成 Claude，使其能够融入开发者现有的工作流中。',
      ],
    },
    hagiCodeAdvantages: {
      sectionTitle: '为什么 Claude 需要 HagiCode',
      advantages: [
        {
          title: '多线程并行：让多个 Claude 同时为你工作',
          summary: 'HagiCode 把你的单核 Claude 升级成了多核 Claude 集群。',
          details: [
            '线程 A 在完善后端 API 接口；线程 B 在重构前端组件；线程 C 在编写单元测试；线程 D 在审查代码安全漏洞——四个线程完全可以同时进行、互不干扰。',
            '不需要等一个任务跑完再开始下一个，这就是从"顺序执行"到"并行工作"的质变。',
          ],
        },
        {
          title: 'OpenSpec 提案会话：让每次改动都可追溯',
          summary: '先写清楚这次要解决什么问题，在提案框架下与 Claude 深入讨论技术方案，所有对话和决策都记录在提案上下文里。',
          details: [
            '提案文档、讨论记录和代码变更形成一条完整的追溯链，几个月后回头看代码时，依然能快速理解当时的决策背景。',
            '方案确定后，Claude 在提案的约束范围内进行代码实现，避免"改了一堆东西之后忘了为什么这么改"。',
          ],
        },
        {
          title: 'AI 提交：让 commit 不再是一件心事',
          summary: 'Claude 会自动分析代码变更、理解改动意图和影响范围，然后生成结构清晰、语义准确的 commit message。',
          details: [
            'AI 提交过程中，HagiCode 会自动锁定仓库，防止并发操作导致的状态冲突，确保提交安全可靠。',
            '你把注意力留给创造，commit message 这种流水账交给 Claude 就好。',
          ],
        },
        {
          title: 'Code Server 浏览器编辑：从 AI 分析到动手修改零切换',
          summary: 'Claude 在提案中定位到需要修改的文件后，HagiCode 可以直接在工作台内打开该文件进入编辑状态。',
          details: [
            '无论项目跑在本地机器、Docker 容器还是远程服务器上，Code Server 都能打开项目目录并进入编辑。',
            '注册到 Vault 中的代码参考库和学习项目，同样可以通过 Code Server 直接打开浏览和编辑——从分析结果到动手修改之间的距离是零。',
          ],
        },
        {
          title: 'Preset Task：一键触发高频工作流，整合社区 Skills 生态',
          summary: '市面上的社区 Skills 散落各处，HagiCode 将它们集成为一个可扩展的 Skills 平台。',
          details: [
            '社区 Skills 即装即用：新增 CRUD 模块、全面代码审查、API 文档生成，都有现成的方案。',
            '可视化操作，告别纯文本的枯燥——鼠标点击选择任务、下拉菜单切换参数、拖拽调整任务顺序，每一步都有清晰的视觉反馈。',
            '可在社区 Skills 基础上定制和组合，打造属于自己团队的任务模板库。',
          ],
        },
        {
          title: '游戏化界面：让人机协作变得愉快',
          summary: 'HagiCode 打破了命令行工具冷冰冰的体验，每个会话的运行状态、进度和结果都通过直观的界面元素呈现。',
          details: [
            '任务完成、代码入库、提案通过——这些节点都被包装成可见的里程碑，让开发过程有节奏感和成就感。',
            '鼠标点击、拖拽操作和快捷键结合的设计，让不习惯纯终端工作流的开发者也能轻松驾驭 Claude 的全部能力。',
          ],
        },
        {
          title: 'Agents 多代理管理：把多线程并行升级为可编排的 Agent 编队',
          summary: '每个 Claude 会话被抽象为一个 Agent 实例，有身份、状态、职责和当前进度。',
          details: [
            '在 Agents 面板里一目了然——谁在执行提案、谁在等待输入、谁已完成可以归档，所有 Agent 的运行状态都在一个视图里集中呈现。',
            '每个 Agent 可以有不同的模型配置、Skills 挂载和上下文范围，独立调优、互不干扰。',
            '同一个任务不会出现"两个 Claude 重复修改"的混乱，每个 Agent 的职责边界清晰，任务推进路径可追踪。',
          ],
        },
        {
          title: 'Monospecs 多仓库管理：让 Claude 在项目群之间游刃有余',
          summary: '通过 .hagicode/monospecs.yaml 配置文件声明项目群中所有子仓库的地址、名称和关系，Claude 在启动提案时就能自动获得完整的跨仓库地图。',
          details: [
            '创建开发提案时，Claude 可直接从 Monospecs 配置中读取子仓库列表，你不再需要每次手动列出涉及哪些仓库。',
            'AI 提交时，HagiCode 会根据 Monospecs 配置自动建议应该提交到哪个目标仓库。',
            '每个子仓库可以有自己专属的 AGENTS.md，Claude 在操作不同仓库时自动读取对应的指导。',
          ],
        },
        {
          title: 'Vault 跨项目知识库：给 Claude 装上长期记忆',
          summary: '一次注册，处处复用——Vault 支持 folder、coderef、obsidian 和 system-managed 四种类型。',
          details: [
            '每次启动新提案时，HagiCode 会自动将注册的 Vault 信息注入到 Claude 的上下文里，Claude 拿到提案的同时就已经"知道"你有哪些可用的学习资源和参考项目。',
            '每个 Vault 可标记为 reference（只读）或 editable（可编辑），让 AI 的自由度始终可控。',
            'Monospecs 拓展了 Claude 的空间视野，Vault 延续了 Claude 的时间记忆——两者叠加，Claude 变成真正了解你项目全景的长期搭档。',
          ],
        },
        {
          title: 'OmniRoute 模型路由：把 CLI 和模型彻底拆开，让 Claude 更自由',
          summary: 'CLI 管交互体验，模型管能力供给，两者不再被强行绑成一道选择题。',
          details: [
            '你可以始终用 Claude Code 作为交互前端，保留它出色的多轮推理和工具调用体验，但在模型层自由选择最具性价比的模型来源。',
            '多个 Agent 可以走不同的模型路由，互不影响。当某个模型涨价或新模型发布时，只需在 OmniRoute 层做一次调整。',
            'CLI 和模型的关系，从"婚姻"变成了"合作"。',
          ],
        },
      ],
    },
    summary: {
      sectionTitle: '总结',
      paragraphs: [
        'Claude 是一个超一流的 AI 模型，HagiCode 是一个为 AI 编程场景量身打造的工作台。它们的关系不是替代，而是互补。',
      ],
      bullets: [
        'Claude 提供智力：超长上下文、深度推理、安全对齐',
        'HagiCode 提供效率：多线程并行、Agents 编队管理、OpenSpec 提案、AI 提交、Code Server 编辑器、Preset Task',
        'HagiCode 拓展边界：Monospecs 让 Claude 理解跨仓库项目关系，Vault 让 Claude 拥有跨会话长期记忆，OmniRoute 让 Claude 突破模型订阅的锁死',
        '两者结合提供体验：可追溯的决策链、自动化的日常事务、让人愉悦的操作界面，以及一个真正了解你项目全景、可自由配置模型来源的长期 AI 搭档',
      ],
      closing:
        '如果你已经在用 Claude，不妨试试把它接入 HagiCode——你会发现自己不是多了一个工具，而是多了一套完整的工作方式。',
    },
  },

  'en-US': {
    seo: {
      title: 'Claude Vs HagiCode — Why Claude Reaches Its Full Potential With HagiCode',
      description:
        'Explore Claude\'s core capabilities and see how HagiCode\'s multi-threading, OpenSpec proposals, AI commits, Preset Tasks, gamified UI, Agents management, Monospecs, Vault, and OmniRoute elevate Claude to the next level.',
    },
    ui: {
      pageTitle: 'Claude Vs HagiCode',
      subtitle: 'Why Claude reaches its full potential with HagiCode',
      badge: 'Comparison',
      backLink: '← Back to Docs',
    },
    intro: {
      title: 'Claude + HagiCode: the full picture',
      lead:
        'Claude is one of the most powerful AI coding assistants in the world, trusted by developers for its massive context window, deep reasoning, and strong safety alignment. But Claude is ultimately a model capability — HagiCode is a desktop workspace purpose-built for AI coding. They complement each other perfectly.',
    },
    claudeCapabilities: {
      sectionTitle: "Claude's Core Capabilities",
      features: [
        {
          title: 'Code Generation & Editing',
          paragraphs: [
            'Claude can generate complete files, components, or functions from natural-language descriptions, and it can understand existing codebase structure for incremental modifications — from simple utilities to complex full-stack architectures.',
          ],
        },
        {
          title: 'Code Analysis & Review',
          paragraphs: [
            'Claude excels at reading and understanding large codebases. You can hand it an entire repository and it will map module relationships, surface potential bugs, suggest performance optimizations, and even flag security vulnerabilities.',
          ],
        },
        {
          title: 'Conversational Pair Programming',
          paragraphs: [
            'Unlike traditional code-completion tools, Claude supports sustained multi-turn dialogue. Start with a vague idea, refine requirements through discussion, and Claude remembers the full context across every turn — like pairing with a senior engineer.',
          ],
        },
      ],
      modelTitle: 'Model Characteristics',
      modelParagraphs: [
        'Claude supports up to 200K-token context windows, letting you feed in massive amounts of code and documentation while maintaining consistent memory and understanding across the entire range.',
        "Claude's chain-of-thought reasoning is exceptional. When facing complex logic, architectural decisions, or multi-step programming tasks, Claude demonstrates near-senior-engineer depth of thought — it doesn't just give answers, it shows its work.",
        'Anthropic has invested heavily in model safety. Claude honestly acknowledges uncertainty instead of fabricating answers, and it proactively surfaces risks when dealing with security, privacy, or ethics in code.',
      ],
      ecosystemTitle: 'Plugin & Tool Ecosystem',
      ecosystemParagraphs: [
        'MCP (Model Context Protocol), led by Anthropic, is an open protocol that lets developers build tool and resource connectors so Claude can directly access local filesystems, databases, APIs, and external systems.',
        'Claude Code is Anthropic\'s official terminal coding tool, providing native Claude programming experience with file read/write, shell command execution, and Git operations directly in the command line.',
        'A growing number of IDEs, DevOps platforms, and code-hosting services are integrating Claude into existing developer workflows.',
      ],
    },
    hagiCodeAdvantages: {
      sectionTitle: 'Why Claude Needs HagiCode',
      advantages: [
        {
          title: 'Multi-Threaded Parallelism: Multiple Claudes Working for You',
          summary: 'HagiCode upgrades your single-core Claude into a multi-core Claude cluster.',
          details: [
            'Thread A refines backend APIs; Thread B refactors frontend components; Thread C writes unit tests; Thread D audits security — all running concurrently without interference.',
            'No more waiting for one task to finish before starting the next. This is the leap from sequential to parallel execution.',
          ],
        },
        {
          title: 'OpenSpec Proposals: Every Change Is Traceable',
          summary: 'Define the problem first, discuss the technical approach with Claude within a proposal framework, and every decision is recorded in the proposal context.',
          details: [
            'Proposal documents, discussion records, and code changes form a complete audit trail — understand the decision context months later at a glance.',
            'Claude implements within the proposal\'s constraints once the approach is finalised, eliminating "I changed a bunch of things but forgot why."',
          ],
        },
        {
          title: 'AI Commits: Commit Messages Without the Mental Overhead',
          summary: 'Claude analyses your code changes, understands intent and scope, then generates clear, semantically accurate commit messages.',
          details: [
            'HagiCode automatically locks the repository during AI commits, preventing conflicts from concurrent operations.',
            'Save your attention for creating — let Claude handle the paperwork.',
          ],
        },
        {
          title: 'Code Server Browser Editing: Zero Gap From Analysis to Action',
          summary: 'When Claude identifies files to modify, HagiCode opens them directly in the built-in editor — no tool switching required.',
          details: [
            'Whether your project runs locally, in Docker, or on a remote server, Code Server opens the project directory for editing.',
            'Vault-registered reference projects and learning materials are also directly browsable and editable — the distance from analysis to modification is zero.',
          ],
        },
        {
          title: 'Preset Tasks: One-Click Workflows Powered by Community Skills',
          summary: 'HagiCode integrates community-contributed Skills into an extensible preset task platform.',
          details: [
            'Community Skills load instantly: CRUD scaffolding, comprehensive code review, API doc generation — all ready to use.',
            'Visual operation clicks replace terminal commands — select tasks by clicking, switch parameters via dropdowns, reorder with drag-and-drop, all with clear visual feedback.',
            'Customise and compose community Skills into your team\'s own task template library.',
          ],
        },
        {
          title: 'Gamified Interface: Making Human-AI Collaboration Enjoyable',
          summary: 'HagiCode breaks away from cold command-line experiences with intuitive visual feedback on session states, progress, and results.',
          details: [
            'Task completion, code check-in, and proposal acceptance become visible milestones — giving the development process rhythm and a sense of achievement.',
            'Mouse, drag-and-drop, and keyboard shortcuts make Claude\'s full capabilities accessible to developers who dislike pure terminal workflows.',
          ],
        },
        {
          title: 'Agents Management: From Threads to an Orchestrated Agent Fleet',
          summary: 'Each Claude session becomes an Agent instance with identity, state, responsibility, and current progress.',
          details: [
            'The Agents panel shows at a glance who is executing a proposal, who is waiting for input, and who has completed — all agent statuses in one view.',
            'Each Agent can have different model configurations, Skills, and context scopes, tuned independently.',
            'Clear responsibility boundaries mean no "two Claudes editing the same task" chaos — every Agent\'s remit is explicit and traceable.',
          ],
        },
        {
          title: 'Monospecs Multi-Repo Management: Claude Navigates Project Clusters',
          summary: 'Declare all sub-repositories, names, and relationships in .hagicode/monospecs.yaml — Claude gets the full cross-repo map when starting proposals.',
          details: [
            'When creating proposals, Claude reads the sub-repo list directly from Monospecs — no more manually listing which repos are affected.',
            'AI commits automatically suggest the correct target repository based on Monospecs analysis.',
            'Each sub-repo can have its own AGENTS.md, and Claude automatically follows the right conventions for each.',
          ],
        },
        {
          title: 'Vault Cross-Project Knowledge: Long-Term Memory for Claude',
          summary: 'Register once, reuse everywhere — Vault supports folder, coderef, obsidian, and system-managed types.',
          details: [
            'Each new proposal automatically receives Vault context — Claude "knows" your available learning resources and reference projects from the start.',
            'Vaults can be marked reference (read-only) or editable, keeping AI freedom controllable.',
            'Monospecs expands Claude\'s spatial awareness; Vault extends Claude\'s memory across time — together, Claude becomes a long-term partner who truly understands your project landscape.',
          ],
        },
        {
          title: 'OmniRoute Model Routing: Unbundling CLI From Model, Freeing Claude',
          summary: 'CLI handles interaction experience; the model layer handles capability supply — no longer a forced bundle.',
          details: [
            'Keep Claude Code as your interaction frontend with its excellent multi-turn reasoning and tool-calling experience, while freely choosing the most cost-effective model source underneath.',
            'Multiple Agents can use different model routes independently. When a model price changes or a new model launches, adjust once in the OmniRoute layer.',
            'The relationship between CLI and model shifts from "marriage" to "partnership."',
          ],
        },
      ],
    },
    summary: {
      sectionTitle: 'Summary',
      paragraphs: [
        'Claude is a world-class AI model; HagiCode is a workspace purpose-built for AI coding. Their relationship is complementary, not competitive.',
      ],
      bullets: [
        'Claude provides intelligence: massive context, deep reasoning, safety alignment',
        'HagiCode provides efficiency: multi-threaded parallelism, Agent fleet management, OpenSpec proposals, AI commits, Code Server editor, Preset Tasks',
        'HagiCode expands boundaries: Monospecs for cross-repo understanding, Vault for long-term memory, OmniRoute to unbundle model subscriptions',
        'Together they deliver the experience: traceable decision chains, automated routine tasks, a delightful interface, and a long-term AI partner who knows your full project landscape',
      ],
      closing:
        "If you're already using Claude, try connecting it to HagiCode — you'll find you haven't just gained another tool, but an entire working methodology.",
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Resolver                                                           */
/* ------------------------------------------------------------------ */

export function getClaudeVsHagicodePageModel(locale: SiteLocale): ClaudeVsHagicodePageModel {
  const resolved = resolveSiteLocale(locale);

  for (const candidate of [resolved, ...getSiteLocaleFallbackChain(resolved)]) {
    const model = catalog[candidate];
    if (model) return model;
  }

  const fallback = catalog[DEFAULT_LOCALE];
  if (!fallback) throw new Error('Missing ClaudeVsHagicode copy fallback');
  return fallback;
}
