### vite-plugin-transform__require-to-import
##### Vite + Vue2 project

##### Situation

```
__require(".......")
```

##### Install

```
npm install -D vite-plugin-transform__require-to-import
```

```
/* vite.config.js */
import { __requireToImport } from 'vite-plugin-transform__require-to-import'
export default defineConfig({
    plugins: [
        {
            __requireToImport(/* options */)
        }
    ]
})
```

##### Options

- Type: Array
- Default: []  /* eg. [packageName].*/


##### Result

```
__require("....")

/* transform */

import *** from "...."
```
