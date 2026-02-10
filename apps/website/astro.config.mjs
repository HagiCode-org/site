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
            'import.meta.env.VITE_CLARITY_PROJECT_ID': JSON.stringify(
                process.env.CLARITY_PROJECT_ID || ''
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
