import TDesign from 'tdesign-vue-next';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import 'tdesign-vue-next/es/style/index.css';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.use(TDesign);
  },
};
