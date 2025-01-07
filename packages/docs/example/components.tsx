import { Link } from 'tdesign-vue-next';
// get typescript support
import type { Components } from 'vue-markdown-next';

export const components: Partial<Components> = {
  a: (props) => {
    // render children content directly when using tsx
    return (
      <Link theme={'success'} target="_blank" href={props.href} size={'medium'} style={{ fontSize: '16px' }}>
        {props.children}
      </Link>
    );
  },
};
