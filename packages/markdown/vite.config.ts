import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // 打包文件目录
    outDir: 'lib',
    // 压缩
    minify: true,
    rollupOptions: {
      // 忽略外部依赖，不打包相关文件
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        dir: 'lib',
      },
    },
    lib: {
      entry: {
        'vue-markdown-next': 'index.ts',
      },
      name: 'vue-markdown-next',
      formats: ['es', 'cjs'],
    },
  },
  plugins: [vue(), vueJsx()],
});
