import { defineConfig } from 'vitepress';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vue Markdown Next',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Get Started', link: '/guide/' }],
      },
      {
        text: 'Example',
        items: [{ text: 'Components', link: '/example/components' }],
      },
      {
        text: 'API',
        items: [{ text: 'Props', link: '/api/' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/Cat1007/vue-markdown-next' }],
  },
  vite: {
    plugins: [
      vueJsx(),
      AutoImport({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      Components({
        resolvers: [
          TDesignResolver({
            library: 'vue-next',
          }),
        ],
      }),
      {
        name: 'increase-width',
        transform(code, id) {
          if (/\.css($|\?)/.test(id)) {
            return code.replace(/1440px/g, '1800px').replace(/688px/g, '100%');
          }
        },
      },
    ],
  },
});
