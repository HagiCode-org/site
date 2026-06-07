<div align="center">

# HagiCode

<p><strong>HagiCode는 AI 코딩 도구, 게임화된 피드백 시스템, 그리고 완전한 개발 워크스페이스를 하나의 플랫폼으로 묶은 제품입니다.</strong></p>

<p>리포지토리 이해, 제안서 작성, 작업 분해, 코드 수정, 커밋 정리, 여러 리포지토리 관리, 그리고 재사용 가능한 지식 축적까지 같은 워크스페이스 안에서 처리할 수 있습니다.</p>

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

| 미리보기 | 제품 | 설명 | 시작 지점 |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## HagiCode란 무엇인가

HagiCode는 또 하나의 코드 채팅 상자로 만들어진 제품이 아닙니다. AI를 전체 소프트웨어 개발 과정에 끌어와 리포지토리 이해, 변경 계획, 코드 구현, 커밋 정리, 지식 추적, 그리고 아이디어에서 보관까지의 흐름 전체를 검토 가능하게 유지합니다.

![세션, 커밋 메모, 주요 작업이 하나의 통합 워크스페이스에 표시된 HagiCode 개요 화면.](./src/assets/img/readme-sync/workspace-overview.png)

## 핵심 기능

### 1. OpenSpec 기반 제안 중심 AI 코딩

단순하지 않은 작업에서는 HagiCode가 바로 파일 편집으로 뛰어들지 않고 먼저 제안서부터 시작합니다. OpenSpec은 요청을 범위, 작업, 영향 분석, 검증 단계, 그리고 계속 검토하기 쉬운 실행 기록으로 정리합니다.

![워크플로 단계, 실행 결과, 기록 컨텍스트를 보여주는 HagiCode 제안 세션 화면.](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. 주요 Agent CLI와 OmniRoute

HagiCode는 Codex, Claude Code, GitHub Copilot, OpenCode, Hermes, QoderCLI, Kiro, Kimi, Gemini, Pi, Reasonix, DeepAgents, Codebuddy를 지원합니다. OmniRoute는 CLI 선택을 모델 및 구독 계층과 분리하여, 팀이 단일 기본 스택에 강하게 묶이지 않고 모델과 엔드포인트를 라우팅할 수 있게 합니다.

![라우팅 구성, 엔드포인트 제어, 런타임 상태를 보여주는 OmniRoute 설정 페이지.](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. 채팅 창이 아니라 완전한 개발 워크스페이스

이 워크스페이스는 보통 여러 도구에 흩어지는 기능을 하나의 흐름으로 묶습니다.

- `MonoSpecs`는 다중 리포지토리 인벤토리, 범위, 조정을 담당합니다
- `Skills`는 설치 가능한 워크플로 확장과 신뢰 인지형 도구를 담당합니다
- `Vault`는 프로젝트 전반에서 재사용 가능한 지식 축적을 담당합니다
- `AI Compose Commit`과 `code-server` 통합은 마무리 작업까지 같은 흐름 안에서 끝낼 수 있게 합니다

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="여러 리포지토리의 변경 상태를 보여주는 MonoSpecs 다중 리포지토리 개요." width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="검색 가능한 설치형 스킬과 소스 필터를 보여주는 HagiCode Skills Gallery." width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="재사용 가능한 지식 소스와 워크스페이스 작업을 보여주는 Vault 워크스페이스." width="100%" />
</p>

### 4. 운영적으로도 유용한 게임화 피드백

HagiCode는 업적, 일일 리포트, 효율 배수, 토큰 처리량, 그리고 테마형 인터페이스 피드백을 장식이 아니라 제품 기능으로 다룹니다. 그 결과, 장시간 실행되는 AI 작업이 보이도록 유지되는 워크스페이스가 만들어지며, 모든 것이 끝없이 스크롤되는 하나의 채팅으로 평평해지지 않습니다.

![일일 진행 상황, 마일스톤 지표, 장기 피드백을 보여주는 업적 홀 화면.](./src/assets/img/readme-sync/gamified-feedback.png)

## 공식 진입점

- [Website](https://hagicode.com/) 에서 전체 제품 홈페이지 보기
- [Product Overview](https://docs.hagicode.com/product-overview/) 에서 공식 공개 제품 소개 보기
- [Desktop](https://hagicode.com/desktop/) 에서 로컬 우선 설치 및 서비스 관리 보기
- [Container](https://hagicode.com/container/) 에서 셀프 호스팅 배포 경로 보기
- [Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) 에서 제품 업데이트와 장문 글 보기

## 이 리포지토리 개발하기

이 리포지토리는 HagiCode 공개 웹사이트를 담고 있습니다. `repos/site` 에서 다음을 실행하세요.

```bash
npm install
npm run dev
npm run build
npm run preview
```

기본 개발 서버는 `http://localhost:31264` 에서 실행됩니다.
기여자 안내는 [`AGENTS.md`](./AGENTS.md) 와 [`CLAUDE.md`](./CLAUDE.md) 에서 먼저 확인하세요.

## 프로덕션 배포

- 권위 있는 워크플로: `.github/workflows/site-deploy-gh-pages.yml`
- 프로덕션의 단일 기준 원본: `gh-pages` 브랜치이며, 배포는 GitHub Actions만 수행합니다
- 배포 페이로드 계약: 브랜치 루트에 `esa.jsonc` 를 두고, 검증된 Astro 정적 스냅샷은 `dist/` 에 둡니다
- `gh-pages` 이후 R2 경로: `deploy` job 이 성공하면 `upload-r2` 가 같은 검증된 `site-gh-pages-payload` artifact 를 내려받아 `.deploy/gh-pages/dist/` 내용만 R2 bucket 루트 또는 선택적 prefix 루트로 동기화하며, 추가 `dist/` 경로는 만들지 않습니다
- 수동 실행 경로: `workflow_dispatch` 는 기본적으로 `latest-gh-pages` 를 사용하므로, 유지보수자는 최신 `gh-pages` 브랜치 스냅샷을 기준으로 다시 빌드하지 않고 재배포할 수 있습니다. 현재 ref 에서 수동 재빌드 후 배포가 필요할 때만 `current-ref-build` 를 선택하세요
- 필수 R2 secrets: `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`; `R2_PREFIX` 는 선택 사항이며 대상 루트를 계산하기 전에 앞뒤 `/` 를 제거합니다
- 장애 진단: `gh-pages` 는 성공했지만 R2 업로드가 실패하면 workflow 는 `upload-r2` 에서 실패합니다. GitHub step summary 에서 해석된 bucket, prefix 루트, 실패가 전송 전 검증 단계인지 동기화 단계인지 확인하세요
- 필요한 GitHub 권한: deploy job 은 `contents: write` 가 필요하고, build job 은 읽기 전용으로 유지됩니다
- 필요한 호스팅 설정: 프로덕션 호스트가 `gh-pages/esa.jsonc` 를 읽고 `gh-pages/dist/` 를 정적 자산 디렉터리로 제공하도록 설정합니다
- 첫 배포 점검: 워크플로가 `esa.jsonc` 와 `dist/` 를 실제로 게시했는지 확인하고, 호스팅 대상이 여전히 `gh-pages` 를 가리키는지 확인하고, summary 에 예상한 R2 bucket 또는 prefix 루트가 표시되는지 확인한 뒤 `https://hagicode.com` 을 엽니다
- 롤백 경로: 소스 변경을 되돌리거나 이전 커밋에서 배포를 다시 실행해, CI가 이전 스냅샷을 다시 게시하게 합니다

### Desktop Index 폴백

`https://index.hagicode.com/desktop/history/` 에 있는 데스크톱 히스토리 인덱스는 여기서 참조되는 의존 대상일 뿐입니다. 사이트는 이를 데스크톱 안내를 위한 런타임 폴백 대상으로 링크하지만, 이 리포지토리 자체가 그 인덱스를 직접 게시하거나 관리하지는 않습니다.

## 라이선스

이 리포지토리는 [LICENSE](./LICENSE) 에 따라 배포됩니다.
