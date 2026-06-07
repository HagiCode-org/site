<div align="center">

# HagiCode

<p><strong>HagiCode es un producto que reúne una herramienta de programación con IA, un sistema de retroalimentación gamificado y un espacio de trabajo de desarrollo completo en una sola plataforma.</strong></p>

<p>Úsalo para entender repositorios, redactar propuestas, descomponer tareas, modificar código, organizar commits, gestionar varios repositorios y construir una base de conocimiento reutilizable sin salir del mismo espacio de trabajo.</p>

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

| Vista previa | Producto | Qué es | Empieza aquí |
| --- | --- | --- | --- |
| <img src="./src/assets/img/readme-sync/workspace-overview.png" alt="HagiCode desktop workspace preview" width="280" /> | **HagiCode for Windows** | Current public entry point for the desktop app. The Steam main application entry has been retired. | [Open Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) · [Desktop downloads](https://hagicode.com/desktop/) · [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) |
| <img src="./src/assets/img/readme-sync/steam/hagicode-plus-wide-capsule.png" alt="Hagicode Plus bundle artwork" width="280" /> | **Hagicode Plus** | Bundle and upgrade guidance remains available through the docs site. | [Read Hagicode Plus docs](https://docs.hagicode.com/bundles/hagicode-plus/) |
| <img src="./src/assets/img/readme-sync/steam/turbo-engine-wide-capsule.png" alt="Turbo Engine DLC artwork" width="280" /> | **Turbo Engine DLC** | DLC guidance for higher concurrency and customization remains available through the docs site. | [Read Turbo Engine DLC docs](https://docs.hagicode.com/dlc/turbo-engine-dlc/) |

## Qué es HagiCode

HagiCode no se creó para ser otra caja de chat para código. Lleva la IA a todo el proceso de desarrollo de software: entender repositorios, planificar cambios, implementar código, organizar commits, conservar conocimiento y mantener revisable todo el flujo desde la idea hasta el archivo.

![Resumen del espacio de trabajo de HagiCode con sesiones, notas de commit y acciones principales en una vista integrada.](./src/assets/img/readme-sync/workspace-overview.png)

## Capacidades principales

### 1. Programación con IA guiada por propuestas con OpenSpec

Para el trabajo no trivial, HagiCode empieza con una propuesta en lugar de saltar directamente a editar archivos. OpenSpec convierte las solicitudes en alcance, tareas, análisis de impacto, pasos de validación y una traza de ejecución que sigue siendo fácil de revisar.

![Vista de sesión de propuesta de HagiCode con pasos del flujo, resultados de ejecución y contexto histórico.](./src/assets/img/readme-sync/open-spec-proposal-workflow.png)

### 2. CLI de agentes populares con OmniRoute

HagiCode es compatible con Codex, Claude Code, GitHub Copilot, OpenCode, Hermes, QoderCLI, Kiro, Kimi, Gemini, Pi, Reasonix, DeepAgents y Codebuddy. OmniRoute separa la elección del CLI de la capa de modelos y suscripciones, para que los equipos puedan enrutar modelos y endpoints sin atarlo todo a una única pila predeterminada.

![Página de configuración de OmniRoute con enrutamiento, controles de endpoint y estado de ejecución.](./src/assets/img/readme-sync/omniroute-routing.png)

### 3. Un espacio de desarrollo completo, no solo un panel de chat

El espacio de trabajo reúne capacidades que normalmente terminan dispersas entre varias herramientas:

- `MonoSpecs` para inventario, alcance y coordinación entre múltiples repositorios
- `Skills` para extensiones instalables de flujo de trabajo y herramientas conscientes de la confianza
- `Vault` para capturar conocimiento reutilizable entre proyectos
- `AI Compose Commit` y la integración con `code-server` para terminar el trabajo dentro del mismo flujo

<p align="center">
  <img src="./src/assets/img/readme-sync/monospecs-multi-repo.png" alt="Vista general de MonoSpecs mostrando el estado de cambios en varios repositorios." width="49%" />
  <img src="./src/assets/img/readme-sync/skills-gallery.png" alt="HagiCode Skills Gallery con habilidades instalables buscables y filtros por fuente." width="49%" />
</p>

<p align="center">
  <img src="./src/assets/img/readme-sync/vault-workspace.png" alt="Espacio Vault con fuentes de conocimiento reutilizables y acciones del espacio de trabajo." width="100%" />
</p>

### 4. Retroalimentación gamificada que sigue siendo útil operativamente

HagiCode trata los logros, los informes diarios, los multiplicadores de eficiencia, el rendimiento de tokens y la retroalimentación visual temática como parte del producto, no como adornos. El resultado es un espacio de trabajo que mantiene visible el trabajo prolongado con IA en lugar de aplanarlo todo en un único chat interminable.

![Sala de logros con progreso diario, métricas de hitos y superficies de retroalimentación a largo plazo.](./src/assets/img/readme-sync/gamified-feedback.png)

## Puntos de entrada oficiales

- [Website](https://hagicode.com/) para ver la página principal completa del producto
- [Product Overview](https://docs.hagicode.com/product-overview/) para ver la introducción pública oficial del producto
- [Desktop](https://hagicode.com/desktop/) para la instalación local y la gestión de servicios
- [Container](https://hagicode.com/container/) para la ruta de despliegue autoalojado
- [Windows Store](https://apps.microsoft.com/detail/9N3PM0N3SVDW) for the current Windows desktop entry point
- [Steam status FAQ](https://docs.hagicode.com/faq/steam-distribution-status/) for why the Steam main application is no longer the primary channel
- [Blog](https://docs.hagicode.com/blog/) para actualizaciones del producto y artículos extensos

## Desarrollar este repositorio

Este repositorio contiene el sitio público de HagiCode. Desde `repos/site`, ejecuta:

```bash
npm install
npm run dev
npm run build
npm run preview
```

El servidor de desarrollo predeterminado se ejecuta en `http://localhost:31264`.
Para la guía de contribución, empieza por [`AGENTS.md`](./AGENTS.md) y [`CLAUDE.md`](./CLAUDE.md).

## Despliegue en producción

- Flujo de trabajo autoritativo: `.github/workflows/site-deploy-gh-pages.yml`
- Fuente de verdad en producción: la rama `gh-pages`, publicada solo por GitHub Actions
- Contrato del payload publicado: `esa.jsonc` en la raíz de la rama y la instantánea estática validada de Astro dentro de `dist/`
- Ruta R2 posterior a `gh-pages`: después de que el job `deploy` termine correctamente, `upload-r2` descarga el mismo artifact validado `site-gh-pages-payload` y sincroniza solo el contenido de `.deploy/gh-pages/dist/` hacia la raíz del bucket R2 o una raíz de prefijo opcional, sin agregar otro segmento `dist/`
- Ruta manual: `workflow_dispatch` usa `latest-gh-pages` por defecto, así que los mantenedores pueden republicar directamente desde la instantánea más reciente de la rama `gh-pages` sin reconstruir; elige `current-ref-build` solo cuando haga falta reconstruir manualmente y volver a publicar desde la ref actual
- Secrets R2 requeridos: `R2_ENDPOINT`, `R2_BUCKET`, `R2_ACCESS_KEY_ID` y `R2_SECRET_ACCESS_KEY`; `R2_PREFIX` es opcional y elimina los `/` iniciales y finales antes de resolver la raíz de destino
- Diagnóstico de fallos: si `gh-pages` tiene éxito pero la subida a R2 falla, el workflow falla en `upload-r2`; revisa el step summary de GitHub para ver el bucket resuelto, la raíz de prefijo y si el fallo ocurrió antes de transferir o durante la sincronización
- Permisos de GitHub necesarios: el job de despliegue necesita `contents: write`; el job de build se mantiene en solo lectura
- Configuración de hosting necesaria: el host de producción debe leer `gh-pages/esa.jsonc` y servir `gh-pages/dist/` como directorio estático
- Comprobaciones del primer despliegue: confirma que el flujo publica `esa.jsonc` y `dist/`, verifica que el destino de hosting siga apuntando a `gh-pages`, confirma que el summary muestra el bucket R2 o la raíz de prefijo esperada y luego carga `https://hagicode.com`
- Ruta de rollback: revierte el cambio fuente o vuelve a ejecutar el despliegue desde un commit anterior para que la CI vuelva a publicar la instantánea previa

### Fallback del Desktop Index

El índice histórico de escritorio en `https://index.hagicode.com/desktop/history/` es aquí solo una dependencia referenciada. El sitio enlaza a él como destino de fallback en tiempo de ejecución para la guía de escritorio, pero este repositorio no publica ni mantiene directamente ese índice.

## Licencia

Este repositorio se publica bajo [LICENSE](./LICENSE).
