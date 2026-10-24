<div align="center">

# HagiCode

[![license](https://img.shields.io/badge/license-AGPL--3.0-ffd43b)](./LICENSE)
[![last commit](https://img.shields.io/github/last-commit/HagiCode-org/site)](https://github.com/HagiCode-org/site/commits/main)
[![website](https://img.shields.io/website?url=https%3A%2F%2Fhagicode.com&label=website)](https://hagicode.com)

<p><strong>HagiCode est un produit qui réunit un outil de codage par IA, un système de retour gamifié et un espace de travail de développement complet dans une seule plateforme.</strong></p>

<p>Il permet de comprendre des dépôts, rédiger des propositions, découper des tâches, modifier du code, organiser des commits, gérer plusieurs dépôts et constituer une base de connaissances réutilisable sans quitter le même espace de travail.</p>

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

| Aperçu | Produit | Description | Point de départ |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://www.hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## Ce qu'est HagiCode

HagiCode n'a pas été conçu pour être une simple boîte de dialogue dédiée au code. Il fait entrer l'IA dans l'ensemble du processus de développement logiciel : comprendre des dépôts, planifier des changements, implémenter du code, organiser des commits, capitaliser la connaissance et garder l'ensemble du flux, de l'idée à l'archive, facilement révisable.

![Vue d'ensemble de l'espace de travail HagiCode montrant les sessions, les notes de commit et les actions principales dans une interface intégrée.](./src/assets/img/readme-sync/workspace-overview.png)

## Capacités principales

### 1. Codage IA piloté par proposition avec OpenSpec

Pour les travaux non triviaux, HagiCode commence par une proposition au lieu de passer directement à l'édition de fichiers. OpenSpec transforme les demandes en périmètre, tâches, analyse d'impact, étapes de validation et trace d'exécution qui reste simple à relire.

![Vue de session de proposition HagiCode montrant les étapes du flux, les résultats d'exécution et le contexte historique.](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. CLI d'agents grand public avec OmniRoute

HagiCode prend en charge Codex, Claude Code, GitHub Copilot, OpenCode, Hermes, QoderCLI, Kiro, Kimi, Gemini, Pi, Reasonix, DeepAgents et Codebuddy. OmniRoute sépare le choix du CLI de la couche modèle et abonnement, afin que les équipes puissent router les modèles et les endpoints sans tout lier rigidement à une pile par défaut unique.

![Page de paramètres OmniRoute montrant la configuration du routage, les contrôles d'endpoint et l'état d'exécution.](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. Un espace de développement complet, pas seulement un panneau de chat

L'espace de travail réunit des capacités qui finissent souvent dispersées dans des outils séparés :

- `MonoSpecs` pour l'inventaire multi-dépôts, le périmètre et la coordination
- `Skills` pour les extensions de workflow installables et les outils tenant compte de la confiance
- `Vault` pour la capitalisation de connaissances réutilisables entre projets
- `AI Compose Commit` et l'intégration `code-server` pour terminer le travail dans le même flux

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="Vue d'ensemble MonoSpecs montrant l'état des changements sur plusieurs dépôts." width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery montrant des compétences installables, consultables et filtrables par source." width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="Espace Vault montrant des sources de connaissance réutilisables et les actions du workspace." width="100%" />
</p>

### 4. Un retour gamifié qui reste utile en pratique

HagiCode traite les succès, les rapports quotidiens, les multiplicateurs d'efficacité, le débit de tokens et les retours d'interface thématiques comme des éléments du produit, et non comme de simples décorations. Le résultat est un espace de travail qui garde visibles les travaux IA de longue durée au lieu de tout aplatir dans un seul fil de discussion sans fin.

![Hall des succès montrant la progression quotidienne, les métriques d'étape et les surfaces de retour à long terme.](./src/assets/img/readme-sync/gamified-feedback.png)

## Points d'entrée officiels

- [Website](https://www.hagicode.com/) pour la page d'accueil complète du produit
- [Product Overview](https://docs.hagicode.com/product-overview/) pour l'introduction publique officielle au produit
- [Desktop](https://www.hagicode.com/desktop/) pour l'installation locale et la gestion des services
- [Microsoft Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) pour les mises à jour produit et les articles longs

## Licence

Ce dépôt est publié sous la [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE).
