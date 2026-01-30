import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'
import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';

import react from '@astrojs/react';
import mermaidInjector from './src/integrations/mermaid-injector.ts';
import rehypeMermaid from 'rehype-mermaid';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
    // 从环境变量读取站点基础路径,默认为 '/' (根路径部署)
    // 可通过 VITE_SITE_BASE 环境变量覆盖
    // 示例: VITE_SITE_BASE=/site 表示子路径部署
    base: import.meta.env.VITE_SITE_BASE || '/',
    markdown: {
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid', 'math'],
        },
        rehypePlugins: [
			rehypeRaw,
			rehypeMermaid,
			[rehypeExternalLinks, {
				target: '_blank',
				rel: ['noopener', 'noreferrer'],
			}],
		],
    },
    // 配置 Vite 环境变量
    vite: {
        define: {
            'import.meta.env.VITE_CLARITY_PROJECT_ID': JSON.stringify(
                process.env.CLARITY_PROJECT_ID || ''
            ),
        },
    },
    integrations: [starlight({
        title: 'Hagicode Docs',
        description: 'Hagicode 项目文档',
        social: [{ icon: 'github', label: 'GitHub 仓库', href: 'https://github.com/HagiCode-org/site' }],
        sidebar: [
            {
                label: '产品概述',
                link: '/product-overview',
            },
            {
                label: '快速开始',
                autogenerate: { directory: 'quick-start' },
            },
            {
                label: '安装指南',
                autogenerate: { directory: 'installation' },
            },
            {
                label: '相关软件安装',
                autogenerate: { directory: 'related-software-installation' },
            },
        ],
        customCss: ['./src/styles/starlight-override.css'],
        editLink: {
            baseUrl: 'https://github.com/HagiCode-org/site/edit/main/',
        },
        components: {

            Footer: './src/components/StarlightFooter.astro',

        },

        plugins: [starlightBlog()],
    }), sitemap(), partytown(), react(), mermaidInjector()],
    // 添加 Mermaid 渲染脚本到所有页面
    scopedStyleStrategy: 'where',
});