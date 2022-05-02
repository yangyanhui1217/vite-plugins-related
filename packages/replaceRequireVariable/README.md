##### 场景

```
// vite+vue2的项目 转换包含变量的require函数
// v1.0.x仅支持这一种（即只支持vite-plugin-vue2@1.x.x）
require(("../../assets/img/" + _vm.filePath + ".png"))

// v1.1.1以上版本又支持了下边两种场景，即也兼容了vite-plugin-vue2@2.x.x
require("../../assets/img/icon_".concat(_vm.fileType, ".png"))
require(`../../assets/img/icon_${_vm.fileType}.png`)

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
