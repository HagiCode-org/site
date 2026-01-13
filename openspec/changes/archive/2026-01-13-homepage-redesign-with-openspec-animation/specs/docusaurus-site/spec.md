## ADDED Requirements

### Requirement: Custom Homepage Components

The documentation site MUST support custom React components on the homepage to provide a rich, interactive user experience that showcases PCode's core value propositions.

#### Scenario: Homepage loads with custom components

- **GIVEN** the Docusaurus site is running with custom homepage
- **WHEN** a user navigates to the root URL (`/`)
- **THEN** the homepage SHALL render using custom React components from `src/pages/index.tsx`
- **AND** the page SHALL include a Hero section with title, description, and CTA buttons
- **AND** the page SHALL include a Features section showcasing three core values
- **AND** the page SHALL include an OpenSpec workflow animation
- **AND** the page SHALL include a Showcase section with product screenshots
- **AND** all components SHALL render without errors

#### Scenario: Custom components support TypeScript

- **GIVEN** a developer creates a custom homepage component
- **WHEN** the component is written in TypeScript
- **THEN** TypeScript compilation SHALL succeed without errors
- **AND** type definitions SHALL be available for all Docusaurus and React APIs
- **AND** `npm run typecheck` SHALL pass

#### Scenario: Custom components support dark/light theme

- **GIVEN** the Docusaurus site has custom homepage components
- **WHEN** a user switches between light and dark themes
- **THEN** all homepage components SHALL update to match the selected theme
- **AND** components SHALL use Docusaurus CSS variables for colors
- **AND** no component SHALL have hardcoded colors that ignore theme settings

---

### Requirement: Homepage Hero Section

The homepage MUST include a Hero section that prominently displays the product name, tagline, and call-to-action buttons with an attractive gradient background.

#### Scenario: Hero section displays correctly

- **GIVEN** a user views the homepage
- **WHEN** the page loads
- **THEN** a Hero section SHALL be displayed at the top of the page
- **AND** the section SHALL display "PCode" as the main title
- **AND** the section SHALL display a tagline emphasizing "智能 · 便捷 · 有趣"
- **AND** the section SHALL include a "开始使用" button linking to installation guide
- **AND** the section SHALL include a "了解更多" button linking to feature guides

#### Scenario: Hero section has gradient background

- **GIVEN** the Hero section is rendered
- **WHEN** the user views the section
- **THEN** the background SHALL display a gradient from the site background color
- **AND** the gradient SHALL transition smoothly
- **AND** the gradient SHALL adapt to light and dark themes

#### Scenario: Hero section is responsive

- **GIVEN** the Hero section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) the title SHALL be 3rem font size
- **AND** on tablet (768px-1024px) the title SHALL scale proportionally
- **AND** on mobile (<768px) the title SHALL be 2rem font size
- **AND** buttons SHALL wrap appropriately on smaller screens

---

### Requirement: Homepage Features Section

The homepage MUST include a Features section that showcases PCode's three core value propositions: 智能 (Intelligent), 便捷 (Convenient), and 有趣 (Fun/Engaging).

#### Scenario: Features section displays three cards

- **GIVEN** a user scrolls to the Features section
- **WHEN** the section is rendered
- **THEN** three feature cards SHALL be displayed in a grid layout
- **AND** the first card SHALL represent "智能" with AI-driven capabilities
- **AND** the second card SHALL represent "便捷" with user-friendly features
- **AND** the third card SHALL represent "有趣" with gamification elements
- **AND** each card SHALL have an icon, title, and description

#### Scenario: Features section includes hover effects

- **GIVEN** the Features section is displayed
- **WHEN** a user hovers over a feature card
- **THEN** the card SHALL display a visual hover effect
- **AND** the effect SHALL use CSS transitions
- **AND** the effect SHALL not cause layout shifts

#### Scenario: Features section is responsive

- **GIVEN** the Features section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) cards SHALL be displayed in 3 columns
- **AND** on tablet (768px-1024px) cards SHALL be displayed in 2 columns with one card wrapping
- **AND** on mobile (<768px) cards SHALL be stacked vertically in a single column

---

### Requirement: OpenSpec Workflow Animation

The homepage MUST include an animated visualization of the OpenSpec workflow that demonstrates the flow from Idea to Proposal to Tasks to Archive with automatic playback and interactive hover states.

#### Scenario: Animation displays all workflow stages

- **GIVEN** a user scrolls to the OpenSpec Animation section
- **WHEN** the animation loads
- **THEN** four nodes SHALL be displayed: "💡 Idea", "📄 Proposal", "⚙️ Tasks", "✅ Archive"
- **AND** arrows SHALL connect each node in sequence
- **AND** each node SHALL have an icon and label
- **AND** the layout SHALL clearly show the progression from left to right (or top to bottom on mobile)

#### Scenario: Animation plays automatically in a loop

- **GIVEN** the OpenSpec Animation is loaded
- **WHEN** the user is not interacting with the animation
- **THEN** the animation SHALL automatically cycle through each stage
- **AND** each stage SHALL highlight in sequence with a glow effect
- **AND** arrows SHALL animate to show flow direction
- **AND** the cycle SHALL repeat continuously

#### Scenario: Animation pauses on hover and shows details

- **GIVEN** the OpenSpec Animation is playing
- **WHEN** a user hovers over any node
- **THEN** the automatic playback SHALL pause
- **AND** a tooltip SHALL appear with detailed information about that stage
- **AND** the node SHALL remain highlighted
- **AND** when the user moves the mouse away, playback SHALL resume

#### Scenario: Animation is responsive

- **GIVEN** the OpenSpec Animation is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) nodes SHALL be arranged horizontally
- **AND** on tablet and mobile (<1024px) nodes SHALL be arranged vertically
- **AND** arrow directions SHALL adjust to the layout (horizontal vs vertical)
- **AND** all elements SHALL remain clearly visible on mobile screens

#### Scenario: Animation performance is optimized

- **GIVEN** the OpenSpec Animation is running
- **WHEN** the animation plays
- **THEN** the animation SHALL use CSS transforms for position changes
- **AND** the animation SHALL use opacity for fade effects
- **AND** the animation frame rate SHALL remain at 60fps on modern devices
- **AND** the animation SHALL respect prefers-reduced-motion media query

---

### Requirement: Homepage Showcase Section

The homepage MUST include a Showcase section that displays actual product screenshots from the `static/img/home/` directory to demonstrate PCode's features in action.

#### Scenario: Showcase section displays product screenshots

- **GIVEN** a user scrolls to the Showcase section
- **WHEN** the section loads
- **THEN** screenshots SHALL be displayed in a responsive grid
- **AND** screenshots SHALL include: 亮色主题主界面.png, 暗色主题主界面.png
- **AND** screenshots SHALL include: 实时token消耗报告.png, 每日成就报告.png
- **AND** screenshots SHALL include: 使用 AI 的效率提升报告.png, 每日编写代码获得的成就.png
- **AND** each screenshot SHALL have a descriptive alt text in Chinese

#### Scenario: Showcase section uses lazy loading

- **GIVEN** the Showcase section contains multiple images
- **WHEN** the page initially loads
- **THEN** images SHALL use the native `loading="lazy"` attribute
- **AND** images SHALL load as the user scrolls near them
- **AND** initial page load SHALL NOT be blocked by image loading

#### Scenario: Showcase section has hover effects

- **GIVEN** the Showcase section is displayed
- **WHEN** a user hovers over a screenshot
- **THEN** the image SHALL display a subtle scale effect
- **AND** the effect SHALL use CSS transitions
- **AND** the effect SHALL not cause layout shifts

#### Scenario: Showcase section is responsive

- **GIVEN** the Showcase section is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) screenshots SHALL be displayed in 2 columns
- **AND** on tablet (768px-1024px) screenshots SHALL be displayed in 2 columns
- **AND** on mobile (<768px) screenshots SHALL be displayed in a single column
- **AND** images SHALL scale to fit their container

---

### Requirement: Homepage Quick Start Section

The homepage MUST include a Quick Start section at the bottom that provides navigation links to key documentation for new users.

#### Scenario: Quick Start section displays navigation links

- **GIVEN** a user scrolls to the bottom of the homepage
- **WHEN** the Quick Start section is displayed
- **THEN** the section SHALL include a link to "安装指南"
- **AND** the section SHALL include a link to "创建项目"
- **AND** the section SHALL include a link to "开始编码"
- **AND** all links SHALL use the same button style as the Hero section

#### Scenario: Quick Start links navigate correctly

- **GIVEN** the Quick Start section is displayed
- **WHEN** a user clicks on any link
- **THEN** the link SHALL navigate to the correct documentation page
- **AND** the navigation SHALL use client-side routing (no full page reload)
- **AND** the target page SHALL load successfully

---

### Requirement: Animation Library Integration

The documentation site MUST integrate Framer Motion or a similar animation library to support smooth, performant animations on the homepage.

#### Scenario: Animation library is installed

- **GIVEN** a developer runs `npm install` after adding the dependency
- **WHEN** the installation completes
- **THEN** `framer-motion` SHALL be listed in package.json dependencies
- **AND** TypeScript types SHALL be available for the library
- **AND** no peer dependency warnings SHALL be displayed

#### Scenario: Animation library components work correctly

- **GIVEN** Framer Motion is installed
- **WHEN** a component uses `motion` from framer-motion
- **THEN** the component SHALL render without errors
- **AND** animations SHALL execute smoothly
- **AND** TypeScript SHALL provide autocomplete for animation props

#### Scenario: Animation library does not block initial render

- **GIVEN** the homepage uses Framer Motion
- **WHEN** the page initially loads
- **THEN** the critical content SHALL be visible immediately
- **AND** animations SHALL enhance the content after initial render
- **AND** the First Contentful Paint (FCP) SHALL not be significantly delayed

---

### Requirement: Homepage Responsive Design

The homepage MUST be fully responsive and provide an optimal viewing experience across desktop, tablet, and mobile devices.

#### Scenario: Homepage adapts to desktop screens

- **GIVEN** a user views the homepage on a desktop screen (>1024px)
- **WHEN** the page loads
- **THEN** all sections SHALL use multi-column layouts where appropriate
- **AND** the OpenSpec animation SHALL display horizontally
- **AND** screenshots SHALL display in 2 columns
- **AND** all content SHALL be properly spaced

#### Scenario: Homepage adapts to tablet screens

- **GIVEN** a user views the homepage on a tablet screen (768px-1024px)
- **WHEN** the page loads
- **THEN** feature cards SHALL display in 2 columns
- **AND** the OpenSpec animation SHALL display vertically
- **AND** screenshots SHALL display in 2 columns
- **AND** all text SHALL remain readable without horizontal scrolling

#### Scenario: Homepage adapts to mobile screens

- **GIVEN** a user views the homepage on a mobile screen (<768px)
- **WHEN** the page loads
- **THEN** all sections SHALL use single-column layout
- **AND** feature cards SHALL stack vertically
- **AND** the OpenSpec animation SHALL display vertically with simplified styling
- **AND** screenshots SHALL display in a single column
- **AND** all buttons SHALL be easily tappable (minimum 44px height)

---

### Requirement: Homepage Accessibility

The homepage MUST meet web accessibility standards to ensure users with disabilities can effectively navigate and understand the content.

#### Scenario: All images have alt text

- **GIVEN** the homepage contains images (screenshots, icons)
- **WHEN** a screen reader encounters an image
- **THEN** every image SHALL have a descriptive alt attribute
- **AND** alt text SHALL be in Chinese for Chinese-language content
- **AND** decorative images SHALL have empty alt text (alt="")

#### Scenario: Homepage is keyboard navigable

- **GIVEN** a user navigates the homepage using only a keyboard
- **WHEN** the user presses Tab to move focus
- **THEN** all interactive elements SHALL receive focus in a logical order
- **AND** focus indicators SHALL be clearly visible
- **AND** all buttons and links SHALL be activatable via keyboard

#### Scenario: Homepage has sufficient color contrast

- **GIVEN** the homepage is displayed
- **WHEN** color contrast is evaluated
- **THEN** all text SHALL meet WCAG AA contrast requirements (4.5:1 for normal text)
- **AND** color SHALL NOT be the only means of conveying information
- **AND** the page SHALL be readable in both light and dark themes

#### Scenario: Animation respects user preferences

- **GIVEN** a user has set their operating system to prefer reduced motion
- **WHEN** the homepage loads
- **THEN** the OpenSpec animation SHALL either disable motion or provide a static alternative
- **AND** the page SHALL still convey all information without animation
- **AND** prefers-reduced-motion media query SHALL be honored
