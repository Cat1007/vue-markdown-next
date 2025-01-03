import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { urlAttributes } from 'html-url-attributes';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import { PluggableList, unified } from 'unified';
import { BuildVisitor, visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import { computed, defineComponent, PropType, shallowRef, watch, h } from 'vue';
import { Fragment, JSX } from 'vue/jsx-runtime';
import { Root as HastRoot, Element, Parents } from 'hast';
import { defaultUrlTransform } from './utils';

// 替换 vue3 中的实现，vue3 实现后续参数中不存在 children，渲染函数无法处理 children 的渲染
function jsxWithChildren(type: any, props: any, key: any) {
  const { children } = props;
  // eslint-disable-next-line no-param-reassign
  props.key = key;
  return h(type, props, children);
}

type AllowedElementValidator = (
  node: Readonly<Element>,
  index: number,
  parent: Readonly<Parents> | undefined,
) => boolean | null | undefined;

export type Components = {
  [TagName in keyof JSX.IntrinsicElements]:
    | Component<JSX.IntrinsicElements[TagName] & ExtraProps>
    | keyof JSX.IntrinsicElements;
};
// 打开 pass node 会得到 node 参数
type ExtraProps = { node: Element; children?: JSX.Element | JSX.Element[] };
type Component<ComponentProps> =
  // Class component:
  | (new (props: ComponentProps) => JSX.ElementClass)
  // Function component:
  | ((props: ComponentProps) => JSX.Element | string | null | undefined);

const propsDefinition = {
  components: {
    type: Object as PropType<Components>,
    required: false,
  },
  content: {
    type: String,
    required: false,
    default: undefined,
  },
  skipHtml: {
    type: Boolean,
    required: false,
    default: false,
  },
  unwrapDisallowed: {
    type: Boolean,
    required: false,
    default: false,
  },
  className: {
    type: String,
    required: false,
    default: undefined,
  },
  allowElement: {
    type: Function as PropType<AllowedElementValidator>,
    required: false,
    default: undefined,
  },
  allowedElements: {
    type: Array as PropType<string[]>,
    required: false,
    default: undefined,
  },
  disallowedElements: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  urlTransform: {
    type: Function as PropType<(url: string, key: string, node: Readonly<Element>) => string | null | undefined>,
    required: false,
    default: undefined,
  },
  remarkPlugins: {
    type: Array as PropType<PluggableList>,
    required: false,
    default: () => [],
  },
  rehypePlugins: {
    type: Array as PropType<PluggableList>,
    required: false,
    default: () => [],
  },
  remarkRehypeOptions: {
    type: Object as PropType<Readonly<RemarkRehypeOptions>>,
    required: false,
    default: undefined,
  },
};

export default defineComponent({
  name: 'Markdown',
  props: propsDefinition,
  setup: (props, { slots }) => {
    const { allowedElements, disallowedElements, unwrapDisallowed } = props;

    function initMarkdownProcessor() {
      return unified()
        .use(remarkParse)
        .use(props.remarkPlugins)
        .use(remarkRehype, props.remarkRehypeOptions)
        .use(props.rehypePlugins);
    }

    const processor = shallowRef(initMarkdownProcessor());
    // 重新初始化 processor
    watch(
      () => [props.remarkPlugins, props.rehypePlugins, props.remarkRehypeOptions],
      () => {
        processor.value = initMarkdownProcessor();
      },
    );

    const renderTree = computed(() => {
      const file = new VFile();

      // 检测类型
      if (typeof props.content === 'string') {
        file.value = props.content;
      } else {
        console.error(`Unexpected value \`${props.content}\` for \`children\` prop, expected \`string\``);
      }

      // 二者只能取其一
      if (props.allowedElements && props.disallowedElements) {
        console.error('Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other');
      }

      const mdAstTree = processor.value.parse(file);
      let hastTree = processor.value.runSync(mdAstTree, file);

      if (props.className) {
        hastTree = {
          ...hastTree,
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: props.className },
              children: hastTree.children as any,
            },
          ],
        };
      }

      const urlTransform = props.urlTransform ?? defaultUrlTransform;

      const transform: BuildVisitor<HastRoot> = (node, index, parent) => {
        // 排除 root 类型
        if (node.type === 'root') {
          return;
        }
        // 是否展示 html 内容，不展示则删除该元素
        if (node.type === 'raw' && parent && typeof index === 'number') {
          if (props.skipHtml) {
            parent.children.splice(index, 1);
          } else {
            // eslint-disable-next-line no-param-reassign
            parent.children[index] = { type: 'text', value: (node as any).value };
          }
          return index;
        }

        if (node.type === 'element') {
          let key: string;
          for (key in urlAttributes) {
            if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(node.properties, key)) {
              const value = node.properties[key];
              const test = urlAttributes[key];
              if (test === null || test.includes(node.tagName)) {
                // eslint-disable-next-line no-param-reassign
                node.properties[key] = urlTransform(String(value || ''), key, node);
              }
            }
          }
        }

        // 是否处在渲染控制名单内
        if (node.type === 'element') {
          // eslint-disable-next-line no-nested-ternary
          let remove = allowedElements
            ? !allowedElements.includes(node.tagName)
            : disallowedElements
            ? disallowedElements.includes(node.tagName)
            : false;

          if (!remove && props.allowElement && typeof index === 'number') {
            remove = !props.allowElement(node, index, parent);
          }

          if (remove && parent && typeof index === 'number') {
            if (unwrapDisallowed && node.children) {
              parent.children.splice(index, 1, ...node.children);
            } else {
              parent.children.splice(index, 1);
            }

            return index;
          }
        }
      };

      visit(hastTree, transform);
      return hastTree;
    });

    const componentsWithSlot = computed(() => {
      const slotComponents: Partial<Components> = {};
      Object.keys(slots).forEach((slotName) => {
        slotComponents[slotName as any] = (slotProps: any) => slots[slotName]!(slotProps) as any;
      });
      return slotComponents;
    });

    // 返回渲染函数结果
    return () =>
      toJsxRuntime(renderTree.value, {
        Fragment,
        components: {
          ...props.components,
          ...componentsWithSlot.value,
        },
        ignoreInvalidStyle: true,
        jsx: jsxWithChildren,
        jsxs: jsxWithChildren,
        passKeys: true,
        passNode: true,
      });
  },
});
