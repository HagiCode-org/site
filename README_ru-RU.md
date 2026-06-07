<div align="center">

# HagiCode

<p><strong>HagiCode — это продукт, который объединяет AI-инструмент для программирования, игровую систему обратной связи и полноценное рабочее пространство разработки в одной платформе.</strong></p>

<p>Используйте его, чтобы разбираться в репозиториях, писать предложения, декомпозировать задачи, изменять код, упорядочивать коммиты, управлять несколькими репозиториями и собирать переиспользуемую базу знаний, не выходя из одного рабочего пространства.</p>

<a href="https://hagicode.com/">Website</a>
·
<a href="https://docs.hagicode.com/product-overview/">Product Overview</a>
·
<a href="https://hagicode.com/desktop/">Desktop</a>
·
<a href="https://hagicode.com/container/">Container</a>
·
<a href="https://apps.microsoft.com/detail/9N3PM0N3SVDW">Windows Store</a>
·
<a href="https://docs.hagicode.com/blog/">Blog</a>

</div>

[English](./README.md) · [简体中文](./README_cn.md) · [繁體中文](./README_zh-Hant.md) · [日本語](./README_ja-JP.md) · [한국어](./README_ko-KR.md) · [Deutsch](./README_de-DE.md) · [Français](./README_fr-FR.md) · [Español](./README_es-ES.md) · [Português (Brasil)](./README_pt-BR.md) · [Русский](./README_ru-RU.md)

---

## Windows Store And Add-ons

| Превью | Продукт | Что это | С чего начать |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
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

- [Website](https://hagicode.com/) для полной главной страницы продукта
- [Product Overview](https://docs.hagicode.com/product-overview/) для официального публичного введения в продукт
- [Desktop](https://hagicode.com/desktop/) для локальной установки и управления сервисами
- [Container](https://hagicode.com/container/) для сценария self-hosted развертывания
- [Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) для обновлений продукта и длинных публикаций

## Разработка этого репозитория

Этот репозиторий содержит публичный сайт HagiCode. В каталоге `repos/site` выполните:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Сервер разработки по умолчанию запускается на `http://localhost:31264`.
Для руководства по вкладу начните с [`AGENTS.md`](./AGENTS.md) и [`CLAUDE.md`](./CLAUDE.md).

## Продакшн-деплой

- Основной workflow: `.github/workflows/site-deploy-gh-pages.yml`
- Источник истины для production: ветка `gh-pages`, публикуемая только через GitHub Actions
- Контракт публикуемого payload: `esa.jsonc` в корне ветки и проверенный статический снимок Astro в `dist/`
- Путь в R2 после `gh-pages`: после успешного завершения job `deploy` job `upload-r2` скачивает тот же проверенный artifact `site-gh-pages-payload` и синхронизирует только содержимое `.deploy/gh-pages/dist/` в корень bucket R2 или в корень опционального prefix, не добавляя лишний сегмент `dist/`
- Путь для ручного запуска: `workflow_dispatch` по умолчанию использует `latest-gh-pages`, поэтому сопровождающие могут повторно опубликовать данные прямо из последнего snapshot ветки `gh-pages` без новой сборки; `current-ref-build` выбирайте только тогда, когда действительно нужен ручной rebuild и повторная публикация из текущего ref
- Обязательные R2 secrets: `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID` и `R2_SECRET_ACCESS_KEY`; `R2_PREFIX` необязателен и удаляет ведущие и замыкающие `/` перед вычислением целевого корня
- Диагностика сбоев: если `gh-pages` завершился успешно, а загрузка в R2 нет, workflow упадёт в `upload-r2`; смотрите GitHub step summary, чтобы увидеть вычисленный bucket, корень prefix и понять, случилась ли ошибка до передачи или во время синхронизации
- Необходимые права GitHub: deploy job требует `contents: write`; build job остаётся только для чтения
- Необходимая настройка хостинга: production-хост должен читать `gh-pages/esa.jsonc` и обслуживать `gh-pages/dist/` как каталог статических файлов
- Проверки первого деплоя: убедитесь, что workflow публикует `esa.jsonc` и `dist/`, что целевой хостинг по-прежнему смотрит на `gh-pages`, что summary показывает ожидаемый bucket R2 или корень prefix, и затем откройте `https://hagicode.com`
- Путь отката: откатить изменение в исходниках или повторно запустить деплой из более старого коммита, чтобы CI снова опубликовал предыдущий снимок

### Резервный Desktop Index

Индекс истории desktop по адресу `https://index.hagicode.com/desktop/history/` здесь выступает только как внешняя зависимость по ссылке. Сайт указывает на него как на резервную runtime-цель для desktop-инструкций, но сам этот репозиторий не публикует и не поддерживает этот индекс напрямую.

## Лицензия

Этот репозиторий распространяется по [LICENSE](./LICENSE).
