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

## Audience and focus

- Address people evaluating or starting with HagiCode who arrive at the official website repository, and developers who build the site.
- Lead with what HagiCode is and its core capabilities, then official entry points.

## Required content

- Keep the language switcher, RSS feeds, Microsoft Store and add-ons, what HagiCode is, core capabilities, official entry points, repository development, production deployment and license sections, as the current README does.
- The AGPL-3.0 license statement must match `LICENSE`.

## README languages

- Maintain `README.md` in English and one translation per listed locale. Existing files are `README_cn.md`, `README_zh-Hant.md`, `README_ja-JP.md`, `README_ko-KR.md`, `README_de-DE.md`, `README_fr-FR.md`, `README_es-ES.md`, `README_pt-BR.md` and `README_ru-RU.md`; keep those filenames.
- Keep every variant aligned in scope and meaning with the English file.

## Exclusions

- Exclude analytics keys, tokens, secret values, values from `.env.example`, internal hosts, machine-specific paths and private links.
- Do not list features the site does not show.
