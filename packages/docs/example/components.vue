<template>
  <Markdown :content="testContent" :components="components">
    <template #hr>
      <t-divider align="left">Using TDesign Divider</t-divider>
    </template>
    <template #ul="{ children }">
      <ul class="test-class">
        <!-- use VNodeRenderer to render children content when using template -->
        <v-node-renderer :content="children"></v-node-renderer>
      </ul>
    </template>
  </Markdown>
</template>

<script setup>
import { Markdown, VNodeRenderer } from 'vue-markdown-next';
import { Divider as TDivider } from 'tdesign-vue-next';
import { components } from './components';

const testContent = `

---

This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>

- Red
- Green
- Blue
    - Red
    - Green
        - Blue

`;
</script>
