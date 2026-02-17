# content-documentation Specification

## Purpose

Defines the requirements for content documentation quality, structure, and presentation across the Hagicode documentation site, ensuring clear communication of product value and effective user onboarding.

## Context

- **Project**: Hagicode Documentation
- **Framework**: Astro 5.x with Starlight
- **Language**: Chinese (Simplified) - Default and only language
- **Target Audience**: Developers, Technical Leads, Project Managers, Open Source Maintainers

---

## Requirements

### Requirement: Product Overview Document

The documentation MUST include a comprehensive product overview document that clearly communicates Hagicode's value proposition.

#### Scenario: Product overview document exists

**Given** the documentation site is running
**When** I navigate to the product overview page
**Then** a document at `/docs/product-overview` MUST exist
**And** the document MUST have a clear title "Hagicode 产品概述"
**And** the document MUST include a description summarizing the content

#### Scenario: Value proposition section

**Given** the product overview document exists
**When** I read the document content
**Then** the document MUST start with a "为什么选择 Hagicode?" section
**And** the section MUST include four core value points:
  - 提案驱动开发 (Proposal-driven development)
  - 双模式会话 (Dual-mode sessions)
  - AI 辅助编码 (AI-assisted coding)
  - 自举特性 (Self-bootstrapping feature)
**And** each value point MUST have a clear heading and detailed description

#### Scenario: Target user personas

**Given** the product overview document
**When** I read the value proposition section
**Then** the document MUST include a "目标用户画像" subsection
**And** it MUST describe at least four user types:
  - 新人工程师 (New engineers)
  - 技术负责人 (Technical leads)
  - 开源维护者 (Open source maintainers)
  - 独立开发者 (Independent developers)

### Requirement: Self-Bootstrapping Proof

The documentation MUST demonstrate Hagicode's self-bootstrapping capability.

#### Scenario: Self-bootstrapping section

**Given** the product overview document exists
**When** I read the document
**Then** the document MUST include a "自举证明" section
**And** the section MUST explain how Hagicode uses itself for development
**And** it MUST include subsections for:
  - 文档系统自举 (Documentation system self-bootstrapping)
  - 仓库管理自举 (Repository management self-bootstrapping)
  - 持续迭代自举 (Continuous iteration self-bootstrapping)

#### Scenario: Evidence links

**Given** the self-bootstrapping section
**When** I read the documentation system subsection
**Then** it MUST include a link to the actual OpenSpec proposal
**And** the link MUST be valid and accessible

### Requirement: Structured Feature Presentation

The documentation MUST present features in a clear, hierarchical structure.

#### Scenario: Three-tier feature organization

**Given** the product overview document
**When** I read the features section
**Then** features MUST be organized into three tiers:
  - 核心特性层 (Core feature layer)
  - 集成能力层 (Integration capability layer)
  - 用户体验层 (User experience layer)
**And** each tier MUST have a clear heading
**And** each tier MUST contain relevant feature descriptions

#### Scenario: Feature mindmap

**Given** the features section
**When** I view the document
**Then** a Mermaid mindmap MUST be included
**And** the mindmap MUST visualize the three-tier feature structure
**And** the mindmap MUST render correctly in both light and dark themes

### Requirement: Usage Examples

The documentation MUST include concrete usage examples for core features.

#### Scenario: Proposal-driven development example

**Given** the product overview document
**When** I read the usage examples section
**Then** a "提案驱动开发示例" MUST exist
**And** it MUST include:
  - A scenario description
  - Traditional approach comparison
  - Hagicode approach with code examples
  - Clear advantages listed

#### Scenario: Dual-mode session example

**Given** the usage examples section
**When** I look for session mode examples
**Then** a "双模式会话示例" MUST exist
**And** it MUST demonstrate:
  - Read-only mode usage scenario
  - Edit mode usage scenario
**And** each scenario MUST include example dialogue

#### Scenario: AI-assisted coding example

**Given** the usage examples section
**When** I read the coding examples
**Then** an "AI 辅助编码示例" MUST exist
**And** it MUST include:
  - A concrete coding task (e.g., LRU cache implementation)
  - Generated code with explanations
  - Complexity analysis

### Requirement: Enhanced User Stories

The documentation MUST include quantified user stories with specific metrics.

#### Scenario: Quantified new user story

**Given** the real user stories section
**When** I read the new user onboarding story
**Then** the story MUST include specific metrics:
  - Codebase size (e.g., 50,000+ lines)
  - Time saved (e.g., 5 days → 3 days, 40% improvement)
  - Quality improvement (e.g., 75 → 90 score)
**And** the story MUST clearly show before/after comparison

#### Scenario: Quantified complex change story

**Given** the real user stories section
**When** I read the complex change management story
**Then** the story MUST include specific metrics:
  - Number of files affected (e.g., 20+ files)
  - Documentation size (e.g., 15 pages)
  - Team size involved
  - Time reduction (e.g., 60% less review time)
**And** the story MUST demonstrate proposal workflow benefits

#### Scenario: Quantified knowledge retention story

**Given** the real user stories section
**When** I read the team knowledge story
**Then** the story MUST include specific metrics:
  - Number of comments/notes
  - Questions per day reduced
  - Onboarding time reduction (e.g., 3 weeks → 5 days, 70% improvement)
**And** the story MUST highlight knowledge preservation

### Requirement: Content Quality Standards

All documentation MUST meet quality standards for clarity and consistency.

#### Scenario: Terminology consistency

**Given** any documentation page
**When** I read the content
**Then** product name MUST be consistently written as "Hagicode"
**And** technical terms MUST use consistent translations
**And** feature names MUST match the actual product

#### Scenario: Link integrity

**Given** the product overview document
**When** I validate all links
**Then** all internal links MUST be valid
**And** all external links MUST be accessible
**And** image/resource paths MUST be correct

#### Scenario: Visual presentation

**Given** the documentation site
**When** I view the product overview page
**Then** content MUST be readable in light theme
**And** content MUST be readable in dark theme
**And** the page MUST be responsive on mobile devices
**And** the page MUST be responsive on tablet devices

---

## ADDED Requirements (from product-overview-optimization)

### Requirement: Product Overview Content Structure

The product overview document MUST follow a specific structure to effectively communicate value.

#### Scenario: Document structure compliance

**Given** the product overview document at `apps/docs/src/content/docs/product-overview.md`
**When** I inspect the document structure
**Then** the document MUST follow this order:
  1. 价值主张 (Value Proposition) - "为什么选择 Hagicode?"
  2. 产品定位 (Product Positioning) - Including "一个真实的场景" and "Hagicode 是什么?"
  3. 自举证明 (Self-Bootstrapping Proof) - "工具开发工具"
  4. 核心特性详解 (Core Features Details) - Three-tier structure
  5. 使用示例 (Usage Examples) - Code and scenario examples
  6. 真实使用故事 (Real User Stories) - With quantified metrics
  7. 快速开始导航 (Quick Start Navigation) - "从这里开始"

#### Scenario: Value proposition completeness

**Given** the value proposition section
**When** I review its content
**Then** it MUST include:
  - Four core value points with detailed descriptions
  - Target user persona descriptions
  - Clear differentiation from traditional AI assistants

#### Scenario: Self-bootstrapping evidence

**Given** the self-bootstrapping section
**When** I review the content
**Then** it MUST include:
  - Documentation system self-bootstrapping explanation
  - Repository management self-bootstrapping explanation
  - Continuous iteration self-bootstrapping explanation
  - Actual links to relevant OpenSpec proposals

#### Scenario: Feature presentation quality

**Given** the core features section
**When** I review the feature presentation
**Then** features MUST be organized in three tiers:
  - 核心特性层: 会话管理, 对话功能, 提案会话
  - 集成能力层: OpenSpec工作流, 图表注释, 项目管理
  - 用户体验层: 配置设置, 主题自定义, 统计成就
**And** a Mermaid mindmap MUST visualize this structure
**And** descriptions must be clear and concise

#### Scenario: Usage example quality

**Given** the usage examples section
**When** I review the examples
**Then** each example MUST include:
  - Clear scenario description
  - Concrete code or dialogue examples
  - Specific advantages highlighted
**And** examples MUST cover:
  - 提案驱动开发
  - 双模式会话
  - AI 辅助编码

#### Scenario: User story quantification

**Given** the real user stories section
**When** I review the stories
**Then** each story MUST include specific metrics:
  - Time saved (with percentage improvements)
  - Quality scores
  - Quantity measures (lines of code, files, questions, etc.)
**And** stories MUST demonstrate clear before/after comparisons

---

## CHANGED Requirements

### Requirement: Documentation Navigation

The product overview MUST provide clear navigation to related documentation.

#### Scenario: Quick start links

**Given** the product overview document
**When** I reach the end of the document
**Then** a "从这里开始" section MUST provide:
  - New user recommended reading path
  - Role-specific quick entry points
**And** all links MUST be valid and properly formatted

---

## DEPRECATED Requirements

None

---

## NON-COMPLIANT Issues

None currently documented.
