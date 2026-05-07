---
name: HagiCode Site
description: Official public brand and entry surface for the HagiCode ecosystem.
colors:
  primary-blue: "#0080FF"
  primary-cyan: "#00CCCC"
  primary-green: "#22C55E"
  accent-violet: "#6C5CE7"
  background-light: "#F5F5F7"
  surface-light: "#FFFFFF"
  surface-glass-light: "#FFFFFFD9"
  text-strong-light: "#0F172A"
  text-muted-light: "#475569"
  border-light: "#0000001A"
  background-dark: "#030712"
  surface-dark: "#0A0F1E"
  surface-glass-dark: "#0F172AD9"
  text-strong-dark: "#F8FAFC"
  text-muted-dark: "#E2E8F0"
  border-dark: "#FFFFFF1F"
typography:
  display:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 15vw, 7rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  xxl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary-blue}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "16px 32px"
  button-pill:
    backgroundColor: "{colors.surface-glass-dark}"
    textColor: "{colors.text-strong-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 15px"
  feature-surface:
    backgroundColor: "{colors.surface-glass-dark}"
    textColor: "{colors.text-strong-dark}"
    rounded: "{rounded.xl}"
    padding: "48px"
  theme-toggle:
    backgroundColor: "{colors.surface-glass-dark}"
    textColor: "{colors.text-strong-dark}"
    rounded: "{rounded.pill}"
    padding: "0px"
  install-split-primary:
    backgroundColor: "{colors.primary-blue}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0px 28px"
---

# Design System: HagiCode Site

## 1. Overview

**Creative North Star: "The Operations Briefing Deck"**

The HagiCode site should feel like an operator's first briefing screen, not a showroom assembled from generic AI-marketing parts. It is allowed to be energetic, layered, and visibly technical, but the impression must be controlled. Visitors should feel that there is a real system behind the product, and that the interface is revealing it with intent.

The current site already uses neon blue, cyan, and green signals, translucent panels, fixed chrome, and occasional seasonal theme swaps. Keep that identity, but discipline it. Glass, glow, and gradients are accent tools, not defaults. The page should read as a lucid technical brand before it reads as sci-fi styling.

This system explicitly rejects a generic AI SaaS landing page built from soft cream blocks, stock 3D blobs, and interchangeable productivity copy. It also rejects decorative glassmorphism, neon-for-neon's-sake cyberpunk, mascot-driven toy AI branding, anonymous enterprise minimalism, the hero-metric template, and the flattening move of reducing the story to "chat with your code."

**Key Characteristics:**
- Technical signal over startup polish.
- Strong hierarchy, especially in hero and navigation.
- Multilingual readability before fashion-driven typography.
- Accent energy concentrated in actions, highlights, and controlled focal moments.
- Seasonal variants are permitted, but semantic structure must stay stable.

## 2. Colors

The palette is a directed technical spectrum: electric blue moves into cyan and then into green, while the surrounding neutrals stay cool, dark, and slightly industrial.

### Primary
- **Signal Blue** (`#0080FF`): The lead accent for primary CTA surfaces, link emphasis, focused states, and brand-critical interaction moments.

### Secondary
- **Routing Cyan** (`#00CCCC`): The supporting technical accent used in gradient transitions, navigation glows, and selected technical highlights. It should intensify the system feeling, not replace the primary accent.

### Tertiary
- **Execution Green** (`#22C55E`): The completion and throughput color. Use it for success cues, directional gradients, and positive system momentum.
- **Reserve Violet** (`#6C5CE7`): A limited support accent for distinction inside dense technical compositions. It is never the main voice of the page.

### Neutral
- **Mist Background** (`#F5F5F7`): The default light canvas for content sections and calmer explanatory surfaces.
- **Void Background** (`#030712`): The dramatic dark canvas for the brand-facing posture, hero framing, and high-contrast sections.
- **Panel White** (`#FFFFFF`): Opaque light surface for content that needs maximum readability.
- **Dark Console** (`#0A0F1E`): Dense dark surface for navigation, chrome, and technical framing.
- **Frosted Light Panel** (`#FFFFFFD9`): Translucent light panel used only when the layer relationship matters.
- **Frosted Dark Panel** (`#0F172AD9`): Translucent dark panel for fixed nav, toggles, and featured technical surfaces.
- **Slate Ink** (`#0F172A` / `#475569`): Light-theme primary and secondary text.
- **Cloud Ink** (`#F8FAFC` / `#E2E8F0`): Dark-theme primary and secondary text.
- **Wireline Border** (`#0000001A` / `#FFFFFF1F`): Quiet structural edges and panel framing.

**The Signal Gradient Rule.** Blue, cyan, and green may travel together in directional gradients for action surfaces, hero accents, and selected highlights. The gradient belongs to controlled focal points only. It does not become the page background, the text system, or the default fill for every component.

**The Seasonal Override Rule.** Alternative themes, such as Lunar New Year, may swap the hue family. They must preserve contrast, hierarchy, and interaction semantics. A seasonal theme is a color remap, not a new interface language.

## 3. Typography

**Display Font:** System-native CJK-aware sans stack (`PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif`)
**Body Font:** System-native CJK-aware sans stack (`PingFang SC, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Noto Sans CJK SC, Noto Sans SC, Source Han Sans SC, WenQuanYi Micro Hei, Segoe UI, system-ui, sans-serif`)
**Label/Mono Font:** System and developer mono stack for code and tabular content (`SF Mono, Menlo, Cascadia Code, Consolas, Roboto Mono, JetBrains Mono, monospace`)

**Character:** Fast, operational, and multilingual before fashionable. The site should feel native on the visitor's platform, and reliable across Latin and CJK copy, rather than announcing a trendy brand type pairing.

### Hierarchy
- **Display** (`800`, `clamp(3.5rem, 15vw, 7rem)`, `1`): Hero headlines and other singular launch moments only. Keep lines short and decisive.
- **Headline** (`800`, `clamp(2.25rem, 6vw, 3.5rem)`, `1.1`): Section headers and strong narrative checkpoints.
- **Title** (`700`, `1.25rem`, `1.2`): Navigation labels, card titles, and compact section identifiers.
- **Body** (`400`, `1rem`, `1.6`): Explanatory copy, list items, and supporting marketing narrative. Keep long-form text within roughly `65ch` to `75ch`.
- **Label** (`600`, `0.9375rem`, `0.01em` letter-spacing): Buttons, pills, segmented controls, and compact metadata.

**The Mixed-Script First Rule.** Typography optimizes for multilingual clarity before novelty. Use strong weight contrast and disciplined line lengths. Do not introduce display fonts that degrade readability when English, simplified Chinese, traditional Chinese, Japanese, and Korean content sit side by side.

## 4. Elevation

Depth is a hybrid of tonal layering, restrained ambient shadow, and selective frosted translucency. The site is not flat, but it should never feel smeared with blur. Navigation, floating controls, hero badges, and featured technical panels may use frosted surfaces. Standard content sections should rely on contrast, spacing, and clean edges first.

### Shadow Vocabulary
- **Low Lift** (`0 1px 2px rgba(0, 0, 0, 0.05)` light, `0 1px 2px rgba(0, 0, 0, 0.6)` dark): Fine separation for compact controls.
- **Operational Lift** (`0 4px 6px rgba(0, 0, 0, 0.07)` light, `0 4px 6px rgba(0, 0, 0, 0.7)` dark): Sticky nav, menus, and frequently-used utility surfaces.
- **Feature Lift** (`0 10px 40px rgba(0, 0, 0, 0.1)` light, `0 10px 40px rgba(0, 0, 0, 0.8)` dark): Hero panels, featured containers, and marquee surfaces.
- **Signal Glow** (`0 0 20px rgba(0, 128, 255, 0.3)` light, `0 0 25px rgba(0, 212, 255, 0.4)` dark): Technical emphasis on hover, active framing, and focal accents only.

**The Frosted With Restraint Rule.** Frosted panels are a framing device, not the house style. If a surface does not need to visually float over something else, it should not be blurred.

## 5. Components

Each component should read like a control surface in a coherent system: decisive edges, obvious hover states, and enough visual energy to feel branded without turning every element into a special effect.

### Buttons
- **Shape:** Gently squared action surfaces (`12px`) for hero CTAs and segmented installs, rounded pill forms (`9999px`) for support and secondary navigation actions.
- **Primary:** Uses the signal gradient across blue, cyan, and green with white text, strong weight (`600`), and generous padding (`16px 32px` in hero scale).
- **Hover / Focus:** A small lift (`translateY(-1px)`), brighter border or glow, and explicit `focus-visible` outline (`2px`).
- **Secondary / Ghost / Tertiary:** Secondary nav actions stay translucent or dark-surfaced, not pale and washed out. They should feel precise, not soft.

### Cards / Containers
- **Corner Style:** Larger featured surfaces use `16px` radius; utility surfaces land closer to `8px` or `12px`.
- **Background:** Use opaque surfaces for reading-heavy sections and frosted panels for navigation, floating logos, or featured technical zones.
- **Shadow Strategy:** Ambient shadows establish lift, then glow appears only when the brand needs a signal moment.
- **Border:** Quiet wireline borders define edges. Borders should not become decorative side stripes.
- **Internal Padding:** Feature zones live around `48px`, while compact controls and nav pills stay within `8px` to `24px`.

### Navigation
- **Style:** Fixed and translucent, with a dark-leaning frosted shell, a quiet bottom border, and a controlled HUD-like line. Navigation should feel like persistent instrumentation.
- **Typography:** Title and label weights (`500` to `700`) with concise copy and no ornamental casing.
- **Default / Hover / Active States:** Default links stay muted. Hover shifts them toward the signal colors. The most important nav actions may use pill framing and a subtle lift.
- **Mobile Treatment:** Mobile navigation keeps the same semantic hierarchy and contrast. It may collapse the layout, but it should not lose the technical clarity of the desktop shell.

### Theme Toggle
- **Style:** Circular frosted control (`40px`) with a single icon, strong border definition, and direct hover response.
- **State:** Hover may rotate the icon slightly and intensify the glow, but reduced-motion users must get a stable version with no rotational flourish.

### Signature Component
- **Segmented Install Button:** This is the clearest expression of the site's conversion model. The primary action, alternate sources, Steam path, and dropdown affordance share a single segmented rail. It should always feel cohesive, high-priority, and immediately scannable.

## 6. Do's and Don'ts

### Do:
- **Do** show systems, not slogans. Use screenshots, workflow boards, segmented actions, and structural cues that make the product legible.
- **Do** keep one clear next step per surface. Hero, nav, and section CTAs should each resolve to an obvious action.
- **Do** preserve multilingual readability with the current CJK-first system stacks, strong weights, and disciplined line lengths.
- **Do** use glass, blur, and glow only where layering or focus truly benefit from them.
- **Do** preserve WCAG AA contrast, `focus-visible` states, and `prefers-reduced-motion` support across every theme.

### Don't:
- **Don't** make HagiCode look like a generic AI SaaS landing page built from soft cream blocks, stock 3D blobs, and interchangeable productivity copy.
- **Don't** lean on decorative glassmorphism, neon-for-neon's-sake cyberpunk, mascot-driven toy AI branding, or anonymous enterprise minimalism.
- **Don't** use the hero-metric template or reduce the product story to "chat with your code."
- **Don't** spread animated gradient text, glow, or blur across every heading and card. Keep that energy concentrated in true focal points.
- **Don't** use colored side-stripe borders, repeated identical card grids, or any other visual shortcut that makes the site feel templated.
