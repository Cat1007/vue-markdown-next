# Get Started

## What is this?

This package is a `Vue` component that can be given a string of markdown that it’ll safely render to Vue elements.


You can pass plugins to change how markdown is transformed and pass components that will be used instead of normal HTML elements.

* to learn markdown, see this [cheatsheet and tutorial](https://commonmark.org/help/)

::: tip
This package was inspired by [react-markdown](https://www.npmjs.com/package/react-markdown), and the implementation ideas can be referenced from the [GitHub](https://github.com/remarkjs/react-markdown/tree/main?tab=readme-ov-file#architecture).
:::

## Installation

```sh
npm install -D vue-markdown-next
```

## Usage Example

<script setup>
import { defineClientComponent } from 'vitepress'
const Basic = defineClientComponent(() => import('/guide/basic.vue'))
</script>

<Basic />
<<< @/guide/basic.vue