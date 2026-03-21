import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    // 站点完整 URL,用于生成 sitemap 和 canonical URL
    site: 'https://hagicode.com',
    // 营销站点部署在根路径
    base: '/',
    // 国际化配置
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'zh-CN'],
        routing: {
            prefixDefaultLocale: false,
        },
    },
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
                '@/lib/shared': new URL('./src/lib/shared', import.meta.url).pathname,
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
    ],
    scopedStyleStrategy: 'where',
});
