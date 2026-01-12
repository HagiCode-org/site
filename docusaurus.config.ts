import type { Config } from '@docusaurus/types';
import type { Options as PresetOptions } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PCode Documentation',
  tagline: 'Build better code with PCode',
  favicon: 'img/favicon.ico',

  url: 'https://pcode.docs',
  baseUrl: '/',

  organizationName: 'pcode',
  projectName: 'pcode-docs',

  onBrokenLinks: 'throw',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/pcode/pcode-docs/tree/main/',
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

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'PCode Docs',
      logo: {
        alt: 'PCode Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/pcode/pcode-docs',
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
              href: 'https://github.com/pcode/pcode-docs',
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
  },
};

export default config;
