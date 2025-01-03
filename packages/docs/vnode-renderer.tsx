import { defineComponent, PropType } from 'vue';
import { JSX } from 'vue/jsx-runtime';

export const VNodeRenderer = defineComponent({
  props: {
    content: {
      type: Object as PropType<JSX.Element>,
      default: undefined,
    },
  },
  render(): any {
    return this.content;
  },
});
