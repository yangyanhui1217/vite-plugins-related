#### 用import from 替换第三方插件里面的 __require() 方法

##### 安装

```
npm install -D vite-plugin-transform__require-to-import
```


##### 用法

```
// 在vite.config.js里面使用

// 引入
import { __requireToImport } from 'vite-plugin-transform__require-to-import'

// 使用
export default defineConfig({
    plugins: [
        {
            __requireToImport(['zui-plugins']), // 参数是第三方包名数组
        }
    ]
})

```

##### 转换后的效果
```
__require("....")

// 转换成

import *** from "...."

```
