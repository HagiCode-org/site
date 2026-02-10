import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// 获取 base 路径的函数（与 astro.config.mjs 中的逻辑一致）
function getBasePath(): string {
  // 文档站点现在独立部署在 docs.hagicode.com
  // 不再需要 /docs 前缀，开发和生产都使用根路径
  return '/';
}

export async function GET(context) {
  const blog = await getCollection('docs');

  // 过滤出博客文章（有 date 字段的）
  const posts = blog
    .filter(post => post.data.date)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 20); // 只显示最新的 20 篇

  const basePath = getBasePath();
  const site = context.site?.toString() || 'https://hagicode.com';

  return rss({
    title: 'Hagicode Docs | Blog',
    description: 'Hagicode 项目文档',
    site: site,
    items: posts.map(post => ({
      title: post.data.title,
      link: `${basePath}/${post.id}/`, // 使用 id 而不是 slug
      pubDate: post.data.date,
      description: post.data.excerpt || '',
      // 不包含 content，只有标题、链接和描述
    })),
    customData: `<language>zh-cn</language>`,
  });
}
