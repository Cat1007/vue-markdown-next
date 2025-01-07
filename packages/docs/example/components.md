<script setup>
import { defineClientComponent } from 'vitepress'
const Components = defineClientComponent(() => import('/example/components.vue'))
</script>
# Components

Pass components that will be used instead of normal HTML elements.

## Slots & Props
Use Slots or Props to pass Vue components.

::: tip
The slot names are consistent with the corresponding HTML element tag names.
:::

::: raw
<Components />
:::
::: code-group
<<< @/example/components.vue
<<< @/example/components.tsx
:::

## `ExtraProps`

Extra fields we pass to components (TypeScript type).

###### Fields

* `node` ([`Element` from `hast`](https://github.com/syntax-tree/hast#element))
  — original node
* `children` 
  — children vnodes to be render
