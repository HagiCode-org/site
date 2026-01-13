import type { Config } from '@docusaurus/types';
import type { Options as PresetOptions } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PCode Documentation',
  tagline: 'Build better code with PCode',
  favicon: 'img/favicon.ico',

  url: 'https://pcode-org.github.io',
  baseUrl: '/site/',

  organizationName: 'pcode',
  projectName: 'pcode-docs',

  onBrokenLinks: 'throw',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/PCode-org/site/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
          },
        },
        pages: {},
        theme: {
          customCss: ['./src/css/custom.css'],
        },
      } satisfies PresetOptions,
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'PCode Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/PCode-org/site',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/PCode-org/site',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PCode. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['bash', 'csharp', 'fsharp', 'powershell'],
    },
    mermaid: {
      theme: {
        light: 'base',
        dark: 'dark',
      },
    },
  },
};

export default config;
