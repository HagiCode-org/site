# Design Documentation

**Proposal:** 添加语言切换按钮
**Change ID:** `language-switcher-button`

---

## Overview

本文档详细说明语言切换功能的技术设计和实现细节。

---

## Architecture

### Docusaurus i18n 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser URL                               │
│  https://pcode.docs/zh-CN/docs/installation                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Docusaurus Router                          │
│  - Detects locale from URL path                             │
│  - Routes to appropriate content                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Content Resolution                         │
│  - Checks i18n/zh-CN/ for translated content                │
│  - Falls back to default (en) if translation missing        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Theme Rendering                            │
│  - Applies translated UI strings from JSON files            │
│  - Renders locale-aware components                          │
└─────────────────────────────────────────────────────────────┘
```

### LocaleDropdown 组件流程

```
┌──────────────┐     click      ┌─────────────────────────────┐
│ LocaleDropdown│ ─────────────► │   Toggle Dropdown Menu      │
│   Button      │                │   - List available locales  │
│  (current)    │                │   - Highlight current       │
└──────────────┘                └─────────────────────────────┘
                                          │
                                          │ click locale option
                                          ▼
                                ┌─────────────────────────────┐
                                │   Navigate to New URL        │
                                │   - Replace locale prefix   │
                                │   - Preserve path suffix    │
                                └─────────────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────────────┐
                                │   Page Reload                │
                                │   - New locale content       │
                                │   - Update UI language       │
                                └─────────────────────────────┘
```

---

## Component Structure

### Navbar Items Configuration

**File:** `docusaurus.config.ts`

```typescript
themeConfig: {
  navbar: {
    items: [
      // Left side
      { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
      { to: '/blog', label: 'Blog', position: 'left' },

      // Right side (order matters for display)
      { type: 'localeDropdown', position: 'right' },
      { type: 'search', position: 'right' },
      { type: 'colorModeToggle', position: 'right' },
      { href: 'https://github.com/pcode/pcode-docs', label: 'GitHub', position: 'right' },
    ],
  },
}
```

**Display Order (left to right):**
```
[Docs] [Blog] ............. [语言 ▼] [🔍] [🌙/☀️] [GitHub]
```

---

## URL Structure

### Current Structure

| Content Type | English URL | Chinese URL |
|--------------|-------------|-------------|
| Home | `/` | `/zh-CN/` |
| Docs | `/docs/...` | `/zh-CN/docs/...` |
| Blog | `/blog` | `/zh-CN/blog` |
| Blog Post | `/blog/{slug}` | `/zh-CN/blog/{slug}` |

### Language Switch Behavior

When switching from English to Chinese:

1. **User is on:** `https://pcode.docs/docs/installation`
2. **After switch:** `https://pcode.docs/zh-CN/docs/installation`

When switching from Chinese to English:

1. **User is on:** `https://pcode.docs/zh-CN/blog/welcome`
2. **After switch:** `https://pcode.docs/blog/welcome`

---

## Translation File Organization

```
i18n/
├── zh-CN/
│   ├── docusaurus-theme-classic/      # UI translations
│   │   ├── navbar.json                # Navigation labels
│   │   ├── footer.json                # Footer content
│   │   └── code.json                  # Theme UI strings
│   ├── docusaurus-plugin-content-docs/ # Documentation content
│   │   └── current/
│   │       ├── current.json           # Common doc strings
│   │       └── *.md                   # Translated markdown files
│   └── docusaurus-plugin-content-blog/ # Blog content
│       └── ...
└── ...
```

### Key Translation Keys

**navbar.json:**
```json
{
  "theme.navbar.languageDropdown.label": {
    "message": "语言",
    "description": "The label for the language dropdown"
  }
}
```

---

## State Management

### Locale Detection Priority

Docusaurus detects locale in the following order:

1. **URL path prefix** - `/zh-CN/` indicates Chinese locale
2. **Cookie** - Stored locale preference
3. **Browser header** - `Accept-Language` header
4. **Default locale** - Falls back to `en`

### Locale Persistence

When user selects a locale:
1. Docusaurus stores preference in cookie (`docusaurus_locale`)
2. Future visits respect the stored preference
3. URL path always reflects current locale

---

## Styling Considerations

### Theme Integration

The `localeDropdown` uses Docusaurus's internal styling:

```css
/* Infima variables (already customized in src/css/custom.css) */
:root {
  --ifm-dropdown-background-color: var(--ifm-background-color);
  --ifm-dropdown-hover-background-color: var(--ifm-color-emphasis-100);
}
```

### Custom Styling (Optional)

If custom styling is needed, can be added to `src/css/custom.css`:

```css
/* Custom dropdown styles */
.dropdown__menu {
  min-width: 120px;
}

.dropdown__link {
  padding: var(--ifm-menu-item-padding-vertical)
           var(--ifm-menu-item-padding-horizontal);
}
```

---

## Error Handling

### Missing Translation Scenarios

| Scenario | Behavior |
|----------|----------|
| Page not translated | Shows default language (en) with locale prefix |
| Partial translation | Shows translated content where available, falls back elsewhere |
| Missing UI string | Shows default English string |

### Graceful Degradation

```typescript
// Pseudo-code of Docusaurus logic
function getContent(path, locale) {
  const translatedPath = `i18n/${locale}/${path}`;
  if (exists(translatedPath)) {
    return read(translatedPath);
  }
  return read(`docs/${path}`); // Fall back to default
}
```

---

## Accessibility

### ARIA Attributes

The LocaleDropdown component includes:

```html
<div class="navbar__item dropdown">
  <button aria-expanded="false" aria-haspopup="menu" aria-label="Languages">
    English
  </button>
  <ul class="dropdown__menu" role="menu">
    <li role="none">
      <a class="dropdown__link" href="/" role="menuitem" lang="en">
        English
      </a>
    </li>
    <li role="none">
      <a class="dropdown__link" href="/zh-CN/" role="menuitem" lang="zh-CN">
        简体中文
      </a>
    </li>
  </ul>
</div>
```

### Keyboard Navigation

- `Tab` - Focus dropdown button
- `Enter/Space` - Open dropdown menu
- `Arrow keys` - Navigate menu options
- `Escape` - Close dropdown

---

## Performance Considerations

### Bundle Size Impact

The localeDropdown component:
- **Code size:** ~2KB gzipped (included in main bundle)
- **Additional data:** Translation JSON files loaded per locale
- **Runtime cost:** Minimal (simple DOM manipulation)

### Lazy Loading

Docusaurus lazy-loads locale-specific content:
- Only current locale's content is in initial bundle
- Translation files loaded on-demand when switching

---

## Testing Strategy

### Unit Tests (Not Applicable)

Docusaurus handles this internally; no custom code to test.

### Integration Tests

```typescript
// Example test scenarios (manual verification)
describe('Language Switcher', () => {
  test('switches from English to Chinese', () => {
    cy.visit('/docs/installation');
    cy.get('.navbar__item.dropdown').click();
    cy.contains('简体中文').click();
    cy.url().should('include', '/zh-CN/docs/installation');
  });

  test('preserves page path when switching', () => {
    cy.visit('/blog/welcome-post');
    // ... switch language
    cy.url().should('include', '/blog/welcome-post');
  });
});
```

### Manual Testing Checklist

- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: iOS Safari, Android Chrome
- [ ] Tablet: iPad, Android tablets
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

---

## Future Enhancements

### Potential Improvements

1. **Auto-detect browser language** - Offer to switch on first visit
2. **Language preference storage** - Remember user's choice across sessions (already done via cookies)
3. **Translation progress indicator** - Show % translated for current page
4. **Contribution link** - "Help translate" button for missing content

### Additional Languages

To add more languages in the future:

1. Update `docusaurus.config.ts`:
   ```typescript
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'zh-CN', 'ja', 'ko'],
   }
   ```

2. Create translation directory:
   ```
   mkdir -p i18n/ja/docusaurus-theme-classic
   ```

3. Run translation command:
   ```bash
   npm run write-translations -- --locale ja
   ```
