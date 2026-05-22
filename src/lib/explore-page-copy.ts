import {
  DEFAULT_LOCALE,
  getSiteLocaleFallbackChain,
  resolveSiteLocale,
  type SiteLocale,
} from '@/i18n/locale-metadata';

export type ExploreMapAccent = 'core' | 'surface' | 'delivery' | 'labs';

interface ExploreNodeBase {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: string;
  readonly sourcePath: string;
  readonly accent: ExploreMapAccent;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly highlights: readonly string[];
  readonly details: readonly string[];
  readonly relatedIds: readonly string[];
}

export interface ExploreRootNode extends ExploreNodeBase {
  readonly kind: 'root';
}

export interface ExploreHubNode extends ExploreNodeBase {
  readonly kind: 'hub';
  readonly parentId: string;
}

export interface ExploreProductNode extends ExploreNodeBase {
  readonly kind: 'product';
  readonly parentId: string;
}

export type ExploreMapNode = ExploreRootNode | ExploreHubNode | ExploreProductNode;

export interface ExplorePageModel {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly ui: {
    readonly canvasLabel: string;
    readonly controlsLabel: string;
    readonly controls: {
      readonly zoomIn: string;
      readonly zoomOut: string;
      readonly reset: string;
    };
    readonly overviewEyebrow: string;
    readonly overviewTitle: string;
    readonly overviewDescription: string;
    readonly detail: {
      readonly highlightsTitle: string;
      readonly detailsTitle: string;
      readonly relatedTitle: string;
      readonly noRelated: string;
      readonly sourceTitle: string;
      readonly relatedHubLabel: string;
    };
  };
  readonly root: ExploreRootNode;
  readonly hubs: readonly ExploreHubNode[];
  readonly products: readonly ExploreProductNode[];
}

interface ExploreAdaptedMap {
  readonly root: ExploreRootNode;
  readonly hubs: readonly ExploreHubNode[];
  readonly products: readonly ExploreProductNode[];
}

interface ExploreUiCopy {
  readonly seo: ExplorePageModel['seo'];
  readonly ui: ExplorePageModel['ui'];
}

const exploreMapData: ExploreAdaptedMap = {
  "root": {
    "id": "hagicode-root",
    "kind": "root",
    "depth": 0,
    "sourcePath": "site.explore.copied-feature-map",
    "accent": "core",
    "title": "HagiCode user-facing feature map",
    "status": "Feature map",
    "summary": "Root-level capability reference focused on what users can obtain, use, and feel.",
    "highlights": [
      "Metadata",
      "Shared user value",
      "Product surfaces"
    ],
    "details": [
      "This map is stored directly inside the site explore data layer.",
      "HagiCode user-facing feature map",
      "repos/web",
      "Browser-based daily workspace."
    ],
    "relatedIds": [
      "metadata",
      "shared_user_value",
      "products"
    ],
    "x": 3400,
    "y": 3400
  },
  "hubs": [
    {
      "id": "metadata",
      "kind": "hub",
      "parentId": "hagicode-root",
      "depth": 1,
      "sourcePath": "hagicode.metadata",
      "accent": "delivery",
      "title": "Metadata",
      "status": "Primary branch",
      "summary": "HagiCode user-facing feature map",
      "highlights": [
        "Source repositories"
      ],
      "details": [
        "Root-level capability reference focused on what users can obtain, use, and feel.",
        "repos/web",
        "Browser-based daily workspace."
      ],
      "relatedIds": [
        "metadata__source_repositories"
      ],
      "x": 2643,
      "y": 3332
    },
    {
      "id": "metadata__source_repositories",
      "kind": "hub",
      "parentId": "metadata",
      "depth": 2,
      "sourcePath": "hagicode.metadata.source_repositories",
      "accent": "delivery",
      "title": "Source repositories",
      "status": "Branch group",
      "summary": "Repository sources preserved from the copied root feature map.",
      "highlights": [
        "Web product",
        "Core",
        "Desktop product"
      ],
      "details": [
        "repos/web",
        "Browser-based daily workspace.",
        "repos/hagicode-core"
      ],
      "relatedIds": [
        "metadata__source_repositories__web",
        "metadata__source_repositories__core",
        "metadata__source_repositories__desktop"
      ],
      "x": 1886,
      "y": 3264
    },
    {
      "id": "shared_user_value",
      "kind": "hub",
      "parentId": "hagicode-root",
      "depth": 1,
      "sourcePath": "hagicode.shared_user_value",
      "accent": "core",
      "title": "Shared user value",
      "status": "Primary branch",
      "summary": "2 mapped branches extend shared user value in the copied explore tree.",
      "highlights": [
        "Core journeys",
        "Featured capabilities"
      ],
      "details": [
        "Create and manage coding projects",
        "Run AI-assisted conversations and structured work sessions around those projects",
        "Keep project context, design notes, and references close to active work"
      ],
      "relatedIds": [
        "shared_user_value__core_journeys",
        "shared_user_value__featured_capabilities"
      ],
      "x": 3656,
      "y": 2685
    },
    {
      "id": "shared_user_value__core_journeys",
      "kind": "hub",
      "parentId": "shared_user_value",
      "depth": 2,
      "sourcePath": "hagicode.shared_user_value.core_journeys",
      "accent": "core",
      "title": "Core journeys",
      "status": "Branch group",
      "summary": "3 mapped branches extend core journeys in the copied explore tree.",
      "highlights": [
        "Project-centered AI work",
        "Proposal-driven change",
        "Live feedback and continuity"
      ],
      "details": [
        "Create and manage coding projects",
        "Run AI-assisted conversations and structured work sessions around those projects",
        "Keep project context, design notes, and references close to active work"
      ],
      "relatedIds": [
        "shared_user_value__core_journeys__project_centered_ai_work",
        "shared_user_value__core_journeys__proposal_driven_change",
        "shared_user_value__core_journeys__live_feedback_and_continuity"
      ],
      "x": 1943,
      "y": 2967
    },
    {
      "id": "shared_user_value__featured_capabilities",
      "kind": "hub",
      "parentId": "shared_user_value",
      "depth": 2,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities",
      "accent": "core",
      "title": "Featured capabilities",
      "status": "Branch group",
      "summary": "17 mapped branches extend featured capabilities in the copied explore tree.",
      "highlights": [
        "Executors",
        "Proposal And Review",
        "Guided proposal authoring"
      ],
      "details": [
        "Users are not locked to a single AI executor style",
        "Different executors can be matched to different coding habits, task shapes, and ecosystem preferences",
        "Users who already have a preferred executor ecosystem"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors",
        "shared_user_value__featured_capabilities__proposal_and_review",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults",
        "shared_user_value__featured_capabilities__hero_system",
        "shared_user_value__featured_capabilities__languages",
        "shared_user_value__featured_capabilities__git_management",
        "shared_user_value__featured_capabilities__project_lifecycle",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
        "shared_user_value__featured_capabilities__collaboration_and_handoff",
        "shared_user_value__featured_capabilities__notifications_and_interruptions",
        "shared_user_value__featured_capabilities__results_and_deliverables",
        "shared_user_value__featured_capabilities__github_and_repository_presence",
        "shared_user_value__featured_capabilities__code_server_and_remote_workbench",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control"
      ],
      "x": 4037,
      "y": 2020
    },
    {
      "id": "shared_user_value__featured_capabilities__executors",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors",
      "accent": "core",
      "title": "Executors",
      "status": "Subsystem",
      "summary": "Users are not locked to a single AI executor style",
      "highlights": [
        "Integrated Choice Catalog",
        "Guided Setup And Management",
        "User Visible Identity And Feedback"
      ],
      "details": [
        "Different executors can be matched to different coding habits, task shapes, and ecosystem preferences",
        "Users who already have a preferred executor ecosystem",
        "Teams that need to compare different executor styles on the same project"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback",
        "shared_user_value__featured_capabilities__executors__selection_logic_and_workflow_fit",
        "shared_user_value__featured_capabilities__executors__setup_and_readiness_experience",
        "shared_user_value__featured_capabilities__executors__users_can_do"
      ],
      "x": 1502,
      "y": 2173
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_and_review",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_and_review",
      "accent": "core",
      "title": "Proposal And Review",
      "status": "Subsystem",
      "summary": "Structured change work is easier to govern than ad-hoc chat alone",
      "highlights": [
        "Users Can Do"
      ],
      "details": [
        "Review surfaces make generated plans and artifacts easier to inspect before action",
        "Users who need more discipline than free-form chat provides",
        "Teams that want clearer review checkpoints before execution"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_and_review__users_can_do"
      ],
      "x": 1790,
      "y": 1814
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_entry_modes_and_guided_authoring",
      "accent": "core",
      "title": "Guided proposal authoring",
      "status": "Subsystem",
      "summary": "Proposal quality improves when users can start from the amount of structure they actually have",
      "highlights": [
        "Entry Paths",
        "Guided Composition",
        "Safety And Repair"
      ],
      "details": [
        "Guided drafting reduces abandonment when a change idea is still rough, incomplete, or risky",
        "Users who sometimes begin with only a rough idea and need help turning it into a usable proposal",
        "Users who want the product to teach the proposal workflow while they are using it"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__entry_paths",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__guided_composition",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__safety_and_repair",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__onboarding_and_help"
      ],
      "x": 2038,
      "y": 1597
    },
    {
      "id": "shared_user_value__featured_capabilities__skills_prompts_and_vaults",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.skills_prompts_and_vaults",
      "accent": "core",
      "title": "Skills, prompts, and vaults",
      "status": "Subsystem",
      "summary": "Reusable capabilities, prompts, and stored materials reduce repeated setup work",
      "highlights": [
        "Skills",
        "Prompts And Profiles",
        "Vaults"
      ],
      "details": [
        "Users can build a richer working environment instead of starting from scratch every time",
        "Users who repeat similar workflows across projects",
        "Users building a personal or team-curated knowledge and tooling layer"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__skills",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__prompts_and_profiles",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__vaults"
      ],
      "x": 2432,
      "y": 1358
    },
    {
      "id": "shared_user_value__featured_capabilities__hero_system",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.hero_system",
      "accent": "core",
      "title": "Hero system",
      "status": "Subsystem",
      "summary": "Heroes turn abstract AI preferences into reusable working personas",
      "highlights": [
        "Users Can Do"
      ],
      "details": [
        "The system adds continuity, identity, and game-like progression to repeated use",
        "Users who want stable working personas instead of ad-hoc session setup",
        "Users who enjoy game-like progression and visual identity in tooling"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__hero_system__users_can_do"
      ],
      "x": 2676,
      "y": 1259
    },
    {
      "id": "shared_user_value__featured_capabilities__languages",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.languages",
      "accent": "core",
      "title": "Languages",
      "status": "Subsystem",
      "summary": "Users can localize the product interface without giving up core features",
      "highlights": [
        "Interface Language Support",
        "Ai Output Language"
      ],
      "details": [
        "Interface language and AI output language are treated as related but distinct choices",
        "Users who prefer a localized interface",
        "Multilingual users who want one interface language but another AI output language"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__languages__interface_language_support",
        "shared_user_value__featured_capabilities__languages__ai_output_language"
      ],
      "x": 2866,
      "y": 1204
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management",
      "accent": "core",
      "title": "Git management",
      "status": "Subsystem",
      "summary": "Git work stays inside the same product flow as session, proposal, and repository context",
      "highlights": [
        "Repository Scope",
        "Status Readability",
        "Everyday Operations"
      ],
      "details": [
        "Multi-repository projects get a first-class Git view instead of a single-root approximation",
        "Users working in Git daily inside project-focused AI workflows",
        "Users managing multi-repository workspaces"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__repository_scope",
        "shared_user_value__featured_capabilities__git_management__status_readability",
        "shared_user_value__featured_capabilities__git_management__everyday_operations",
        "shared_user_value__featured_capabilities__git_management__sync_and_recovery",
        "shared_user_value__featured_capabilities__git_management__ai_assisted_commit"
      ],
      "x": 3323,
      "y": 1141
    },
    {
      "id": "shared_user_value__featured_capabilities__project_lifecycle",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_lifecycle",
      "accent": "core",
      "title": "Project lifecycle",
      "status": "Subsystem",
      "summary": "Users need a complete path from project creation to safe cleanup, not just a place to open chats",
      "highlights": [
        "Creation Paths",
        "Maintenance And Identity",
        "Safety And Cleanup"
      ],
      "details": [
        "Clear project lifecycle controls reduce setup friction and accidental data loss",
        "Users organizing multiple coding projects inside one AI workspace",
        "Users importing existing repositories and multi-repository workspaces"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_lifecycle__creation_paths",
        "shared_user_value__featured_capabilities__project_lifecycle__maintenance_and_identity",
        "shared_user_value__featured_capabilities__project_lifecycle__safety_and_cleanup"
      ],
      "x": 3848,
      "y": 1185
    },
    {
      "id": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.workspace_bootstrap_and_demo",
      "accent": "core",
      "title": "Workspace bootstrap and demo",
      "status": "Subsystem",
      "summary": "New users need a fast path to first value before they invest in deeper setup",
      "highlights": [
        "Fast Start Paths",
        "Guided Readiness",
        "First Value"
      ],
      "details": [
        "Guided bootstrap flows reduce the intimidation of a large multi-surface product",
        "First-time users entering HagiCode with no prepared workspace",
        "Users evaluating whether the product fits their workflow"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__fast_start_paths",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__guided_readiness",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__first_value"
      ],
      "x": 4227,
      "y": 1297
    },
    {
      "id": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.operational_recovery_and_self_healing",
      "accent": "core",
      "title": "Operational recovery and self-healing",
      "status": "Subsystem",
      "summary": "Users trust the product more when failures turn into guided recovery instead of dead ends",
      "highlights": [
        "Failure Detection And Visibility",
        "Guided Recovery Paths",
        "Continuity During Recovery"
      ],
      "details": [
        "Broken local state is less costly when the product can route users toward the next safe repair step",
        "Users running HagiCode locally through Desktop-managed workflows",
        "Users who hit missing dependencies, damaged versions, or startup failures and need a recoverable path"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__failure_detection_and_visibility",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__guided_recovery_paths",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__continuity_during_recovery",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__support_ready_evidence"
      ],
      "x": 4636,
      "y": 1508
    },
    {
      "id": "shared_user_value__featured_capabilities__collaboration_and_handoff",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.collaboration_and_handoff",
      "accent": "core",
      "title": "Collaboration and handoff",
      "status": "Subsystem",
      "summary": "AI work becomes more reusable when sessions, proposals, and diagnostics can be handed off cleanly",
      "highlights": [
        "Session Handoff",
        "Proposal Handoff",
        "Operational Handoff"
      ],
      "details": [
        "Review-friendly artifacts reduce the gap between individual exploration and broader team collaboration",
        "Users sharing progress with teammates or future selves",
        "Users who need audit-friendly outputs instead of transient chat only"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__collaboration_and_handoff__session_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__proposal_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__operational_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__safety_guardrails"
      ],
      "x": 5040,
      "y": 1845
    },
    {
      "id": "shared_user_value__featured_capabilities__notifications_and_interruptions",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.notifications_and_interruptions",
      "accent": "core",
      "title": "Notifications and interruptions",
      "status": "Subsystem",
      "summary": "Long-running AI work needs timely feedback without forcing users to stare at the screen constantly",
      "highlights": [
        "Delivery Channels",
        "Per Status Control",
        "Permissions And Reach"
      ],
      "details": [
        "Notification controls help users balance awareness with interruption cost",
        "Users juggling active sessions alongside other tools or meetings",
        "Users who need different alert intensities for different workflow states"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__notifications_and_interruptions__delivery_channels",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__per_status_control",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__permissions_and_reach",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__game_and_progress_feedback"
      ],
      "x": 5355,
      "y": 2267
    },
    {
      "id": "shared_user_value__featured_capabilities__results_and_deliverables",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.results_and_deliverables",
      "accent": "core",
      "title": "Results and deliverables",
      "status": "Subsystem",
      "summary": "Users need tangible outputs they can keep, review, or reuse after interactive work ends",
      "highlights": [
        "Exports And Archives",
        "Reports And Summaries",
        "Operational Evidence"
      ],
      "details": [
        "Clear result surfaces make progress feel concrete instead of disappearing into session history",
        "Users who treat HagiCode work as reusable project output",
        "Users who want summaries, exports, and reports rather than transient conversations only"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__results_and_deliverables__exports_and_archives",
        "shared_user_value__featured_capabilities__results_and_deliverables__reports_and_summaries",
        "shared_user_value__featured_capabilities__results_and_deliverables__operational_evidence",
        "shared_user_value__featured_capabilities__results_and_deliverables__achievement_memory"
      ],
      "x": 5564,
      "y": 2750
    },
    {
      "id": "shared_user_value__featured_capabilities__github_and_repository_presence",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.github_and_repository_presence",
      "accent": "core",
      "title": "GitHub and repository presence",
      "status": "Subsystem",
      "summary": "Repository work is more useful when users can connect their GitHub identity and act on repository-facing surfaces directly",
      "highlights": [
        "Connection And Identity",
        "Repository Remote Access",
        "Repository Presence Workflows"
      ],
      "details": [
        "HagiCode can help not only with local code changes, but also with how a repository is presented and reached",
        "Users whose projects live on GitHub-backed repositories",
        "Users who want a clearer bridge between local workspace work and GitHub-facing presence"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__github_and_repository_presence__connection_and_identity",
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_remote_access",
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_presence_workflows"
      ],
      "x": 5651,
      "y": 3202
    },
    {
      "id": "shared_user_value__featured_capabilities__code_server_and_remote_workbench",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.code_server_and_remote_workbench",
      "accent": "core",
      "title": "Code Server and remote workbench",
      "status": "Subsystem",
      "summary": "Users benefit from moving from chat, project, or vault context into a live coding workspace without rebuilding navigation manually",
      "highlights": [
        "Launch Entry Points",
        "Managed Runtime Experience"
      ],
      "details": [
        "A managed browser workbench lowers friction between AI guidance and hands-on file work",
        "Users who want to jump from HagiCode context into an editor-like workbench quickly",
        "Users working across projects, repositories, vaults, and session-linked local paths"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__code_server_and_remote_workbench__launch_entry_points",
        "shared_user_value__featured_capabilities__code_server_and_remote_workbench__managed_runtime_experience"
      ],
      "x": 5656,
      "y": 3532
    },
    {
      "id": "shared_user_value__featured_capabilities__project_operations_and_quick_actions",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_operations_and_quick_actions",
      "accent": "core",
      "title": "Project operations and quick actions",
      "status": "Subsystem",
      "summary": "Frequent users need common project actions to stay one click away instead of reopening deep pages repeatedly",
      "highlights": [
        "Built In Actions",
        "Custom Commands",
        "Selection Sensitive Actions"
      ],
      "details": [
        "Quick operations reduce context-switching cost when users move between planning, Git work, and editor entry",
        "Users handling many small project operations throughout the day",
        "Users who want repeatable routines and shortcuts rather than navigating the full shell each time"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__built_in_actions",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__custom_commands",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__selection_sensitive_actions"
      ],
      "x": 5613,
      "y": 3858
    },
    {
      "id": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control",
      "kind": "hub",
      "parentId": "shared_user_value__featured_capabilities",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.multi_repository_navigation_and_scope_control",
      "accent": "core",
      "title": "Multi-repository navigation and scope control",
      "status": "Subsystem",
      "summary": "Multi-repository work becomes error-prone when users cannot clearly see or choose scope",
      "highlights": [
        "Repository Navigation",
        "Scope Selection",
        "Multi Repository Context"
      ],
      "details": [
        "Read-only and editable scope distinctions help users reason about what each workflow is allowed to touch",
        "Users working in MonoSpecs-style or other multi-repository projects",
        "Users who need to navigate between main repositories, sub-repositories, and referenced projects without losing clarity"
      ],
      "relatedIds": [
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__repository_navigation",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__scope_selection",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__multi_repository_context"
      ],
      "x": 5499,
      "y": 4237
    },
    {
      "id": "products",
      "kind": "hub",
      "parentId": "hagicode-root",
      "depth": 1,
      "sourcePath": "hagicode.products",
      "accent": "surface",
      "title": "Product surfaces",
      "status": "Primary branch",
      "summary": "3 mapped branches extend product surfaces in the copied explore tree.",
      "highlights": [
        "PCode.Client + PCode.Index",
        "HagiCode shared platform",
        "HagiCode Desktop"
      ],
      "details": [
        "Main browser workspace for daily HagiCode usage.",
        "Daily users who spend long periods inside a browser-based AI coding workspace",
        "Users who need project, session, and support panels to stay connected instead of opening separate tools"
      ],
      "relatedIds": [
        "products__web",
        "products__shared_platform",
        "products__desktop"
      ],
      "x": 3209,
      "y": 4136
    },
    {
      "id": "products__web",
      "kind": "hub",
      "parentId": "products",
      "depth": 2,
      "sourcePath": "hagicode.products.web",
      "accent": "surface",
      "title": "PCode.Client + PCode.Index",
      "status": "Branch group",
      "summary": "Main browser workspace for daily HagiCode usage.",
      "highlights": [
        "Identity",
        "User experience"
      ],
      "details": [
        "PCode.Client + PCode.Index",
        "Daily users who spend long periods inside a browser-based AI coding workspace",
        "Users who need project, session, and support panels to stay connected instead of opening separate tools"
      ],
      "relatedIds": [
        "products__web__identity",
        "products__web__user_experience"
      ],
      "x": 3941,
      "y": 4820
    },
    {
      "id": "products__web__user_experience",
      "kind": "hub",
      "parentId": "products__web",
      "depth": 3,
      "sourcePath": "hagicode.products.web.user_experience",
      "accent": "surface",
      "title": "User experience",
      "status": "Subsystem",
      "summary": "22 mapped branches extend user experience in the copied explore tree.",
      "highlights": [
        "Workspace shell",
        "Workspace bootstrap and demo",
        "Project lifecycle"
      ],
      "details": [
        "Daily users who spend long periods inside a browser-based AI coding workspace",
        "Users who need project, session, and support panels to stay connected instead of opening separate tools",
        "Users managing more than one repository or more than one active work stream"
      ],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle",
        "products__web__user_experience__project_operations_and_quick_actions",
        "products__web__user_experience__multi_repository_navigation_and_scope_control",
        "products__web__user_experience__sessions_and_conversations",
        "products__web__user_experience__proposals_and_review",
        "products__web__user_experience__proposal_entry_modes_and_guided_authoring",
        "products__web__user_experience__collaboration_and_handoff",
        "products__web__user_experience__project_knowledge",
        "products__web__user_experience__github_and_repository_presence",
        "products__web__user_experience__git_management_and_ai_commit",
        "products__web__user_experience__executor_prompt_skill_experience",
        "products__web__user_experience__vaults_and_reusable_assets",
        "products__web__user_experience__code_server_and_remote_workbench",
        "products__web__user_experience__language_and_personalization",
        "products__web__user_experience__notifications_and_interruptions",
        "products__web__user_experience__hero_and_game_system",
        "products__web__user_experience__results_and_deliverables",
        "products__web__user_experience__alternate_entry_points",
        "products__web__user_experience__voice_and_assisted_composer",
        "products__web__user_experience__loading_experience"
      ],
      "x": 4144,
      "y": 5534
    },
    {
      "id": "products__shared_platform",
      "kind": "hub",
      "parentId": "products",
      "depth": 2,
      "sourcePath": "hagicode.products.shared_platform",
      "accent": "delivery",
      "title": "HagiCode shared platform",
      "status": "Branch group",
      "summary": "Shared product behavior users experience through web and desktop.",
      "highlights": [
        "Identity",
        "User value"
      ],
      "details": [
        "HagiCode shared platform",
        "Users who expect long-running work to survive beyond one browser tab or one sitting",
        "Returning to active or archived work after context switching"
      ],
      "relatedIds": [
        "products__shared_platform__identity",
        "products__shared_platform__user_value"
      ],
      "x": 2460,
      "y": 4595
    },
    {
      "id": "products__shared_platform__user_value",
      "kind": "hub",
      "parentId": "products__shared_platform",
      "depth": 3,
      "sourcePath": "hagicode.products.shared_platform.user_value",
      "accent": "delivery",
      "title": "User value",
      "status": "Subsystem",
      "summary": "11 mapped branches extend user value in the copied explore tree.",
      "highlights": [
        "Continuity and history",
        "Structured change support",
        "Project and asset support"
      ],
      "details": [
        "Users who expect long-running work to survive beyond one browser tab or one sitting",
        "Returning to active or archived work after context switching",
        "Watching live progress during longer-running conversations or proposal flows"
      ],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support",
        "products__shared_platform__user_value__operational_support",
        "products__shared_platform__user_value__guided_authoring_paths",
        "products__shared_platform__user_value__handoff_and_deliverables",
        "products__shared_platform__user_value__onboarding_and_bootstrap",
        "products__shared_platform__user_value__recovery_and_self_healing",
        "products__shared_platform__user_value__notifications_and_awareness",
        "products__shared_platform__user_value__repository_presence_and_remote_workbench",
        "products__shared_platform__user_value__quick_operations_and_scope_control"
      ],
      "x": 1954,
      "y": 5137
    },
    {
      "id": "products__desktop",
      "kind": "hub",
      "parentId": "products",
      "depth": 2,
      "sourcePath": "hagicode.products.desktop",
      "accent": "labs",
      "title": "HagiCode Desktop",
      "status": "Branch group",
      "summary": "Local desktop control center for installing, running, and managing HagiCode.",
      "highlights": [
        "Identity",
        "User experience"
      ],
      "details": [
        "HagiCode Desktop",
        "x64",
        "arm64"
      ],
      "relatedIds": [
        "products__desktop__identity",
        "products__desktop__user_experience"
      ],
      "x": 1942,
      "y": 3829
    },
    {
      "id": "products__desktop__identity",
      "kind": "hub",
      "parentId": "products__desktop",
      "depth": 3,
      "sourcePath": "hagicode.products.desktop.identity",
      "accent": "labs",
      "title": "Identity",
      "status": "Subsystem",
      "summary": "HagiCode Desktop",
      "highlights": [
        "Supported platforms"
      ],
      "details": [
        "Local desktop control center for installing, running, and managing HagiCode.",
        "x64",
        "arm64"
      ],
      "relatedIds": [
        "products__desktop__identity__supported_platforms"
      ],
      "x": 1420,
      "y": 4489
    },
    {
      "id": "products__desktop__user_experience",
      "kind": "hub",
      "parentId": "products__desktop",
      "depth": 3,
      "sourcePath": "hagicode.products.desktop.user_experience",
      "accent": "labs",
      "title": "User experience",
      "status": "Subsystem",
      "summary": "8 mapped branches extend user experience in the copied explore tree.",
      "highlights": [
        "First run and setup",
        "Operational recovery and self-healing",
        "Local runtime control"
      ],
      "details": [
        "Users preparing a local HagiCode environment for the first time",
        "Users who want guided machine setup rather than manual command-line assembly",
        "Users returning to a broken setup and needing a clear recovery path"
      ],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control",
        "products__desktop__user_experience__version_and_update_management",
        "products__desktop__user_experience__dependency_and_tooling_management",
        "products__desktop__user_experience__language_and_accessibility",
        "products__desktop__user_experience__diagnostics_and_logs",
        "products__desktop__user_experience__convenience_features"
      ],
      "x": 1215,
      "y": 3978
    }
  ],
  "products": [
    {
      "id": "metadata__source_repositories__web",
      "kind": "product",
      "parentId": "metadata__source_repositories",
      "depth": 3,
      "sourcePath": "hagicode.metadata.source_repositories.web",
      "accent": "delivery",
      "title": "Web product",
      "status": "Leaf node",
      "summary": "repos/web",
      "highlights": [
        "Browser-based daily workspace.",
        "repos/web"
      ],
      "details": [],
      "relatedIds": [
        "metadata__source_repositories__core",
        "metadata__source_repositories__desktop"
      ],
      "x": 1143,
      "y": 3293
    },
    {
      "id": "metadata__source_repositories__core",
      "kind": "product",
      "parentId": "metadata__source_repositories",
      "depth": 3,
      "sourcePath": "hagicode.metadata.source_repositories.core",
      "accent": "delivery",
      "title": "Core",
      "status": "Leaf node",
      "summary": "repos/hagicode-core",
      "highlights": [
        "Shared platform capabilities experienced through product behavior.",
        "repos/hagicode-core"
      ],
      "details": [],
      "relatedIds": [
        "metadata__source_repositories__web",
        "metadata__source_repositories__desktop"
      ],
      "x": 1149,
      "y": 3197
    },
    {
      "id": "metadata__source_repositories__desktop",
      "kind": "product",
      "parentId": "metadata__source_repositories",
      "depth": 3,
      "sourcePath": "hagicode.metadata.source_repositories.desktop",
      "accent": "delivery",
      "title": "Desktop product",
      "status": "Leaf node",
      "summary": "repos/hagicode-desktop",
      "highlights": [
        "Native desktop control center for local usage.",
        "repos/hagicode-desktop"
      ],
      "details": [],
      "relatedIds": [
        "metadata__source_repositories__web",
        "metadata__source_repositories__core"
      ],
      "x": 1160,
      "y": 3103
    },
    {
      "id": "shared_user_value__core_journeys__project_centered_ai_work",
      "kind": "product",
      "parentId": "shared_user_value__core_journeys",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.core_journeys.project_centered_ai_work",
      "accent": "core",
      "title": "Project-centered AI work",
      "status": "Leaf node",
      "summary": "Create and manage coding projects",
      "highlights": [
        "Run AI-assisted conversations and structured work sessions around those projects",
        "Keep project context, design notes, and references close to active work",
        "Works for single-repository projects and MonoSpecs-style multi-repository workspaces"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__core_journeys__proposal_driven_change",
        "shared_user_value__core_journeys__live_feedback_and_continuity"
      ],
      "x": 1204,
      "y": 2864
    },
    {
      "id": "shared_user_value__core_journeys__proposal_driven_change",
      "kind": "product",
      "parentId": "shared_user_value__core_journeys",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.core_journeys.proposal_driven_change",
      "accent": "core",
      "title": "Proposal-driven change",
      "status": "Leaf node",
      "summary": "Turn ideas into structured proposals",
      "highlights": [
        "Refine proposal names, validate steps, and review proposal artifacts before execution",
        "Archive completed proposal flows for later lookup and reuse",
        "Proposal work is not isolated from project context, Git context, or session history"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__core_journeys__project_centered_ai_work",
        "shared_user_value__core_journeys__live_feedback_and_continuity"
      ],
      "x": 1234,
      "y": 2756
    },
    {
      "id": "shared_user_value__core_journeys__live_feedback_and_continuity",
      "kind": "product",
      "parentId": "shared_user_value__core_journeys",
      "depth": 3,
      "sourcePath": "hagicode.shared_user_value.core_journeys.live_feedback_and_continuity",
      "accent": "core",
      "title": "Live feedback and continuity",
      "status": "Leaf node",
      "summary": "See live status while work is running",
      "highlights": [
        "Revisit archived sessions and earlier outputs",
        "Move between active work, past work, and related assets without losing continuity",
        "Live progress is visible instead of hidden behind background execution"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__core_journeys__project_centered_ai_work",
        "shared_user_value__core_journeys__proposal_driven_change"
      ],
      "x": 1268,
      "y": 2649
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.integrated_choice_catalog",
      "accent": "core",
      "title": "Integrated Choice Catalog",
      "status": "Leaf node",
      "summary": "Claude Code",
      "highlights": [
        "Codex",
        "GitHub Copilot CLI",
        "OpenCode"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback",
        "shared_user_value__featured_capabilities__executors__selection_logic_and_workflow_fit"
      ],
      "x": 693,
      "y": 2108
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.guided_setup_and_management",
      "accent": "core",
      "title": "Guided Setup And Management",
      "status": "Leaf node",
      "summary": "Claude Code",
      "highlights": [
        "Codex",
        "GitHub Copilot CLI",
        "OpenCode"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback",
        "shared_user_value__featured_capabilities__executors__selection_logic_and_workflow_fit"
      ],
      "x": 763,
      "y": 1970
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.user_visible_identity_and_feedback",
      "accent": "core",
      "title": "User Visible Identity And Feedback",
      "status": "Leaf node",
      "summary": "User Visible Identity And Feedback is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Execution mode labels that show which executor is currently active",
        "Executor-specific names and recognizable identities during active work",
        "Thinking, queued, cancelling, and completed states tied to the current executor"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__selection_logic_and_workflow_fit"
      ],
      "x": 840,
      "y": 1837
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__selection_logic_and_workflow_fit",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.selection_logic_and_workflow_fit",
      "accent": "core",
      "title": "Selection Logic And Workflow Fit",
      "status": "Leaf node",
      "summary": "Selection Logic And Workflow Fit is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Keep one executor for free-form coding conversations and another for more structured work",
        "Match executor choice to planning-heavy, execution-heavy, or Git-heavy tasks",
        "Pair executors with heroes, profiles, and prompts so workflow style stays coherent"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback"
      ],
      "x": 923,
      "y": 1707
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__setup_and_readiness_experience",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.setup_and_readiness_experience",
      "accent": "core",
      "title": "Setup And Readiness Experience",
      "status": "Leaf node",
      "summary": "A visible executor catalog with familiar names rather than one hidden default only",
      "highlights": [
        "Readiness checks before some workflows depend on a local executor path",
        "Setup guidance, remediation clues, and documentation entry points when a chosen executor is missing",
        "A visible difference between executors Desktop can help prepare directly and executors that are mainly..."
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback"
      ],
      "x": 1013,
      "y": 1582
    },
    {
      "id": "shared_user_value__featured_capabilities__executors__users_can_do",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__executors",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.executors.users_can_do",
      "accent": "core",
      "title": "Users Can Do",
      "status": "Leaf node",
      "summary": "Choose executor preference for ongoing work",
      "highlights": [
        "Align executor choice with personal workflow or project needs",
        "Use executor-related personalization together with heroes, prompts, and settings",
        "Use executors in regular coding conversations"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__executors__integrated_choice_catalog",
        "shared_user_value__featured_capabilities__executors__guided_setup_and_management",
        "shared_user_value__featured_capabilities__executors__user_visible_identity_and_feedback"
      ],
      "x": 1110,
      "y": 1462
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_and_review__users_can_do",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__proposal_and_review",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_and_review.users_can_do",
      "accent": "core",
      "title": "Users Can Do",
      "status": "Leaf node",
      "summary": "Start from a structured proposal drawer",
      "highlights": [
        "Start from a quick idea and turn it into a fuller proposal path",
        "Pick project context, repository scope, vault scope, and path references while drafting",
        "Keep proposal work tied to active project and repository context"
      ],
      "details": [],
      "relatedIds": [],
      "x": 1263,
      "y": 1294
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__entry_paths",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_entry_modes_and_guided_authoring.entry_paths",
      "accent": "core",
      "title": "Entry Paths",
      "status": "Leaf node",
      "summary": "Entry Paths is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Start from a quick idea when the requirement is still rough",
        "Start from a more structured proposal path when the user already knows the change shape",
        "Reopen an unfinished draft without rebuilding the full setup from zero"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__guided_composition",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__safety_and_repair",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__onboarding_and_help"
      ],
      "x": 1421,
      "y": 1145
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__guided_composition",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_entry_modes_and_guided_authoring.guided_composition",
      "accent": "core",
      "title": "Guided Composition",
      "status": "Leaf node",
      "summary": "Guided Composition is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Move through basic setup, scope, preview, composer, and action-oriented areas in one drawer",
        "Read the current drafting state without guessing which fields still matter",
        "Use quick examples and drafting helpers to shape the requirement text"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__entry_paths",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__safety_and_repair",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__onboarding_and_help"
      ],
      "x": 1534,
      "y": 1051
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__safety_and_repair",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_entry_modes_and_guided_authoring.safety_and_repair",
      "accent": "core",
      "title": "Safety And Repair",
      "status": "Leaf node",
      "summary": "Safety And Repair is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Receive an unsaved-changes confirmation before closing an in-progress proposal drawer",
        "Keep the draft open when submission fails instead of losing the current work",
        "Correct proposal names through a guided dialog instead of manually fixing files outside the product"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__entry_paths",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__guided_composition",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__onboarding_and_help"
      ],
      "x": 1651,
      "y": 962
    },
    {
      "id": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__onboarding_and_help",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.proposal_entry_modes_and_guided_authoring.onboarding_and_help",
      "accent": "core",
      "title": "Onboarding And Help",
      "status": "Leaf node",
      "summary": "Replay a guided tour for the proposal drawer when they want another walkthrough",
      "highlights": [
        "Follow help, about, or community-oriented guidance linked from the authoring flow",
        "Learn proposal workflow structure while staying inside the actual drafting surface",
        "Replay a guided tour for the proposal drawer when they want another walkthrough"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__entry_paths",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__guided_composition",
        "shared_user_value__featured_capabilities__proposal_entry_modes_and_guided_authoring__safety_and_repair"
      ],
      "x": 1773,
      "y": 880
    },
    {
      "id": "shared_user_value__featured_capabilities__skills_prompts_and_vaults__skills",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__skills_prompts_and_vaults",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.skills_prompts_and_vaults.skills",
      "accent": "core",
      "title": "Skills",
      "status": "Leaf node",
      "summary": "Skills is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Browse local skills, recommendation results, gallery entries, and trusted-source views from one module",
        "Move between owned skills and installable skills without leaving the same workspace area",
        "Search gallery skills by keyword"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__prompts_and_profiles",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__vaults"
      ],
      "x": 1984,
      "y": 755
    },
    {
      "id": "shared_user_value__featured_capabilities__skills_prompts_and_vaults__prompts_and_profiles",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__skills_prompts_and_vaults",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.skills_prompts_and_vaults.prompts_and_profiles",
      "accent": "core",
      "title": "Prompts And Profiles",
      "status": "Leaf node",
      "summary": "Prompts And Profiles is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Use prompt catalogs as reusable workflow building blocks",
        "Refresh or revisit prompt assets when needed",
        "Choose chat profiles and standard phrases"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__skills",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__vaults"
      ],
      "x": 2115,
      "y": 689
    },
    {
      "id": "shared_user_value__featured_capabilities__skills_prompts_and_vaults__vaults",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__skills_prompts_and_vaults",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.skills_prompts_and_vaults.vaults",
      "accent": "core",
      "title": "Vaults",
      "status": "Leaf node",
      "summary": "Vaults is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Create, edit, and delete vaults",
        "Maintain different vault types for different working styles",
        "Keep general-purpose vaults, code-reference vaults, and note-oriented vaults separate when needed"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__skills",
        "shared_user_value__featured_capabilities__skills_prompts_and_vaults__prompts_and_profiles"
      ],
      "x": 2250,
      "y": 629
    },
    {
      "id": "shared_user_value__featured_capabilities__hero_system__users_can_do",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__hero_system",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.hero_system.users_can_do",
      "accent": "core",
      "title": "Users Can Do",
      "status": "Leaf node",
      "summary": "Browse hero lists, filters, and selection cards",
      "highlights": [
        "Pick heroes for recommendation and workflow routing scenarios",
        "Reassign or swap heroes in downstream flows without rebuilding the rest of the setup",
        "Review hero timelines and history filters"
      ],
      "details": [],
      "relatedIds": [],
      "x": 2440,
      "y": 558
    },
    {
      "id": "shared_user_value__featured_capabilities__languages__interface_language_support",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__languages",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.languages.interface_language_support",
      "accent": "core",
      "title": "Interface Language Support",
      "status": "Leaf node",
      "summary": "Interface Language Support is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Simplified Chinese",
        "Traditional Chinese",
        "English"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__languages__ai_output_language"
      ],
      "x": 2621,
      "y": 503
    },
    {
      "id": "shared_user_value__featured_capabilities__languages__ai_output_language",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__languages",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.languages.ai_output_language",
      "accent": "core",
      "title": "Ai Output Language",
      "status": "Leaf node",
      "summary": "Follow the current interface language",
      "highlights": [
        "Force AI output to Chinese",
        "Force AI output to English",
        "Users can decide whether AI should track the interface automatically or stay fixed to a working language"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__languages__interface_language_support"
      ],
      "x": 2763,
      "y": 468
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management__repository_scope",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__git_management",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management.repository_scope",
      "accent": "core",
      "title": "Repository Scope",
      "status": "Leaf node",
      "summary": "View the main repository and sub-repositories in one place",
      "highlights": [
        "Search and filter repository lists quickly",
        "Move between repositories without losing workspace context",
        "Designed for MonoSpecs and other multi-repository workspaces"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__status_readability",
        "shared_user_value__featured_capabilities__git_management__everyday_operations",
        "shared_user_value__featured_capabilities__git_management__sync_and_recovery"
      ],
      "x": 2999,
      "y": 427
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management__status_readability",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__git_management",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management.status_readability",
      "accent": "core",
      "title": "Status Readability",
      "status": "Leaf node",
      "summary": "Read enough Git state to decide whether to stage, sync, rebase, or open a deeper commit flow",
      "highlights": [
        "Understand when a repository is not ready for a given operation before triggering it",
        "Clean vs dirty working tree indicators",
        "Clear staged and unstaged counts"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__repository_scope",
        "shared_user_value__featured_capabilities__git_management__everyday_operations",
        "shared_user_value__featured_capabilities__git_management__sync_and_recovery"
      ],
      "x": 3148,
      "y": 411
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management__everyday_operations",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__git_management",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management.everyday_operations",
      "accent": "core",
      "title": "Everyday Operations",
      "status": "Leaf node",
      "summary": "Everyday Operations is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Stage selected files",
        "Unstage selected files",
        "Inspect diffs before acting"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__repository_scope",
        "shared_user_value__featured_capabilities__git_management__status_readability",
        "shared_user_value__featured_capabilities__git_management__sync_and_recovery"
      ],
      "x": 3298,
      "y": 402
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management__sync_and_recovery",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__git_management",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management.sync_and_recovery",
      "accent": "core",
      "title": "Sync And Recovery",
      "status": "Leaf node",
      "summary": "Sync And Recovery is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Success and failure messages for pull, push, and rebase actions",
        "Clearer explanation when upstream tracking, remote rejection, or fast-forward conditions block a sync step",
        "Rebase flows that check readiness before continuing"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__repository_scope",
        "shared_user_value__featured_capabilities__git_management__status_readability",
        "shared_user_value__featured_capabilities__git_management__everyday_operations"
      ],
      "x": 3448,
      "y": 400
    },
    {
      "id": "shared_user_value__featured_capabilities__git_management__ai_assisted_commit",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__git_management",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.git_management.ai_assisted_commit",
      "accent": "core",
      "title": "Ai Assisted Commit",
      "status": "Leaf node",
      "summary": "Git commit help is integrated into the project workspace instead of being a detached helper",
      "highlights": [
        "AI-assisted commit drafting can reuse the same personalization system as the rest of HagiCode",
        "The flow stays user-steerable even when AI is helping with branch naming, authorship shaping, or commit...",
        "Launch an AI-assisted commit drafting flow from Git work"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__git_management__repository_scope",
        "shared_user_value__featured_capabilities__git_management__status_readability",
        "shared_user_value__featured_capabilities__git_management__everyday_operations"
      ],
      "x": 3597,
      "y": 407
    },
    {
      "id": "shared_user_value__featured_capabilities__project_lifecycle__creation_paths",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_lifecycle",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_lifecycle.creation_paths",
      "accent": "core",
      "title": "Creation Paths",
      "status": "Leaf node",
      "summary": "Creation Paths is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Create a single project with name, path, and description",
        "Receive early validation while choosing the project path",
        "Scan directories and create multiple projects from discovered Git repositories"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_lifecycle__maintenance_and_identity",
        "shared_user_value__featured_capabilities__project_lifecycle__safety_and_cleanup"
      ],
      "x": 3849,
      "y": 434
    },
    {
      "id": "shared_user_value__featured_capabilities__project_lifecycle__maintenance_and_identity",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_lifecycle",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_lifecycle.maintenance_and_identity",
      "accent": "core",
      "title": "Maintenance And Identity",
      "status": "Leaf node",
      "summary": "Maintenance And Identity is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Edit project name, path, and description later",
        "Review project metadata such as identifiers and recent modification information",
        "Assign icons or avatars for quicker project recognition"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_lifecycle__creation_paths",
        "shared_user_value__featured_capabilities__project_lifecycle__safety_and_cleanup"
      ],
      "x": 3994,
      "y": 459
    },
    {
      "id": "shared_user_value__featured_capabilities__project_lifecycle__safety_and_cleanup",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_lifecycle",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_lifecycle.safety_and_cleanup",
      "accent": "core",
      "title": "Safety And Cleanup",
      "status": "Leaf node",
      "summary": "Delete projects when they are no longer needed",
      "highlights": [
        "See when deletion is blocked by unarchived sessions or unfinished work",
        "Review blocking sessions before removing a project",
        "Delete projects when they are no longer needed"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_lifecycle__creation_paths",
        "shared_user_value__featured_capabilities__project_lifecycle__maintenance_and_identity"
      ],
      "x": 4137,
      "y": 492
    },
    {
      "id": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__fast_start_paths",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.workspace_bootstrap_and_demo.fast_start_paths",
      "accent": "core",
      "title": "Fast Start Paths",
      "status": "Leaf node",
      "summary": "Create a single project manually",
      "highlights": [
        "Batch-import existing repositories",
        "Launch a demo project from an official example repository",
        "Create a single project manually"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__guided_readiness",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__first_value"
      ],
      "x": 4359,
      "y": 557
    },
    {
      "id": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__guided_readiness",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.workspace_bootstrap_and_demo.guided_readiness",
      "accent": "core",
      "title": "Guided Readiness",
      "status": "Leaf node",
      "summary": "Receive path validation, duplicate-path warnings, and empty-directory guidance during setup",
      "highlights": [
        "See MonoSpecs-related guidance when the chosen path supports richer multi-repository behavior",
        "Receive path validation, duplicate-path warnings, and empty-directory guidance during setup"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__fast_start_paths",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__first_value"
      ],
      "x": 4497,
      "y": 608
    },
    {
      "id": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__first_value",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.workspace_bootstrap_and_demo.first_value",
      "accent": "core",
      "title": "First Value",
      "status": "Leaf node",
      "summary": "Reach a usable project shell more quickly after creation",
      "highlights": [
        "Learn the product through a concrete workspace instead of a blank state only",
        "Reach a usable project shell more quickly after creation"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__fast_start_paths",
        "shared_user_value__featured_capabilities__workspace_bootstrap_and_demo__guided_readiness"
      ],
      "x": 4633,
      "y": 665
    },
    {
      "id": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__failure_detection_and_visibility",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.operational_recovery_and_self_healing.failure_detection_and_visibility",
      "accent": "core",
      "title": "Failure Detection And Visibility",
      "status": "Leaf node",
      "summary": "Clear startup-failure summaries instead of silent breakage",
      "highlights": [
        "Dependency warning banners when important local tools are missing or damaged",
        "Runtime health, version state, and dependency readiness signals in one operating experience",
        "Clear startup-failure summaries instead of silent breakage"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__guided_recovery_paths",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__continuity_during_recovery",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__support_ready_evidence"
      ],
      "x": 4852,
      "y": 775
    },
    {
      "id": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__guided_recovery_paths",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.operational_recovery_and_self_healing.guided_recovery_paths",
      "accent": "core",
      "title": "Guided Recovery Paths",
      "status": "Leaf node",
      "summary": "Guided Recovery Paths is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Retry from a guided recovery path when service startup fails",
        "Reinstall the affected version and return to a fresh onboarding-style path when recovery succeeds",
        "Reopen setup guidance instead of being stranded in a broken partial state"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__failure_detection_and_visibility",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__continuity_during_recovery",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__support_ready_evidence"
      ],
      "x": 4979,
      "y": 849
    },
    {
      "id": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__continuity_during_recovery",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.operational_recovery_and_self_healing.continuity_during_recovery",
      "accent": "core",
      "title": "Continuity During Recovery",
      "status": "Leaf node",
      "summary": "Refreshed installed-version and active-version visibility after recovery actions run",
      "highlights": [
        "A clearer path back to normal usage without guessing whether the environment is now healthy",
        "Better preservation of user orientation while the product resets and reopens setup flows",
        "Refreshed installed-version and active-version visibility after recovery actions run"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__failure_detection_and_visibility",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__guided_recovery_paths",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__support_ready_evidence"
      ],
      "x": 5102,
      "y": 929
    },
    {
      "id": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__support_ready_evidence",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__operational_recovery_and_self_healing",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.operational_recovery_and_self_healing.support_ready_evidence",
      "accent": "core",
      "title": "Support Ready Evidence",
      "status": "Leaf node",
      "summary": "Open detailed startup-failure dialogs with summary, port, timestamp, and log information",
      "highlights": [
        "Copy failure and diagnostic information for teammate or support handoff",
        "Review warnings and logs in readable product surfaces instead of relying on console output alone",
        "Open detailed startup-failure dialogs with summary, port, timestamp, and log information"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__failure_detection_and_visibility",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__guided_recovery_paths",
        "shared_user_value__featured_capabilities__operational_recovery_and_self_healing__continuity_during_recovery"
      ],
      "x": 5221,
      "y": 1016
    },
    {
      "id": "shared_user_value__featured_capabilities__collaboration_and_handoff__session_handoff",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__collaboration_and_handoff",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.collaboration_and_handoff.session_handoff",
      "accent": "core",
      "title": "Session Handoff",
      "status": "Leaf node",
      "summary": "Session Handoff is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Export sessions as Markdown or JSON",
        "Decide which metadata scopes should travel with the export",
        "Shape exports for readable sharing or structured reuse without leaving the current session context"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__collaboration_and_handoff__proposal_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__operational_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__safety_guardrails"
      ],
      "x": 5420,
      "y": 1182
    },
    {
      "id": "shared_user_value__featured_capabilities__collaboration_and_handoff__proposal_handoff",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__collaboration_and_handoff",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.collaboration_and_handoff.proposal_handoff",
      "accent": "core",
      "title": "Proposal Handoff",
      "status": "Leaf node",
      "summary": "Review proposal markdown, diagrams, images, and annotations in one place",
      "highlights": [
        "Archive proposal outcomes for later reuse, inspection, or coordination",
        "Keep planning, review notes, and supporting references attached to the same proposal-shaped artifact",
        "Review proposal markdown, diagrams, images, and annotations in one place"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__collaboration_and_handoff__session_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__operational_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__safety_guardrails"
      ],
      "x": 5526,
      "y": 1283
    },
    {
      "id": "shared_user_value__featured_capabilities__collaboration_and_handoff__operational_handoff",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__collaboration_and_handoff",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.collaboration_and_handoff.operational_handoff",
      "accent": "core",
      "title": "Operational Handoff",
      "status": "Leaf node",
      "summary": "Copy desktop diagnostic reports for support or teammate handoff",
      "highlights": [
        "Share clearer operational evidence than raw ad-hoc console text alone",
        "Preserve enough surrounding context that another person can understand what failed and what was already tried",
        "Copy desktop diagnostic reports for support or teammate handoff"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__collaboration_and_handoff__session_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__proposal_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__safety_guardrails"
      ],
      "x": 5627,
      "y": 1390
    },
    {
      "id": "shared_user_value__featured_capabilities__collaboration_and_handoff__safety_guardrails",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__collaboration_and_handoff",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.collaboration_and_handoff.safety_guardrails",
      "accent": "core",
      "title": "Safety Guardrails",
      "status": "Leaf node",
      "summary": "Catch unarchived work before destructive cleanup actions",
      "highlights": [
        "Preserve clearer context while moving from planning to execution to archive",
        "Reduce the chance that valuable work disappears during project cleanup, review turnover, or troubleshooting...",
        "Make follow-up work feel like continuation instead of rediscovery"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__collaboration_and_handoff__session_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__proposal_handoff",
        "shared_user_value__featured_capabilities__collaboration_and_handoff__operational_handoff"
      ],
      "x": 5723,
      "y": 1502
    },
    {
      "id": "shared_user_value__featured_capabilities__notifications_and_interruptions__delivery_channels",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__notifications_and_interruptions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.notifications_and_interruptions.delivery_channels",
      "accent": "core",
      "title": "Delivery Channels",
      "status": "Leaf node",
      "summary": "Use toast, browser, speech, and sound-based notifications",
      "highlights": [
        "Preview reminder sounds before relying on them",
        "Receive Desktop update reminders and RSS-like awareness surfaces",
        "Use toast, browser, speech, and sound-based notifications"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__notifications_and_interruptions__per_status_control",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__permissions_and_reach",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__game_and_progress_feedback"
      ],
      "x": 5878,
      "y": 1709
    },
    {
      "id": "shared_user_value__featured_capabilities__notifications_and_interruptions__per_status_control",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__notifications_and_interruptions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.notifications_and_interruptions.per_status_control",
      "accent": "core",
      "title": "Per Status Control",
      "status": "Leaf node",
      "summary": "Configure notification behavior per workflow status instead of one global on-off switch",
      "highlights": [
        "Batch-toggle a full status row for faster tuning",
        "Configure notification behavior per workflow status instead of one global on-off switch"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__notifications_and_interruptions__delivery_channels",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__permissions_and_reach",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__game_and_progress_feedback"
      ],
      "x": 5958,
      "y": 1832
    },
    {
      "id": "shared_user_value__featured_capabilities__notifications_and_interruptions__permissions_and_reach",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__notifications_and_interruptions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.notifications_and_interruptions.permissions_and_reach",
      "accent": "core",
      "title": "Permissions And Reach",
      "status": "Leaf node",
      "summary": "Review browser notification permission state",
      "highlights": [
        "Install the web experience and subscribe to push where supported",
        "Review browser notification permission state"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__notifications_and_interruptions__delivery_channels",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__per_status_control",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__game_and_progress_feedback"
      ],
      "x": 6032,
      "y": 1960
    },
    {
      "id": "shared_user_value__featured_capabilities__notifications_and_interruptions__game_and_progress_feedback",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__notifications_and_interruptions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.notifications_and_interruptions.game_and_progress_feedback",
      "accent": "core",
      "title": "Game And Progress Feedback",
      "status": "Leaf node",
      "summary": "Enable or suppress daily achievement progress popovers",
      "highlights": [
        "Keep broader milestone visibility even when daily interruption level is reduced",
        "Enable or suppress daily achievement progress popovers"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__notifications_and_interruptions__delivery_channels",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__per_status_control",
        "shared_user_value__featured_capabilities__notifications_and_interruptions__permissions_and_reach"
      ],
      "x": 6099,
      "y": 2090
    },
    {
      "id": "shared_user_value__featured_capabilities__results_and_deliverables__exports_and_archives",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__results_and_deliverables",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.results_and_deliverables.exports_and_archives",
      "accent": "core",
      "title": "Exports And Archives",
      "status": "Leaf node",
      "summary": "Exports And Archives is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Take away session exports in Markdown or JSON",
        "Choose export scope intentionally so the artifact carries the right amount of project, path, prompt,...",
        "Keep archived sessions and proposals for later lookup and reuse"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__results_and_deliverables__reports_and_summaries",
        "shared_user_value__featured_capabilities__results_and_deliverables__operational_evidence",
        "shared_user_value__featured_capabilities__results_and_deliverables__achievement_memory"
      ],
      "x": 6202,
      "y": 2328
    },
    {
      "id": "shared_user_value__featured_capabilities__results_and_deliverables__reports_and_summaries",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__results_and_deliverables",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.results_and_deliverables.reports_and_summaries",
      "accent": "core",
      "title": "Reports And Summaries",
      "status": "Leaf node",
      "summary": "Reports And Summaries is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Battle-report style summaries with hero growth, Hagipower trends, and achievement progress",
        "Readable summary cards instead of raw counters only",
        "A broader sense of whether repeated usage is building momentum, breadth, or depth over time"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__results_and_deliverables__exports_and_archives",
        "shared_user_value__featured_capabilities__results_and_deliverables__operational_evidence",
        "shared_user_value__featured_capabilities__results_and_deliverables__achievement_memory"
      ],
      "x": 6251,
      "y": 2467
    },
    {
      "id": "shared_user_value__featured_capabilities__results_and_deliverables__operational_evidence",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__results_and_deliverables",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.results_and_deliverables.operational_evidence",
      "accent": "core",
      "title": "Operational Evidence",
      "status": "Leaf node",
      "summary": "Operational Evidence is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Copyable diagnostics reports for local troubleshooting",
        "Visible version and runtime health summaries during maintenance work",
        "Session and proposal artifacts that can double as evidence for review, support, or audit-style reconstruction"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__results_and_deliverables__exports_and_archives",
        "shared_user_value__featured_capabilities__results_and_deliverables__reports_and_summaries",
        "shared_user_value__featured_capabilities__results_and_deliverables__achievement_memory"
      ],
      "x": 6293,
      "y": 2607
    },
    {
      "id": "shared_user_value__featured_capabilities__results_and_deliverables__achievement_memory",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__results_and_deliverables",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.results_and_deliverables.achievement_memory",
      "accent": "core",
      "title": "Achievement Memory",
      "status": "Leaf node",
      "summary": "Daily and global progress surfaces that make unlocks, pending hints, and long-term reward accumulation inspectable",
      "highlights": [
        "A path from lightweight notification moments into fuller achievement and report surfaces",
        "Daily and global progress surfaces that make unlocks, pending hints, and long-term reward accumulation..."
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__results_and_deliverables__exports_and_archives",
        "shared_user_value__featured_capabilities__results_and_deliverables__reports_and_summaries",
        "shared_user_value__featured_capabilities__results_and_deliverables__operational_evidence"
      ],
      "x": 6329,
      "y": 2750
    },
    {
      "id": "shared_user_value__featured_capabilities__github_and_repository_presence__connection_and_identity",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__github_and_repository_presence",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.github_and_repository_presence.connection_and_identity",
      "accent": "core",
      "title": "Connection And Identity",
      "status": "Leaf node",
      "summary": "Review whether GitHub CLI authentication is available and connected",
      "highlights": [
        "Refresh connection state, copy the suggested login command, and open installation guidance when GitHub CLI...",
        "See the connected GitHub account identity and required permission scopes when available",
        "Review whether GitHub CLI authentication is available and connected"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_remote_access",
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_presence_workflows"
      ],
      "x": 6372,
      "y": 2991
    },
    {
      "id": "shared_user_value__featured_capabilities__github_and_repository_presence__repository_remote_access",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__github_and_repository_presence",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.github_and_repository_presence.repository_remote_access",
      "accent": "core",
      "title": "Repository Remote Access",
      "status": "Leaf node",
      "summary": "Open repository remotes in the browser from project and Git-related surfaces",
      "highlights": [
        "Keep repository-facing actions close to the same workspace used for coding and review",
        "Open repository remotes in the browser from project and Git-related surfaces"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__github_and_repository_presence__connection_and_identity",
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_presence_workflows"
      ],
      "x": 6388,
      "y": 3137
    },
    {
      "id": "shared_user_value__featured_capabilities__github_and_repository_presence__repository_presence_workflows",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__github_and_repository_presence",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.github_and_repository_presence.repository_presence_workflows",
      "accent": "core",
      "title": "Repository Presence Workflows",
      "status": "Leaf node",
      "summary": "Start GitHub About optimization flows for eligible GitHub-backed repositories",
      "highlights": [
        "Run the same optimization pattern from Git-aware vaults when the vault remote is GitHub-backed",
        "Start GitHub About optimization flows for eligible GitHub-backed repositories"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__github_and_repository_presence__connection_and_identity",
        "shared_user_value__featured_capabilities__github_and_repository_presence__repository_remote_access"
      ],
      "x": 6398,
      "y": 3284
    },
    {
      "id": "shared_user_value__featured_capabilities__code_server_and_remote_workbench__launch_entry_points",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__code_server_and_remote_workbench",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.code_server_and_remote_workbench.launch_entry_points",
      "accent": "core",
      "title": "Launch Entry Points",
      "status": "Leaf node",
      "summary": "Launch Entry Points is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Open an entire project or a selected repository context in Code Server",
        "Launch from project lists, quick actions, Git views, or related workspace panels",
        "Open a vault or a selected vault file path in Code Server"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__code_server_and_remote_workbench__managed_runtime_experience"
      ],
      "x": 6398,
      "y": 3501
    },
    {
      "id": "shared_user_value__featured_capabilities__code_server_and_remote_workbench__managed_runtime_experience",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__code_server_and_remote_workbench",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.code_server_and_remote_workbench.managed_runtime_experience",
      "accent": "core",
      "title": "Managed Runtime Experience",
      "status": "Leaf node",
      "summary": "Read Code Server runtime settings and current status from the product",
      "highlights": [
        "Launch managed windows in Desktop or open external browser sessions when supported",
        "Use the same workbench through Desktop-managed runtime flows and browser workspace entry points",
        "Read Code Server runtime settings and current status from the product"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__code_server_and_remote_workbench__launch_entry_points"
      ],
      "x": 6390,
      "y": 3648
    },
    {
      "id": "shared_user_value__featured_capabilities__project_operations_and_quick_actions__built_in_actions",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_operations_and_quick_actions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_operations_and_quick_actions.built_in_actions",
      "accent": "core",
      "title": "Built In Actions",
      "status": "Leaf node",
      "summary": "Open Code Server for the current project or selected repository scope",
      "highlights": [
        "Open repository remotes in a browser when available",
        "Open Git management for the whole project or a chosen repository",
        "Open project details and DESIGN.md-related flows from the same quick-actions area"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__custom_commands",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__selection_sensitive_actions"
      ],
      "x": 6364,
      "y": 3864
    },
    {
      "id": "shared_user_value__featured_capabilities__project_operations_and_quick_actions__custom_commands",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_operations_and_quick_actions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_operations_and_quick_actions.custom_commands",
      "accent": "core",
      "title": "Custom Commands",
      "status": "Leaf node",
      "summary": "Run custom quick actions defined for the current context",
      "highlights": [
        "Reuse repeatable project-side commands without rebuilding them each time",
        "Keep execution history for those quick actions in the broader settings area",
        "Run custom quick actions defined for the current context"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__built_in_actions",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__selection_sensitive_actions"
      ],
      "x": 6338,
      "y": 4008
    },
    {
      "id": "shared_user_value__featured_capabilities__project_operations_and_quick_actions__selection_sensitive_actions",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__project_operations_and_quick_actions",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.project_operations_and_quick_actions.selection_sensitive_actions",
      "accent": "core",
      "title": "Selection Sensitive Actions",
      "status": "Leaf node",
      "summary": "Apply actions to the currently hovered or selected repository path when relevant",
      "highlights": [
        "Include or exclude projects from broader all-project views where those controls are exposed",
        "Apply actions to the currently hovered or selected repository path when relevant"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__built_in_actions",
        "shared_user_value__featured_capabilities__project_operations_and_quick_actions__custom_commands"
      ],
      "x": 6304,
      "y": 4151
    },
    {
      "id": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__repository_navigation",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.multi_repository_navigation_and_scope_control.repository_navigation",
      "accent": "core",
      "title": "Repository Navigation",
      "status": "Leaf node",
      "summary": "See main repository and sub-repository groupings in one project-facing surface",
      "highlights": [
        "Read compact dirty-state, sync-state, and branch summaries per repository",
        "Move from repository status rows into deeper repository-specific actions and detail popovers",
        "See main repository and sub-repository groupings in one project-facing surface"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__scope_selection",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__multi_repository_context"
      ],
      "x": 6238,
      "y": 4373
    },
    {
      "id": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__scope_selection",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.multi_repository_navigation_and_scope_control.scope_selection",
      "accent": "core",
      "title": "Scope Selection",
      "status": "Leaf node",
      "summary": "Scope Selection is preserved as a copied node in the site-local explore tree.",
      "highlights": [
        "Select additional projects as references or editable targets",
        "Distinguish read-style reference scope from write-style editable scope",
        "Select repositories with explicit read or write intent during proposal-related work"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__repository_navigation",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__multi_repository_context"
      ],
      "x": 6187,
      "y": 4511
    },
    {
      "id": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__multi_repository_context",
      "kind": "product",
      "parentId": "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control",
      "depth": 4,
      "sourcePath": "hagicode.shared_user_value.featured_capabilities.multi_repository_navigation_and_scope_control.multi_repository_context",
      "accent": "core",
      "title": "Multi Repository Context",
      "status": "Leaf node",
      "summary": "Keep project, repository, and subpath context visible while triggering downstream actions",
      "highlights": [
        "Use repository-specific quick actions without losing the broader project view",
        "Keep project, repository, and subpath context visible while triggering downstream actions"
      ],
      "details": [],
      "relatedIds": [
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__repository_navigation",
        "shared_user_value__featured_capabilities__multi_repository_navigation_and_scope_control__scope_selection"
      ],
      "x": 6129,
      "y": 4646
    },
    {
      "id": "products__web__identity",
      "kind": "product",
      "parentId": "products__web",
      "depth": 3,
      "sourcePath": "hagicode.products.web.identity",
      "accent": "surface",
      "title": "Identity",
      "status": "Leaf node",
      "summary": "PCode.Client + PCode.Index",
      "highlights": [
        "Main browser workspace for daily HagiCode usage.",
        "PCode.Client + PCode.Index"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience"
      ],
      "x": 5292,
      "y": 4637
    },
    {
      "id": "products__web__user_experience__workspace_shell",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.workspace_shell",
      "accent": "surface",
      "title": "Workspace shell",
      "status": "Leaf node",
      "summary": "Daily users who spend long periods inside a browser-based AI coding workspace",
      "highlights": [
        "Users who need project, session, and support panels to stay connected instead of opening separate tools",
        "Users managing more than one repository or more than one active work stream",
        "Jumping between several projects during the same work day without rebuilding context each time"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle",
        "products__web__user_experience__project_operations_and_quick_actions"
      ],
      "x": 5777,
      "y": 5230
    },
    {
      "id": "products__web__user_experience__workspace_bootstrap_and_demo",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.workspace_bootstrap_and_demo",
      "accent": "surface",
      "title": "Workspace bootstrap and demo",
      "status": "Leaf node",
      "summary": "New users entering the browser workspace with no prepared project yet",
      "highlights": [
        "Users evaluating HagiCode before wiring in a real codebase",
        "Users who want a faster first step than manual environment assembly",
        "Opening the create-project dialog to decide between single, batch, and demo setup"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__project_lifecycle",
        "products__web__user_experience__project_operations_and_quick_actions"
      ],
      "x": 5673,
      "y": 5358
    },
    {
      "id": "products__web__user_experience__project_lifecycle",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.project_lifecycle",
      "accent": "surface",
      "title": "Project lifecycle",
      "status": "Leaf node",
      "summary": "Users managing several projects over time from the same browser workspace",
      "highlights": [
        "Users who need both flexible setup and guarded cleanup",
        "Creating a new project, refining its metadata, then deleting it later only after old work is resolved",
        "Maintaining project identity so crowded workspaces remain easy to scan"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_operations_and_quick_actions"
      ],
      "x": 5561,
      "y": 5481
    },
    {
      "id": "products__web__user_experience__project_operations_and_quick_actions",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.project_operations_and_quick_actions",
      "accent": "surface",
      "title": "Project operations and quick actions",
      "status": "Leaf node",
      "summary": "Users who prefer operating from quick context panels instead of opening full pages for every task",
      "highlights": [
        "Users who repeatedly trigger the same project-side actions during a work session",
        "Hovering a project card and immediately opening Code Server, Git, or repository remote actions",
        "Launching AI-assisted commit flows from a project surface before entering the dedicated Git tab"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 5443,
      "y": 5597
    },
    {
      "id": "products__web__user_experience__multi_repository_navigation_and_scope_control",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.multi_repository_navigation_and_scope_control",
      "accent": "surface",
      "title": "Multi-repository navigation and scope control",
      "status": "Leaf node",
      "summary": "Users who operate in MonoSpecs-style projects or any project with multiple repositories",
      "highlights": [
        "Users who need proposal scope to stay explicit across projects and repositories",
        "Inspecting main repository and sub-repository health from one project context panel",
        "Selecting project references or repository references with explicit read or write intent"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 5319,
      "y": 5706
    },
    {
      "id": "products__web__user_experience__sessions_and_conversations",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.sessions_and_conversations",
      "accent": "surface",
      "title": "Sessions and conversations",
      "status": "Leaf node",
      "summary": "Users who rely on conversation-driven coding help as a daily operating mode",
      "highlights": [
        "Users who need both lightweight chat and more structured task-oriented sessions",
        "Users who want session history to remain useful after the original run is over",
        "Starting a quick coding conversation from the main workspace and continuing it over multiple days"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 5189,
      "y": 5808
    },
    {
      "id": "products__web__user_experience__proposals_and_review",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.proposals_and_review",
      "accent": "surface",
      "title": "Proposals and review",
      "status": "Leaf node",
      "summary": "Users planning medium-to-large changes that deserve a staged flow",
      "highlights": [
        "Users who want proposal context to stay connected to project and repository scope",
        "Writing a proposal from rough requirements and turning it into a reviewable change plan",
        "Checking stage readiness before moving into execution or archive steps"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 5053,
      "y": 5903
    },
    {
      "id": "products__web__user_experience__proposal_entry_modes_and_guided_authoring",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.proposal_entry_modes_and_guided_authoring",
      "accent": "surface",
      "title": "Guided proposal authoring",
      "status": "Leaf node",
      "summary": "Users who want a gentler path from rough idea to structured proposal",
      "highlights": [
        "Users learning the proposal workflow for the first time inside the product",
        "Users who need draft safety and naming repair before review begins",
        "Choosing between quick idea and structured proposal entry depending on how mature the requirement is"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4913,
      "y": 5991
    },
    {
      "id": "products__web__user_experience__collaboration_and_handoff",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.collaboration_and_handoff",
      "accent": "surface",
      "title": "Collaboration and handoff",
      "status": "Leaf node",
      "summary": "Users who need to turn interactive AI work into reviewable artifacts",
      "highlights": [
        "Teams or individuals who revisit important sessions later",
        "Exporting a session to share or preserve outside the live UI",
        "Archiving proposal work after review and execution"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4768,
      "y": 6070
    },
    {
      "id": "products__web__user_experience__project_knowledge",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.project_knowledge",
      "accent": "surface",
      "title": "Project knowledge",
      "status": "Leaf node",
      "summary": "Users who want project standards and reference material to stay close to active AI work",
      "highlights": [
        "Teams that need stable project wording, design context, and repository references across sessions",
        "Users managing complex projects where path-level context matters during planning and review",
        "Maintaining project-specific wording or standards so future sessions stay aligned"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4618,
      "y": 6141
    },
    {
      "id": "products__web__user_experience__github_and_repository_presence",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.github_and_repository_presence",
      "accent": "surface",
      "title": "GitHub and repository presence",
      "status": "Leaf node",
      "summary": "Users whose active projects and vaults depend on GitHub-backed remotes",
      "highlights": [
        "Users who want GitHub-aware actions available from the same browser workspace used for coding",
        "Opening GitHub settings to confirm local authentication state",
        "Launching a repository remote in the browser while staying anchored to project context"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4465,
      "y": 6204
    },
    {
      "id": "products__web__user_experience__git_management_and_ai_commit",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.git_management_and_ai_commit",
      "accent": "surface",
      "title": "Git management and AI commit",
      "status": "Leaf node",
      "summary": "Users doing daily Git work inside the browser workspace instead of splitting off into another tool immediately",
      "highlights": [
        "Users who need repository status, sync operations, and AI-assisted commit help in one continuous flow",
        "Users working across several repositories and wanting one consistent Git surface",
        "Searching a multi-repository list, selecting one repository, then reviewing its working-tree and sync state"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4309,
      "y": 6259
    },
    {
      "id": "products__web__user_experience__executor_prompt_skill_experience",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.executor_prompt_skill_experience",
      "accent": "surface",
      "title": "Executor, prompt, and skill experience",
      "status": "Leaf node",
      "summary": "Users shaping a repeatable AI workflow instead of using one fixed default style",
      "highlights": [
        "Users who want executor choice, prompt assets, skills, and trust controls to work together",
        "Teams curating reusable setup for different projects or operator preferences",
        "Choosing one executor for regular coding and another for Git or proposal-heavy work"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 4150,
      "y": 6305
    },
    {
      "id": "products__web__user_experience__vaults_and_reusable_assets",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.vaults_and_reusable_assets",
      "accent": "surface",
      "title": "Vaults and reusable assets",
      "status": "Leaf node",
      "summary": "Users curating reusable references, notes, or Git-backed support materials",
      "highlights": [
        "Users who want project-adjacent assets without mixing everything into source trees",
        "Creating a vault for reusable research, code references, or documentation snippets",
        "Browsing and previewing vault files while drafting proposals or reviewing code"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3989,
      "y": 6342
    },
    {
      "id": "products__web__user_experience__code_server_and_remote_workbench",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.code_server_and_remote_workbench",
      "accent": "surface",
      "title": "Code Server and remote workbench",
      "status": "Leaf node",
      "summary": "Users who want a browser-based coding workbench one click away from project, Git, session, or vault context",
      "highlights": [
        "Users who treat Code Server as the execution surface paired with HagiCode planning and review",
        "Opening a project or repository in Code Server from a project list or Git panel",
        "Opening a vault path in Code Server while reviewing curated references"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3826,
      "y": 6370
    },
    {
      "id": "products__web__user_experience__language_and_personalization",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.language_and_personalization",
      "accent": "surface",
      "title": "Language and personalization",
      "status": "Leaf node",
      "summary": "Users tailoring the workspace for long daily usage",
      "highlights": [
        "Users who want language, AI output style, notification behavior, and workflow defaults to persist together",
        "Power users who maintain Git, GitHub, quick-action, and debug preferences from one settings surface",
        "Using a localized interface while keeping AI output in a preferred working language"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3661,
      "y": 6389
    },
    {
      "id": "products__web__user_experience__notifications_and_interruptions",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.notifications_and_interruptions",
      "accent": "surface",
      "title": "Notifications and interruptions",
      "status": "Leaf node",
      "summary": "Users who need to monitor work while multitasking outside the active tab",
      "highlights": [
        "Users who want fine-grained control over how loudly the product speaks back",
        "Granting browser notification permission and deciding whether the web app should be installed",
        "Tuning toast, browser, speech, and sound alerts by session status"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3496,
      "y": 6398
    },
    {
      "id": "products__web__user_experience__hero_and_game_system",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.hero_and_game_system",
      "accent": "surface",
      "title": "Hero and game system",
      "status": "Leaf node",
      "summary": "Users who want reusable persona-based setup",
      "highlights": [
        "Users who enjoy visual and progression-oriented workflow personalization",
        "Building distinct heroes for architecture, execution, research, or other work modes",
        "Reusing the same heroes across recommendations, routing, and repeated project sessions"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3331,
      "y": 6399
    },
    {
      "id": "products__web__user_experience__results_and_deliverables",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.results_and_deliverables",
      "accent": "surface",
      "title": "Results and deliverables",
      "status": "Leaf node",
      "summary": "Users who want concrete artifacts and summaries from repeated HagiCode usage",
      "highlights": [
        "Users who care about progress memory, reflection, and reusable outputs",
        "Exporting an important session after a successful run",
        "Opening a fullscreen battle report to review growth and momentum"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3165,
      "y": 6391
    },
    {
      "id": "products__web__user_experience__alternate_entry_points",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.alternate_entry_points",
      "accent": "surface",
      "title": "Alternate entry points",
      "status": "Leaf node",
      "summary": "Users who sometimes need a lighter or more focused way to enter the workspace",
      "highlights": [
        "Users monitoring or continuing session work away from the main desktop browser layout",
        "Users who want a separate control surface for remote text or command input",
        "Checking or continuing session work from a mobile-oriented route"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 3001,
      "y": 6373
    },
    {
      "id": "products__web__user_experience__voice_and_assisted_composer",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.voice_and_assisted_composer",
      "accent": "surface",
      "title": "Voice and assisted composer",
      "status": "Leaf node",
      "summary": "Users who want to speak, type, and insert structured references from one composer",
      "highlights": [
        "Users who alternate between keyboard-first work and hands-busy capture",
        "Users who want cross-device input without giving up the main workspace",
        "Speaking a draft into a supported composer, then polishing it by hand"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 2838,
      "y": 6347
    },
    {
      "id": "products__web__user_experience__loading_experience",
      "kind": "product",
      "parentId": "products__web__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.web.user_experience.loading_experience",
      "accent": "surface",
      "title": "Loading experience",
      "status": "Leaf node",
      "summary": "Users entering the browser product repeatedly and expecting startup to feel polished instead of abrupt",
      "highlights": [
        "Opening the app on slower networks or heavier workspaces where a clear startup bridge matters",
        "A lightweight branded loading entry before the main app takes over",
        "Product splash visuals during startup"
      ],
      "details": [],
      "relatedIds": [
        "products__web__user_experience__workspace_shell",
        "products__web__user_experience__workspace_bootstrap_and_demo",
        "products__web__user_experience__project_lifecycle"
      ],
      "x": 2676,
      "y": 6311
    },
    {
      "id": "products__shared_platform__identity",
      "kind": "product",
      "parentId": "products__shared_platform",
      "depth": 3,
      "sourcePath": "hagicode.products.shared_platform.identity",
      "accent": "delivery",
      "title": "Identity",
      "status": "Leaf node",
      "summary": "HagiCode shared platform",
      "highlights": [
        "Shared product behavior users experience through web and desktop.",
        "HagiCode shared platform"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value"
      ],
      "x": 2600,
      "y": 5514
    },
    {
      "id": "products__shared_platform__user_value__continuity_and_history",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.continuity_and_history",
      "accent": "delivery",
      "title": "Continuity and history",
      "status": "Leaf node",
      "summary": "Users who expect long-running work to survive beyond one browser tab or one sitting",
      "highlights": [
        "Returning to active or archived work after context switching",
        "Watching live progress during longer-running conversations or proposal flows",
        "Persistent project and session state"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support",
        "products__shared_platform__user_value__operational_support"
      ],
      "x": 2132,
      "y": 6119
    },
    {
      "id": "products__shared_platform__user_value__structured_change_support",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.structured_change_support",
      "accent": "delivery",
      "title": "Structured change support",
      "status": "Leaf node",
      "summary": "Users who need a governed path from idea to reviewed change",
      "highlights": [
        "Planning a change before execution",
        "Reviewing and archiving structured work for later traceability",
        "Proposal generation, optimization, validation, execution, and archiving support"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__project_and_asset_support",
        "products__shared_platform__user_value__operational_support"
      ],
      "x": 1994,
      "y": 6050
    },
    {
      "id": "products__shared_platform__user_value__project_and_asset_support",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.project_and_asset_support",
      "accent": "delivery",
      "title": "Project and asset support",
      "status": "Leaf node",
      "summary": "Users building a richer long-lived workspace instead of one-off chats only",
      "highlights": [
        "Bootstrapping a new project",
        "Reusing assets, references, or personas across later work",
        "Project creation, demo setup, and workspace validation"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__operational_support"
      ],
      "x": 1859,
      "y": 5974
    },
    {
      "id": "products__shared_platform__user_value__operational_support",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.operational_support",
      "accent": "delivery",
      "title": "Operational support",
      "status": "Leaf node",
      "summary": "Users who need the workspace to behave like an operating environment, not just a chat client",
      "highlights": [
        "Managing Git, versions, notifications, and preferences alongside active work",
        "Carrying the same profile and language choices across repeated sessions",
        "Git-aware workflows integrated into the same product journey"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1728,
      "y": 5891
    },
    {
      "id": "products__shared_platform__user_value__guided_authoring_paths",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.guided_authoring_paths",
      "accent": "delivery",
      "title": "Guided authoring paths",
      "status": "Leaf node",
      "summary": "Users who need structure while turning ideas into reviewable change plans",
      "highlights": [
        "Starting from a rough quick idea, then refining it through guided proposal authoring",
        "Multiple proposal entry modes, staged drafting surfaces, draft-safety guardrails, and in-product workflow...",
        "Users who need structure while turning ideas into reviewable change plans"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1602,
      "y": 5802
    },
    {
      "id": "products__shared_platform__user_value__handoff_and_deliverables",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.handoff_and_deliverables",
      "accent": "delivery",
      "title": "Handoff and deliverables",
      "status": "Leaf node",
      "summary": "Users who need durable outputs from both web work and desktop maintenance",
      "highlights": [
        "Exporting sessions, revisiting archives, or copying diagnostics for support",
        "Reusable exports, archives, reports, and diagnostics that outlive the original interaction",
        "Better continuity between active work, review, and later troubleshooting"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1481,
      "y": 5706
    },
    {
      "id": "products__shared_platform__user_value__onboarding_and_bootstrap",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.onboarding_and_bootstrap",
      "accent": "delivery",
      "title": "Onboarding and bootstrap",
      "status": "Leaf node",
      "summary": "Users entering HagiCode for the first time or from a partially prepared environment",
      "highlights": [
        "Creating the first project, trying a demo, or completing first-run desktop setup",
        "Guided entry paths that reduce time-to-first-value across web and desktop",
        "More confidence when deciding how to start using the product"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1364,
      "y": 5604
    },
    {
      "id": "products__shared_platform__user_value__recovery_and_self_healing",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.recovery_and_self_healing",
      "accent": "delivery",
      "title": "Recovery and self-healing",
      "status": "Leaf node",
      "summary": "Users who need the product to guide them out of broken local runtime states",
      "highlights": [
        "Recovering from startup failure, missing dependencies, or damaged local versions",
        "Failure summaries, warning banners, targeted repair routes, restart-safe recovery steps, and copyable...",
        "Users who need the product to guide them out of broken local runtime states"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1253,
      "y": 5496
    },
    {
      "id": "products__shared_platform__user_value__notifications_and_awareness",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.notifications_and_awareness",
      "accent": "delivery",
      "title": "Notifications and awareness",
      "status": "Leaf node",
      "summary": "Users who need timely awareness without constant manual checking",
      "highlights": [
        "Waiting for long-running work, milestone feedback, or update reminders",
        "Status-aware notifications, progress feedback, and update awareness across the product family",
        "Users who need timely awareness without constant manual checking"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1148,
      "y": 5382
    },
    {
      "id": "products__shared_platform__user_value__repository_presence_and_remote_workbench",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.repository_presence_and_remote_workbench",
      "accent": "delivery",
      "title": "Repository presence and remote workbench",
      "status": "Leaf node",
      "summary": "Users who need a tight bridge between repository-facing presence and live browser-based editing",
      "highlights": [
        "Confirming GitHub readiness, opening repository remotes, or jumping into Code Server from active work context",
        "GitHub-aware repository presence actions and multi-entry Code Server workbench access across the product...",
        "Users who need a tight bridge between repository-facing presence and live browser-based editing"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 1049,
      "y": 5263
    },
    {
      "id": "products__shared_platform__user_value__quick_operations_and_scope_control",
      "kind": "product",
      "parentId": "products__shared_platform__user_value",
      "depth": 4,
      "sourcePath": "hagicode.products.shared_platform.user_value.quick_operations_and_scope_control",
      "accent": "delivery",
      "title": "Quick operations and scope control",
      "status": "Leaf node",
      "summary": "Users who need fast project-side actions and explicit repository scope in the same workspace",
      "highlights": [
        "Triggering quick operations from project context while keeping multi-repository boundaries clear",
        "High-frequency quick actions and explicit multi-repository scope control that scale beyond a single...",
        "Users who need fast project-side actions and explicit repository scope in the same workspace"
      ],
      "details": [],
      "relatedIds": [
        "products__shared_platform__user_value__continuity_and_history",
        "products__shared_platform__user_value__structured_change_support",
        "products__shared_platform__user_value__project_and_asset_support"
      ],
      "x": 956,
      "y": 5140
    },
    {
      "id": "products__desktop__identity__supported_platforms",
      "kind": "product",
      "parentId": "products__desktop__identity",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.identity.supported_platforms",
      "accent": "labs",
      "title": "Supported platforms",
      "status": "Leaf node",
      "summary": "x64",
      "highlights": [
        "arm64",
        "x64"
      ],
      "details": [],
      "relatedIds": [],
      "x": 771,
      "y": 4846
    },
    {
      "id": "products__desktop__user_experience__first_run_and_setup",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.first_run_and_setup",
      "accent": "labs",
      "title": "First run and setup",
      "status": "Leaf node",
      "summary": "Users preparing a local HagiCode environment for the first time",
      "highlights": [
        "Users who want guided machine setup rather than manual command-line assembly",
        "Users returning to a broken setup and needing a clear recovery path",
        "Installing Desktop on a fresh machine and walking through the first-use flow"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control",
        "products__desktop__user_experience__version_and_update_management"
      ],
      "x": 673,
      "y": 4651
    },
    {
      "id": "products__desktop__user_experience__operational_recovery_and_self_healing",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.operational_recovery_and_self_healing",
      "accent": "labs",
      "title": "Operational recovery and self-healing",
      "status": "Leaf node",
      "summary": "Users recovering from local startup failure, missing dependencies, or damaged versions",
      "highlights": [
        "Users who need a clearer next action than repeated manual restarts",
        "Users collecting support-ready evidence while trying to get back to a healthy local state",
        "Seeing that the service failed to start and opening a detailed failure dialog"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__local_runtime_control",
        "products__desktop__user_experience__version_and_update_management"
      ],
      "x": 615,
      "y": 4516
    },
    {
      "id": "products__desktop__user_experience__local_runtime_control",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.local_runtime_control",
      "accent": "labs",
      "title": "Local runtime control",
      "status": "Leaf node",
      "summary": "Users running HagiCode locally and wanting a native control surface for daily start and stop work",
      "highlights": [
        "Operators who need immediate visibility into current runtime health",
        "Launching the local environment and confirming readiness before beginning work",
        "Using Desktop as the home screen for status, next actions, and quick navigation"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__version_and_update_management"
      ],
      "x": 564,
      "y": 4379
    },
    {
      "id": "products__desktop__user_experience__version_and_update_management",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.version_and_update_management",
      "accent": "labs",
      "title": "Version and update management",
      "status": "Leaf node",
      "summary": "Users who keep one or more local HagiCode versions installed",
      "highlights": [
        "Users who need a safer workflow for switching versions and following update guidance",
        "Installing a new version while keeping visibility into the currently active one",
        "Switching active versions during troubleshooting or staged rollout"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control"
      ],
      "x": 520,
      "y": 4239
    },
    {
      "id": "products__desktop__user_experience__dependency_and_tooling_management",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.dependency_and_tooling_management",
      "accent": "labs",
      "title": "Dependency and tooling management",
      "status": "Leaf node",
      "summary": "Desktop users responsible for keeping a local HagiCode environment healthy",
      "highlights": [
        "Users who want guided recovery instead of manual local tooling repair",
        "Preparing a fresh machine for HagiCode usage",
        "Recovering when code-server, OmniRoute, or executor-related tools are missing or damaged"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control"
      ],
      "x": 482,
      "y": 4097
    },
    {
      "id": "products__desktop__user_experience__language_and_accessibility",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.language_and_accessibility",
      "accent": "labs",
      "title": "Language and accessibility",
      "status": "Leaf node",
      "summary": "Users who want Desktop to remain comfortable across different language contexts and long maintenance sessions",
      "highlights": [
        "Users who expect theme and locale choices to remain easy to reach from the control surface",
        "Running the same desktop control center across multilingual teams or machines",
        "Switching theme or language during normal operations without restarting the overall workflow"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control"
      ],
      "x": 451,
      "y": 3953
    },
    {
      "id": "products__desktop__user_experience__diagnostics_and_logs",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.diagnostics_and_logs",
      "accent": "labs",
      "title": "Diagnostics and logs",
      "status": "Leaf node",
      "summary": "Users troubleshooting a local deployment",
      "highlights": [
        "Operators who need evidence and logs before attempting repair",
        "Users who want diagnostic results in a readable UI instead of assembling them manually",
        "Running a full diagnostic after startup fails or service health looks suspicious"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control"
      ],
      "x": 428,
      "y": 3808
    },
    {
      "id": "products__desktop__user_experience__convenience_features",
      "kind": "product",
      "parentId": "products__desktop__user_experience",
      "depth": 4,
      "sourcePath": "hagicode.products.desktop.user_experience.convenience_features",
      "accent": "labs",
      "title": "Convenience features",
      "status": "Leaf node",
      "summary": "Users who want the desktop control center to stay useful between major maintenance actions",
      "highlights": [
        "Users who prefer everyday operational convenience instead of a bare-bones admin shell",
        "Leaving Desktop open as a persistent local companion while using the main web workspace",
        "Checking reminders, updates, and related operational news during ordinary usage"
      ],
      "details": [],
      "relatedIds": [
        "products__desktop__user_experience__first_run_and_setup",
        "products__desktop__user_experience__operational_recovery_and_self_healing",
        "products__desktop__user_experience__local_runtime_control"
      ],
      "x": 411,
      "y": 3662
    }
  ]
};

const uiCopyCatalog: Partial<Record<SiteLocale, ExploreUiCopy>> = {
  "en-US": {
    "seo": {
      "title": "Explore HagiCode through the copied root structure",
      "description": "This explore page now keeps a much broader copy of the root HagiCode feature map structure directly inside the site repository, including the major shared-value and product-surface branches."
    },
    "ui": {
      "canvasLabel": "Interactive HagiCode explore tree",
      "controlsLabel": "Explore tree controls",
      "controls": {
        "zoomIn": "Zoom in",
        "zoomOut": "Zoom out",
        "reset": "Reset map position"
      },
      "overviewEyebrow": "Explore tree",
      "overviewTitle": "A copied structural map of the root feature inventory",
      "overviewDescription": "The page no longer compresses the feature map into a handful of branches. It now preserves a much larger part of the original hierarchy inside the site-local explore dataset.",
      "detail": {
        "highlightsTitle": "Highlights",
        "detailsTitle": "Details",
        "relatedTitle": "Related nodes",
        "noRelated": "This node does not link to another branch in the current explore layout.",
        "sourceTitle": "Source",
        "relatedHubLabel": "Cluster"
      }
    }
  },
  "zh-CN": {
    "seo": {
      "title": "从复制后的根级结构探索 HagiCode",
      "description": "这个 Explore 页面现在在站点仓库内保留了更完整的根级功能地图结构，不再只压缩成少量分支，而是把 shared_user_value 和 products 的大量层级一起展开。"
    },
    "ui": {
      "canvasLabel": "交互式 HagiCode 探索树",
      "controlsLabel": "探索树控制",
      "controls": {
        "zoomIn": "放大",
        "zoomOut": "缩小",
        "reset": "重置导图位置"
      },
      "overviewEyebrow": "Explore 树",
      "overviewTitle": "站内复制的根级功能结构图",
      "overviewDescription": "页面不再把功能地图压成少量分支，而是把 root 原始结构中的大量层级直接复制进 site 内置 explore 数据里。",
      "detail": {
        "highlightsTitle": "重点",
        "detailsTitle": "细节",
        "relatedTitle": "相关节点",
        "noRelated": "当前导图结构里，这个节点没有继续连接到其他分支。",
        "sourceTitle": "来源",
        "relatedHubLabel": "所属分组"
      }
    }
  }
};

function resolveExploreUiCopy(locale: SiteLocale): ExploreUiCopy {
  for (const candidate of [locale, ...getSiteLocaleFallbackChain(locale)]) {
    const value = uiCopyCatalog[candidate];
    if (value) {
      return value;
    }
  }

  const fallback = uiCopyCatalog[DEFAULT_LOCALE];
  if (!fallback) {
    throw new Error(`Missing explore UI fallback for ${DEFAULT_LOCALE}`);
  }

  return fallback;
}

export function getExplorePageModel(locale: SiteLocale): ExplorePageModel {
  const resolvedLocale = resolveSiteLocale(locale);
  const copy = resolveExploreUiCopy(resolvedLocale);

  return {
    seo: copy.seo,
    ui: copy.ui,
    root: exploreMapData.root,
    hubs: exploreMapData.hubs,
    products: exploreMapData.products,
  };
}
