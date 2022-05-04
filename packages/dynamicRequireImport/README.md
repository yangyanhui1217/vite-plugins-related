### vite-plugin-dynamic-require-import
##### Vite + Vue2 project

##### Situation

```
component: resolve => require(["../views/index"], resolve)
```

##### Install

```
npm install vite-plugin-dynamic-require-import -D
```

```
/* vite.config.js */
import { replaceRequireVariable } from 'vite-plugin-replace-require-variable'

export default defineConfig({
    plugins: [
        {
            dynamicRequireToImport(/* options */)
        }
    ]
})

```

##### Options

- Type: RegExp
- Default: /(.js|.jsx)$/

##### Result

```
component: resolve => require(["../views/index"], resolve)

/* transform */

component: () => import("../views/index.vue")
```
