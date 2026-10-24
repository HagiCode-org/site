<div align="center">

# HagiCode

[![license](https://img.shields.io/badge/license-AGPL--3.0-ffd43b)](./LICENSE)
[![last commit](https://img.shields.io/github/last-commit/HagiCode-org/site)](https://github.com/HagiCode-org/site/commits/main)
[![website](https://img.shields.io/website?url=https%3A%2F%2Fhagicode.com&label=website)](https://hagicode.com)

<p><strong>HagiCode — это продукт, который объединяет AI-инструмент для программирования, игровую систему обратной связи и полноценное рабочее пространство разработки в одной платформе.</strong></p>

<p>Используйте его, чтобы разбираться в репозиториях, писать предложения, декомпозировать задачи, изменять код, упорядочивать коммиты, управлять несколькими репозиториями и собирать переиспользуемую базу знаний, не выходя из одного рабочего пространства.</p>

<a href="https://www.hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://www.hagicode.com/desktop/">Desktop</a>
·
<a href="https://apps.microsoft.com/detail/9N3PM0N3SVDW">Microsoft Store</a>
·
<a href="https://docs.hagicode.com/blog/">Blog</a>

</div>

[English](./README.md) · [简体中文](./README_cn.md) · [繁體中文](./README_zh-Hant.md) · [日本語](./README_ja-JP.md) · [한국어](./README_ko-KR.md) · [Deutsch](./README_de-DE.md) · [Français](./README_fr-FR.md) · [Español](./README_es-ES.md) · [Português (Brasil)](./README_pt-BR.md) · [Русский](./README_ru-RU.md)

---

## Microsoft Store And Add-ons

| Превью | Продукт | Что это | С чего начать |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://www.hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## Что такое HagiCode

HagiCode создавался не как ещё одно чат-окно для кода. Он встраивает ИИ во весь процесс разработки ПО: понимание репозиториев, планирование изменений, реализация кода, организация коммитов, накопление знаний и поддержание всего потока от идеи до архива в удобном для ревью виде.

![Обзор рабочего пространства HagiCode с сессиями, заметками к коммитам и основными действиями в одном интерфейсе.](./src/assets/img/readme-sync/workspace-overview.png)

## Ключевые возможности

### 1. AI-кодинг на основе предложений с OpenSpec

Для нетривиальной работы HagiCode начинает с предложения, а не сразу переходит к правке файлов. OpenSpec превращает запросы в область работ, задачи, анализ влияния, шаги проверки и историю выполнения, которую удобно просматривать и проверять.

![Экран сессии предложения в HagiCode с шагами процесса, результатами выполнения и историческим контекстом.](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. Популярные Agent CLI и OmniRoute

HagiCode поддерживает Codex, Claude Code, GitHub Copilot, OpenCode, Hermes, QoderCLI, Kiro, Kimi, Gemini, Pi, Reasonix, DeepAgents и Codebuddy. OmniRoute отделяет выбор CLI от уровня моделей и подписок, чтобы команды могли маршрутизировать модели и endpoints без жёсткой привязки ко всему одному стеку по умолчанию.

![Страница настроек OmniRoute с конфигурацией маршрутизации, управлением endpoints и статусом выполнения.](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. Полноценное рабочее пространство разработки, а не только чат

Рабочее пространство объединяет возможности, которые обычно оказываются разбросаны по разным инструментам:

- `MonoSpecs` для инвентаризации, области работ и координации между несколькими репозиториями
- `Skills` для устанавливаемых расширений рабочих процессов и инструментов с учётом доверия
- `Vault` для накопления переиспользуемых знаний между проектами
- `AI Compose Commit` и интеграция с `code-server`, чтобы завершать работу в том же потоке

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="Обзор MonoSpecs со статусом изменений в нескольких репозиториях." width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery с поиском по устанавливаемым навыкам и фильтрами по источникам." width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="Рабочее пространство Vault с переиспользуемыми источниками знаний и действиями рабочего пространства." width="100%" />
</p>

### 4. Игровая обратная связь, которая остаётся полезной в работе

HagiCode рассматривает достижения, ежедневные отчёты, множители эффективности, пропускную способность токенов и тематическую обратную связь интерфейса как часть продукта, а не как декоративные остатки. В результате получается рабочее пространство, где долгие AI-процессы остаются видимыми, а не сплющиваются в одну бесконечно прокручиваемую переписку.

![Зал достижений с ежедневным прогрессом, метриками этапов и долгосрочными поверхностями обратной связи.](./src/assets/img/readme-sync/gamified-feedback.png)

## Официальные точки входа

- [Website](https://www.hagicode.com/) для полной главной страницы продукта
- [Product Overview](https://docs.hagicode.com/product-overview/) для официального публичного введения в продукт
- [Desktop](https://www.hagicode.com/desktop/) для локальной установки и управления сервисами
- [Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) для обновлений продукта и длинных публикаций

## Лицензия

Этот репозиторий распространяется по лицензии [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE).
