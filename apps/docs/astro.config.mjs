import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'
import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';

import mermaidInjector from './src/integrations/mermaid-injector.ts';
import rehypeMermaid from 'rehype-mermaid';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';

// 获取 base 路径：开发环境使用根路径，生产环境使用 /docs
const getBasePath = () => {
    // 使用 NODE_ENV 环境变量判断（与共享库一致）
    // Astro 在开发模式下 MODE='development'，生产构建时 MODE='production'
    const nodeEnv = import.meta.env.NODE_ENV || import.meta.env.MODE;
    if (nodeEnv === 'development') {
        return '/';
    }
    // 生产构建使用 /docs
    return '/docs';
};

// https://astro.build/config
export default defineConfig({
    // 站点完整 URL,用于生成 sitemap 和 canonical URL
    site: 'https://hagicode.com',
    // 文档站点部署路径：开发环境为根路径，生产环境为 /docs
    base: getBasePath(),
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
    },
    integrations: [
        // robots.txt 配置 - 使用 astro-robots-txt 插件
        robotsTxt({
            sitemap: 'https://hagicode.com/docs/sitemap-index.xml',
        }),
        starlight({
            title: 'Hagicode Docs',
            description: 'Hagicode 项目文档',
            social: [{ icon: 'github', label: 'GitHub 仓库', href: 'https://github.com/HagiCode-org/site' }],
            components: {
                Header: './src/components/StarlightHeader.astro',
                Footer: './src/components/StarlightFooter.astro',
            },
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
            plugins: [starlightBlog({
                rss: false,
            })],
        }),
        sitemap(),
        partytown(),
        react(),
        mermaidInjector()
    ],
    // 添加 Mermaid 渲染脚本到所有页面
    scopedStyleStrategy: 'where',
});
