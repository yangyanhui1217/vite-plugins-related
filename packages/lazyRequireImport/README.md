##### 场景

```
component: resolve => require(["../views/index"], resolve)

```

##### 安装

```
npm install vite-plugin-lazy-require-import -D
```

##### 用法

```
// 在 vite.config.js 里面使用

import { lazyRequireImport } from 'vite-plugin-lazy-require-import'

// 使用
export default defineConfig({
    plugins: [
        {
            lazyRequireImport(), // 参数：正则，默认 /.js|.jsx/
        }
    ]
})

```

##### 转换后的效果
```
component: resolve => require(["../views/index"], resolve)
转换成
component: () => import("../views/index")
```
