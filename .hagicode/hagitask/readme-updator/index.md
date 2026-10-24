---
public: true
multilingual: true
languages:
  - en-US
  - zh-CN
  - zh-Hant
  - ja-JP
  - ko-KR
  - de-DE
  - fr-FR
  - es-ES
  - pt-BR
  - ru-RU
sourceLanguage: en-US
style: product
---

# README requirements

## Product focus

- Introduce HagiCode as the product shown on the official website: an AI coding tool, a gamified feedback system and a development workspace in one platform, with proposal-driven coding through OpenSpec, support for mainstream Agent CLIs routed through OmniRoute, multi-repository workspace tools (MonoSpecs, Skills, Vault, AI Compose Commit) and gamified feedback.
- Address people evaluating or starting with HagiCode who arrive at the official website repository.
- Lead with what HagiCode is and its core capabilities, then official entry points and downloads.

## Microsoft Store

- The README's goal for the Microsoft Store is to bring readers to the official site and the Store listing so they install HagiCode, subscribe there and keep using it. State this plainly in the product copy instead of treating the Store as a side note.
- Present the Microsoft Store as the recommended Windows entry point: installing and subscribing there keeps the app on the latest version.
- Describe the Store edition's value as the site's "Editions & Pricing" comparison shows it: the higher concurrent proposal limit and the Store-only capabilities that TurboEngine, a one-time perpetual license sold in the Microsoft Store, unlocks.
- Give the Store a clear call to action near the top of the README and in the Microsoft Store section, linking the Store listing together with the Desktop downloads page on the official website.
- Write in product language about what the reader gains. Use only Store, edition and pricing facts the site shows, and do not promise anything the site does not state.

## Required content

- Keep the language switcher, Microsoft Store and add-ons, what HagiCode is, core capabilities and official entry points as the current README does.
- The AGPL-3.0 license statement must match `LICENSE`.

## README languages

- Maintain `README.md` in English and one translation per listed locale. Existing files are `README_cn.md`, `README_zh-Hant.md`, `README_ja-JP.md`, `README_ko-KR.md`, `README_de-DE.md`, `README_fr-FR.md`, `README_es-ES.md`, `README_pt-BR.md` and `README_ru-RU.md`; keep those filenames.
- Keep every variant aligned in scope and meaning with the English file.

## Exclusions

- Exclude analytics keys, tokens, secret values, values from `.env.example`, internal hosts, machine-specific paths and private links.
- Keep repository maintenance instructions out of the README: repository layout, internal architecture, CI, build and deployment internals, SEO and RSS plumbing and contribution workflow.
- Do not list features the site does not show.
