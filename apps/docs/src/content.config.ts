import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema'

export const collections = {
	docs: defineCollection({
		loader: docsLoader({ extensions: ['.md', '.mdx'] }),
		schema: docsSchema({
			extend: (context) => blogSchema(context),
		})
	}),
};
