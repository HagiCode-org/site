import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import linkValidator from "astro-link-validator";

import mermaidInjector from "./src/integrations/mermaid-injector.ts";
import rehypeMermaid from "rehype-mermaid";
// rehype-raw 暂时禁用，可能与 MDX 处理冲突
// import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";

// 获取 base 路径：文档站点独立部署在 docs.hagicode.com，开发和生产都使用根路径
const getBasePath = () => {
  // 文档站点现在独立部署在 docs.hagicode.com
  // 不再需要 /docs 前缀，开发和生产都使用根路径
  return "/";
};

// https://astro.build/config
export default defineConfig({
  // 站点完整 URL,用于生成 sitemap 和 canonical URL
  site: "https://docs.hagicode.com",
  // 文档站点部署路径：独立部署在 docs.hagicode.com，使用根路径
  base: getBasePath(),
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
    rehypePlugins: [
      // rehypeRaw 暂时禁用，可能与 MDX 处理冲突
      // rehypeRaw,
      rehypeMermaid,
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        },
      ],
    ],
  },
  // 配置 Vite 环境变量
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
        "@shared": new URL("../../packages/shared/src", import.meta.url)
          .pathname,
      },
    },
    define: {
      'import.meta.env.PROD': JSON.stringify(
        process.env.NODE_ENV === 'production'
      ),
      "import.meta.env.VITE_CLARITY_PROJECT_ID": JSON.stringify(
        process.env.VITE_CLARITY_PROJECT_ID || "",
      ),
      "import.meta.env.VITE_CLARITY_DEBUG": JSON.stringify(
        process.env.VITE_CLARITY_DEBUG || "",
      ),
      // Baidu Analytics - Disabled, migrated to 51LA
      // "import.meta.env.VITE_BAIDU_ANALYTICS_ID": JSON.stringify(
      //   process.env.BAIDU_ANALYTICS_ID || "",
      // ),
      // "import.meta.env.VITE_BAIDU_ANALYTICS_DEBUG": JSON.stringify(
      //   process.env.BAIDU_ANALYTICS_DEBUG || "",
      // ),
      "import.meta.env.VITE_51LA_ID": JSON.stringify(
        process.env.LI_51LA_ID || "L6b88a5yK4h2Xnci",
      ),
      "import.meta.env.VITE_51LA_DEBUG": JSON.stringify(
        process.env.LI_51LA_DEBUG || "",
      ),
    },
  },
  integrations: [
    // robots.txt 配置 - 使用 astro-robots-txt 插件
    robotsTxt({
      sitemap: "https://docs.hagicode.com/sitemap-index.xml",
    }),

    starlight({
      title: "Hagicode Docs",
      description: "Hagicode 项目文档",
      favicon: "/favicon.ico",
      social: [
        {
          icon: "github",
          label: "GitHub 仓库",
          href: "https://github.com/HagiCode-org/site",
        },
      ],
      components: {
        Header: "./src/components/StarlightHeader.astro",
        Footer: "./src/components/StarlightFooter.astro",
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      sidebar: [
        {
          label: "产品概述",
          link: "/product-overview",
        },
        {
          label: "快速开始",
          autogenerate: { directory: "quick-start" },
        },
        {
          label: "安装指南",
          autogenerate: { directory: "installation" },
        },
        {
          label: "相关软件安装",
          autogenerate: { directory: "related-software-installation" },
        },
      ],
      customCss: ["./src/styles/starlight-override.css"],
      editLink: {
        baseUrl: "https://github.com/HagiCode-org/site/edit/main/",
      },
      plugins: [
        starlightBlog({
          rss: false,
          postCount: 20,
        }),
      ],
    }),
    sitemap(),
    partytown(),
    react(),
    mermaidInjector(),
    // 链接验证集成 - 在 CI 环境中启用外部链接检查
    linkValidator({
      // 仅在 CI 环境中启用外部链接检查，避免本地构建时间过长
      checkExternal: process.env.CI === "true",
      // 外部链接超时时间（毫秒）
      externalTimeout: 10000,
      // 链接检查不再阻塞构建，仅发出警告
      // 独立的链接检查由 .github/workflows/link-check.yml 负责
      failOnBrokenLinks: false,
      // 详细输出（用于调试）
      verbose: process.env.CI === "true",
      // 排除某些路径（如 API 端点、管理后台）
      exclude: [],
    }),
  ],
  // 添加 Mermaid 渲染脚本到所有页面
  scopedStyleStrategy: "where",
});
