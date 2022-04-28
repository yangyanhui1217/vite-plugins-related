##### 场景

```
// vite+vue2的项目 转换包含变量的require函数

require(("../../assets/img/" + _vm.filePath + ".png"))
```

##### 安装

```
npm install vite-plugin-replace-require-variable -D
```

##### 用法

```
// 在 vite.config.js 里面使用

import { replaceRequireVariable } from 'vite-plugin-replace-require-variable'

// 使用
export default defineConfig({
    plugins: [
        {
            replaceRequireVariable([/*.vue组件*/]), // 参数是.vue文件名
        }
    ]
})

```

##### 转换后的效果
```
import *** from "...."
const obj = {
    "....": ***
}

let 变量 = obj["...."]
```
