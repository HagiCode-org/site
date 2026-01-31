## MODIFIED Requirements

### Requirement: Product Overview Documentation

The site MUST provide a comprehensive product overview document that uses storytelling and narrative techniques to introduce Hagicode, making it more accessible and engaging for new users while maintaining technical accuracy.

#### Scenario: Storytelling-based product introduction

- **GIVEN** a user visits the product overview page at `/product-overview`
- **WHEN** the page loads
- **THEN** the page MUST begin with a relatable user story or scenario that introduces Hagicode
- **AND** the story MUST use conversational, friendly language (second person "你")
- **AND** the story MUST capture the user's attention within 30 seconds of reading
- **AND** the introduction MUST transition smoothly into technical details

#### Scenario: User story scenarios for different roles

- **GIVEN** the product overview page is displayed
- **WHEN** a user reads the "使用故事" section
- **THEN** the page MUST include at least 3 user story scenarios:
  1. **开发者视角**: A story about quickly understanding a new codebase
  2. **技术负责人视角**: A story about managing complex changes with proposal-driven workflow
  3. **项目经理视角**: A story about team knowledge management and collaboration
- **AND** each story MUST follow a narrative structure: problem → solution (Hagicode) → value
- **AND** each story MUST use concrete, relatable situations rather than abstract descriptions

#### Scenario: Conversational comparison with competing tools

- **GIVEN** the product overview page is displayed
- **WHEN** a user reads the comparison section
- **THEN** the page MUST include scenario-based comparisons with:
  - **VS Code Copilot Chat**: Highlighting Hagicode's proposal sessions, permission controls, and knowledge management
  - **Cursor AI**: Highlighting Hagicode's session management, spec-driven development, and team features
  - **Kilo**: Highlighting Hagicode's deeper project integration and proposal-driven workflow
  - **Claude Code**: Highlighting Hagicode's enhanced session system, read/edit mode switching, and OpenSpec workflow integration
- **AND** each comparison MUST focus on specific usage scenarios, not feature lists
- **AND** comparisons MUST be presented in a clear, easy-to-understand format

#### Scenario: Friendly and accessible language style

- **GIVEN** the product overview page is displayed
- **WHEN** a user reads any section
- **THEN** the language MUST be conversational and approachable
- **AND** technical concepts MUST be explained using analogies or metaphors when appropriate
- **AND** the second person ("你") MUST be used to create engagement
- **AND** overly formal or academic language MUST be avoided
- **AND** professional credibility MUST be maintained while being friendly

#### Scenario: Technical accuracy preservation

- **GIVEN** the product overview page uses storytelling techniques
- **WHEN** a user reads technical content
- **THEN** ALL technical information MUST remain accurate and complete
- **AND** feature descriptions MUST NOT be simplified to the point of inaccuracy
- **AND** technical terminology MUST be used correctly
- **AND** the core capabilities matrix (会话管理, 对话功能, 项目管理, OpenSpec 集成) MUST be preserved
- **AND** Mermaid diagrams MUST render correctly

#### Scenario: Clear call-to-action and next steps

- **GIVEN** a user finishes reading the product overview
- **WHEN** they reach the end of the page
- **THEN** the page MUST provide clear guidance on next steps
- **AND** the "快速导航" section MUST use friendly, action-oriented language
- **AND** links MUST be provided to:
  - Installation guide
  - Quick start guides
  - Feature documentation
- **AND** the navigation path MUST be logical for new users

#### Scenario: Narrative structure optimization

- **GIVEN** the product overview page is displayed
- **WHEN** a user reads through the content
- **THEN** the content MUST follow a narrative structure:
  1. **开篇故事**: Hook the reader with a relatable scenario
  2. **核心价值**: Explain 3 core values in everyday language
  3. **用户故事**: 3 scenarios showing different user perspectives
  4. **竞品对比**: Scene-based comparisons with mainstream tools
  5. **快速开始**: Guide users to next actions
- **AND** transitions between sections MUST be smooth
- **AND** the structure MUST feel like a natural conversation, not a feature list

#### Scenario: Responsive design for storytelling content

- **GIVEN** the product overview page uses narrative storytelling
- **WHEN** viewed on different screen sizes
- **THEN** the story content MUST be readable on mobile devices (< 768px)
- **AND** user story scenarios MUST be properly formatted on all devices
- **AND** comparison tables MUST be responsive or scrollable on small screens
- **AND** text formatting MUST maintain readability across all screen sizes

#### Scenario: Dark mode compatibility

- **GIVEN** the product overview page is displayed
- **WHEN** a user switches between light and dark themes
- **THEN** all storytelling content MUST remain readable in both themes
- **AND** text contrast MUST meet WCAG AA standards (4.5:1 for body text)
- **AND** any highlighted text or callout boxes MUST adapt to the current theme
- **AND** the reading experience MUST be consistent across themes

#### Scenario: Build and type validation

- **GIVEN** the product overview documentation has been updated
- **WHEN** I run `npm run build`
- **THEN** the build MUST succeed without errors
- **AND** when I run `npm run typecheck`
- **THEN** TypeScript MUST pass with no type errors
- **AND** all internal links MUST be valid
- **AND** the page MUST render correctly in the production build
