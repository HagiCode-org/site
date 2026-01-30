# astro-site 规范增量

## REMOVED Requirements

### Requirement: Homepage Quick Start Section (已移除)

从首页移除快速开始引导区块,简化首页布局。该需求已废弃,因为快速开始功能与导航栏功能重复,且不再符合首页设计理念。

#### Scenario: 验证快速开始区块已完全移除 (已移除)

**Given** 首页已加载完成
**When** 我检查首页内容结构
**Then** 首页 MUST NOT 包含 QuickStartSection 组件
**And** 首页 MUST NOT 包含以下元素:
  - "快速开始"标题区块
  - 四步快速入门指南
  - "立即开始使用"行动号召按钮
**And** 首页 MUST 保留以下区块:
  - HeroSection (首屏区块)
  - ActivityMetricsSection (活动指标区块)
  - FeaturesShowcase (功能展示区块)
  - ShowcaseSection (产品截图展示区块)
  - VideoShowcase (视频展示区块)
  - Footer (页脚区块)

#### Scenario: 验证快速开始文档仍可访问 (已移除)

**Given** 首页快速开始区块已被移除
**When** 用户需要访问快速开始文档
**Then** 用户 MUST 能够通过导航栏访问快速开始文档
**And** 文档路径 `/docs/quick-start/` MUST 可正常访问
**And** 快速开始文档内容 MUST 完整保留

## MODIFIED Requirements

### Requirement: Homepage Video Showcase Section

The homepage MUST include a video showcase section that displays product demonstration videos using the Bilibili platform. This requirement is updated to remove references to the removed QuickStartSection.

#### Scenario: Video showcase integration with homepage

**Given** the homepage has multiple sections
**When** I inspect the section order
**Then** the sections MUST be ordered as:
  1. HeroSection (client:load)
  2. ActivityMetricsSection (client:visible)
  3. FeaturesShowcase (client:visible)
  4. ShowcaseSection (client:idle)
  5. VideoShowcase (client:visible)
**And** all sections MUST be properly separated with consistent vertical spacing
**And** the homepage structure MUST NOT include a QuickStartSection component

### Requirement: Homepage Product Screenshot Showcase Section

The homepage MUST include a product screenshot showcase section that displays actual product interface screenshots to demonstrate Hagicode's core features. This requirement is updated to remove references to the removed QuickStartSection.

#### Scenario: Screenshot showcase integration with homepage

**Given** the homepage has multiple sections
**When** I inspect the section order
**Then** the sections MUST be ordered as:
  1. HeroSection (client:load)
  2. ActivityMetricsSection (client:visible)
  3. FeaturesShowcase (client:visible)
  4. ShowcaseSection - Product screenshot showcase (client:idle)
  5. VideoShowcase (client:visible)
**And** the ShowcaseSection content MUST display product feature screenshots
**And** all sections MUST be properly separated with consistent vertical spacing
**And** the homepage structure MUST NOT include a QuickStartSection component

### Requirement: Custom Homepage

The site MUST have a custom homepage that provides a welcoming introduction to the Hagicode project. This requirement is updated to remove the Quick Start section from the homepage rendering specification.

#### Scenario: Homepage rendering

**Given** a user navigates to the site root
**When** the homepage loads
**Then** they MUST see a Hero section with the project title and description
**And** they MUST see Feature highlights
**And** they MUST see a Product showcase section
**And** they MUST see a Video showcase section
**And** the homepage structure MUST NOT display a Quick Start section
**And** all components MUST use Astro-compatible CSS variables for colors
