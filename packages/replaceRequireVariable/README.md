### vite-plugin-replace-require-variable
##### vite+vue2 project

##### Situation

```
/* v1.0.x just support (vite-plugin-vue2@1.x.x）*/
require(("../../assets/img/" + _vm.filePath + ".png"))

/* v1.1.1 after support vite-plugin-vue2@2.x.x */
require("../../assets/img/icon_".concat(_vm.fileType, ".png"))
require(`../../assets/img/icon_${_vm.fileType}.png`)

```

##### Install

```
npm install vite-plugin-replace-require-variable -D
```


```
/* vite.config.js */
import { replaceRequireVariable } from 'vite-plugin-replace-require-variable'

export default defineConfig({
    plugins: [
        {
            replaceRequireVariable(/* options */)
        }
    ]
})

```

##### Options

- Type: Array
- Default: []  /* eg. ['xxx.vue'].*/


##### Result

```
import a from "b"
const obj = {
    "b": a
}

let varibles = obj["b"]
```
