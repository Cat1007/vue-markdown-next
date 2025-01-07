import { defineComponent, PropType } from 'vue';

export const VNodeRenderer = defineComponent({
  props: {
    content: {
      type: Object as PropType<any>,
      default: undefined,
    },
  },
  render(): any {
    return this.content;
  },
});
