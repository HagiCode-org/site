## ADDED Requirements

### Requirement: LinkCard Navigation Consistency

Documentation pages MUST use Starlight's LinkCard component for navigation links to ensure consistent user experience across the documentation site.

#### Scenario: Installation guide next steps

**Given** the desktop installation guide at `apps/docs/src/content/docs/installation/desktop.mdx`
**When** I reach the "后续步骤" section
**Then** the section MUST use LinkCard components
**And** the section MUST include:
  - "创建第一个项目" link to `/quick-start/create-first-project`
  - "创建普通会话" link to `/quick-start/conversation-session`
  - "创建提案会话" link to `/quick-start/proposal-session`
**And** each card MUST have a clear description
**And** the section MUST import CardGrid and LinkCard from '@astrojs/starlight/components'

#### Scenario: OpenSpec setup next steps

**Given** the OpenSpec setup guide at `apps/docs/src/content/docs/setup-openspec.mdx`
**When** I reach the navigation links section
**Then** the section MUST use LinkCard components
**And** the section MUST provide clear next steps for users
**And** each card MUST have a clear description and valid href

#### Scenario: Conversation session next steps

**Given** the conversation session document at `apps/docs/src/content/docs/conversation-session.md`
**When** I reach the "后续步骤" section
**Then** the section MUST use LinkCard components
**And** the section MUST provide relevant next steps
**And** each card MUST have a clear description and valid href

#### Scenario: Node.js installation next steps

**Given** the Node.js installation guide at `apps/docs/src/content/docs/related-software-installation/nodejs/installation.md`
**When** I reach the navigation links section
**Then** the section MUST use LinkCard components
**And** the section MUST provide clear next steps
**And** each card MUST have a clear description and valid href

#### Scenario: LinkCard visual consistency

**Given** any documentation page using LinkCard components
**When** I view the rendered page
**Then** all LinkCard components MUST have consistent styling
**And** the styling MUST match the product-overview.mdx implementation
**And** hover effects MUST be present and functional
**And** the entire card area MUST be clickable

#### Scenario: LinkCard import statement

**Given** any documentation page that uses LinkCard components
**When** I inspect the file header
**Then** the file MUST include the import statement:
  `import { LinkCard, CardGrid } from '@astrojs/starlight/components';`
**And** the import MUST be placed before any content that uses these components
