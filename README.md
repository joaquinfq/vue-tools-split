# vue-tools-split [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[![npm install vue-tools-split](https://nodei.co/npm/vue-tools-split.png?compact=true)](https://npmjs.org/package/vue-tools-split/)

Split a `.vue` file into `script.js`, `style.css` and `template.html`.

## Example

Input component:

```
// MyCmp.vue
<template>
    <div class="my-cmp">MyCmp</div>
</template>
<script>
    export {
        name : 'my-cmp'
    }
</script>
<style>
    .my-cmp {
        margin : 5px;
    }
</style>
```

Script:

```js
const vueToolsSplit = require('vue-tools-split');
const sections      = vueToolsSplit.fromFile('MyCmp.vue');
console.log(sections);
// { vue: '<template src="./template.html" />\n<script   src="./script.js"     />\n<style    src="./style.css"     />\n',
//   template: '    <div class="my-cmp">MyCmp</div>',
//   script: '    export {\n        name : \'my-cmp\'\n    }',
//   style: '    .my-cmp {\n        margin : 5px;\n    }' }
//------------------------------------------------------------------------------
// Write result to files.
//------------------------------------------------------------------------------
vueToolsSplit.write(sections);
// ├── index.vue
// ├── script.js
// ├── style.css
// └── template.html
```
