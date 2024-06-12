import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';




// https://astro.build/config
export default defineConfig({
	site: 'https://smilingrobo.github.io',
  	base: 'docs',
	integrations: [
		starlight({
			title: 'SmilingRobo Docs',
			social: {
				github: 'https://github.com/SmilingRobo',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Example Guide', link: '/guides/example/' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
