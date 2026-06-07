<div align="center">

# HagiCode

<p><strong>HagiCode é um produto que reúne uma ferramenta de programação com IA, um sistema de feedback gamificado e um workspace completo de desenvolvimento em uma única plataforma.</strong></p>

<p>Use-o para entender repositórios, escrever propostas, quebrar tarefas, modificar código, organizar commits, gerenciar vários repositórios e construir uma base de conhecimento reutilizável sem sair do mesmo workspace.</p>

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

| Prévia | Produto | O que é | Comece aqui |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## O que é HagiCode

HagiCode não foi criado para ser apenas mais uma caixa de chat para código. Ele leva a IA para todo o processo de desenvolvimento de software: entender repositórios, planejar mudanças, implementar código, organizar commits, registrar conhecimento e manter revisável todo o fluxo, da ideia ao arquivamento.

![Visão geral do workspace do HagiCode mostrando sessões, notas de commit e ações principais em uma única interface integrada.](./src/assets/img/readme-sync/workspace-overview.png)

## Capacidades principais

### 1. Programação com IA guiada por propostas com OpenSpec

Para trabalhos não triviais, o HagiCode começa com uma proposta em vez de ir direto para a edição de arquivos. O OpenSpec transforma solicitações em escopo, tarefas, análise de impacto, etapas de validação e uma trilha de execução que continua fácil de revisar.

![Visão de sessão de proposta do HagiCode mostrando etapas do fluxo, resultados de execução e contexto histórico.](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. CLIs de agentes populares com OmniRoute

HagiCode oferece suporte a Codex, Claude Code, GitHub Copilot, OpenCode, Hermes, QoderCLI, Kiro, Kimi, Gemini, Pi, Reasonix, DeepAgents e Codebuddy. O OmniRoute separa a escolha do CLI da camada de modelos e assinaturas, para que equipes possam rotear modelos e endpoints sem prender tudo a uma única pilha padrão.

![Página de configuração do OmniRoute mostrando roteamento, controles de endpoint e estado de execução.](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. Um workspace completo de desenvolvimento, não apenas um painel de chat

O workspace reúne capacidades que normalmente ficam espalhadas entre ferramentas separadas:

- `MonoSpecs` para inventário, escopo e coordenação entre múltiplos repositórios
- `Skills` para extensões instaláveis de workflow e ferramentas sensíveis à confiança
- `Vault` para capturar conhecimento reutilizável entre projetos
- `AI Compose Commit` e a integração com `code-server` para concluir o trabalho dentro do mesmo fluxo

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="Visão geral do MonoSpecs mostrando o status de mudanças em vários repositórios." width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery mostrando habilidades instaláveis pesquisáveis e filtros por origem." width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="Workspace do Vault mostrando fontes de conhecimento reutilizáveis e ações do workspace." width="100%" />
</p>

### 4. Feedback gamificado que continua útil na operação

HagiCode trata conquistas, relatórios diários, multiplicadores de eficiência, vazão de tokens e feedback visual temático como parte do produto, não como enfeites. O resultado é um workspace que mantém o trabalho prolongado com IA visível, em vez de achatar tudo em um único chat infinito.

![Hall de conquistas mostrando progresso diário, métricas de marcos e superfícies de feedback de longo prazo.](./src/assets/img/readme-sync/gamified-feedback.png)

## Pontos de entrada oficiais

- [Website](https://hagicode.com/) para a página principal completa do produto
- [Product Overview](https://docs.hagicode.com/product-overview/) para a introdução pública oficial do produto
- [Desktop](https://hagicode.com/desktop/) para instalação local e gerenciamento de serviços
- [Container](https://hagicode.com/container/) para o caminho de implantação self-hosted
- [Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) para atualizações do produto e textos longos

## Desenvolvendo este repositório

Este repositório contém o site público da HagiCode. Em `repos/site`, execute:

```bash
npm install
npm run dev
npm run build
npm run preview
```

O servidor de desenvolvimento padrão roda em `http://localhost:31264`.
Para orientações de contribuição, comece por [`AGENTS.md`](./AGENTS.md) e [`CLAUDE.md`](./CLAUDE.md).

## Deploy em produção

- Workflow autoritativo: `.github/workflows/site-deploy-gh-pages.yml`
- Fonte de verdade em produção: a branch `gh-pages`, publicada apenas pelo GitHub Actions
- Contrato do payload publicado: `esa.jsonc` na raiz da branch e o snapshot estático validado do Astro em `dist/`
- Caminho R2 após `gh-pages`: depois que o job `deploy` for concluído com sucesso, `upload-r2` baixa o mesmo artifact validado `site-gh-pages-payload` e sincroniza apenas o conteúdo de `.deploy/gh-pages/dist/` para a raiz do bucket R2 ou para uma raiz de prefixo opcional, sem criar um segmento extra `dist/`
- Caminho manual: `workflow_dispatch` usa `latest-gh-pages` por padrão, então os mantenedores podem republicar diretamente a partir do snapshot mais recente da branch `gh-pages` sem reconstruir; escolha `current-ref-build` apenas quando precisar reconstruir manualmente e republicar a partir da ref atual
- Secrets R2 obrigatórios: `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY`; `R2_PREFIX` é opcional e remove `/` do começo e do fim antes de resolver a raiz de destino
- Triagem de falhas: se `gh-pages` tiver sucesso mas o upload para R2 falhar, o workflow falha em `upload-r2`; consulte o GitHub step summary para ver o bucket resolvido, a raiz do prefixo e se a falha aconteceu antes da transferência ou durante a sincronização
- Permissões GitHub necessárias: o deploy job precisa de `contents: write`; o build job continua somente leitura
- Configuração de hospedagem necessária: o host de produção deve ler `gh-pages/esa.jsonc` e servir `gh-pages/dist/` como diretório estático
- Verificações do primeiro deploy: confirme que o workflow publicou `esa.jsonc` e `dist/`, verifique se o destino de hospedagem continua apontando para `gh-pages`, confirme que o summary mostra o bucket R2 ou a raiz de prefixo esperada e então abra `https://hagicode.com`
- Caminho de rollback: reverta a mudança de origem ou reexecute o deploy a partir de um commit antigo para que a CI publique novamente o snapshot anterior

### Fallback do Desktop Index

O índice histórico do desktop em `https://index.hagicode.com/desktop/history/` é apenas uma dependência referenciada aqui. O site aponta para ele como destino de fallback em tempo de execução para a orientação do desktop, mas este repositório não publica nem mantém esse índice diretamente.

## Licença

Este repositório é distribuído sob [LICENSE](./LICENSE).
