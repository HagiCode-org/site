import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import linkValidator from 'astro-link-validator';

// https://astro.build/config
export default defineConfig({
    // 站点完整 URL,用于生成 sitemap 和 canonical URL
    site: 'https://hagicode.com',
    // 营销站点部署在根路径
    base: '/',
    markdown: {
        syntaxHighlight: {
            type: 'shiki',
        },
        rehypePlugins: [],
    },
    // 配置 Vite 环境变量
    vite: {
        resolve: {
            alias: {
                '@': new URL('./src', import.meta.url).pathname,
                '@shared': new URL('../../packages/shared/src', import.meta.url).pathname,
            },
        },
        define: {
            'import.meta.env.PROD': JSON.stringify(
                process.env.NODE_ENV === 'production'
            ),
            'import.meta.env.VITE_CLARITY_PROJECT_ID': JSON.stringify(
                process.env.VITE_CLARITY_PROJECT_ID || ''
            ),
            'import.meta.env.VITE_CLARITY_DEBUG': JSON.stringify(
                process.env.VITE_CLARITY_DEBUG || ''
            ),
            // Baidu Analytics - Disabled, migrated to 51LA
            // 'import.meta.env.VITE_BAIDU_ANALYTICS_ID': JSON.stringify(
            //     process.env.BAIDU_ANALYTICS_ID || ''
            // ),
            // 'import.meta.env.VITE_BAIDU_ANALYTICS_DEBUG': JSON.stringify(
            //     process.env.BAIDU_ANALYTICS_DEBUG || ''
            // ),
            'import.meta.env.VITE_51LA_ID': JSON.stringify(
                process.env.LI_51LA_ID || 'L6b88a5yK4h2Xnci'
            ),
            'import.meta.env.VITE_51LA_DEBUG': JSON.stringify(
                process.env.LI_51LA_DEBUG || ''
            ),
        },
        build: {
            rollupOptions: {
                external: [/virtual:astro-expressive-code\/.*/, 'astro-expressive-code'],
            },
        },
    },
    integrations: [
        // robots.txt 配置 - 使用 astro-robots-txt 插件
        robotsTxt({
            sitemap: 'https://hagicode.com/sitemap-index.xml',
        }),
        sitemap(),
        partytown(),
        react(),
        mdx(),
        // 链接验证集成 - 在 CI 环境中启用外部链接检查
        linkValidator({
            // 仅在 CI 环境中启用外部链接检查，避免本地构建时间过长
            checkExternal: process.env.CI === 'true',
            // 外部链接超时时间（毫秒）
            externalTimeout: 10000,
            // 链接检查不再阻塞构建，仅发出警告
            // 独立的链接检查由 .github/workflows/link-check.yml 负责
            failOnBrokenLinks: false,
            // 详细输出（用于调试）
            verbose: process.env.CI === 'true',
            // 排除某些路径（如 API 端点、管理后台）
            exclude: [],
        })
    ],
    scopedStyleStrategy: 'where',
});
