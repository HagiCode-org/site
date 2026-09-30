import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { hagilightRss } from '@hagicode/hagilight/integration';
import { DEFAULT_LOCALE, SUPPORTED_SITE_LOCALES } from './src/i18n/locale-metadata.ts';

// https://astro.build/config
export default defineConfig({
    // 站点完整 URL,用于生成 sitemap 和 canonical URL
    site: 'https://www.hagicode.com',
    // 营销站点部署在根路径
    base: '/',
    // 国际化配置
    i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: [...SUPPORTED_SITE_LOCALES],
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
            'import.meta.env.VITE_CLARITY_PROJECT_ID': JSON.stringify(
                process.env.VITE_CLARITY_PROJECT_ID || ''
            ),
            'import.meta.env.VITE_CLARITY_DEBUG': JSON.stringify(
                process.env.VITE_CLARITY_DEBUG || ''
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
            sitemap: 'https://www.hagicode.com/sitemap-index.xml',
        }),
        hagilightRss({
            locales: Object.fromEntries(
                SUPPORTED_SITE_LOCALES.map((lang) => [lang, { lang }]),
            ),
            getFeed: './src/lib/rss-feed.ts',
        }),
        sitemap({
            filter: (page) => {
                const pathname = new URL(page).pathname;
                return !pathname.startsWith('/en/');
            },
        }),
        partytown(),
        react(),
        mdx(),
    ],
    scopedStyleStrategy: 'where',
});
