const parser = require("@babel/parser")
const traverse = require("@babel/traverse")
const t = require("@babel/types")
const babel = require("@babel/core")
const fs = require('fs')

const IMPORT_STRING_PREFIX = '__require_for_vite'
let code = `import {
  require_runtime
} from "/node_modules/.vite/deps/chunk-E2XP4KNL.js?v=c8e8a1c1";
import {
  require_button,
  require_emitter,
  require_link,
  require_migrating,
  require_popover,
  require_popup
} from "/node_modules/.vite/deps/chunk-MYNUDE7K.js?v=c8e8a1c1";
import {
  init_vue_runtime_esm,
  vue_runtime_esm_exports
} from "/node_modules/.vite/deps/chunk-K2FFXQ5H.js?v=c8e8a1c1";
import {
  require_lodash
} from "/node_modules/.vite/deps/chunk-K2XUPI24.js?v=c8e8a1c1";
import {
  __commonJS,
  __esm,
  __export,
  __require,
  __toCommonJS,
  __toESM,
  init_define_process_env
} from "/node_modules/.vite/deps/chunk-AUOZSVCY.js?v=c8e8a1c1";function test(module2, exports2) {
	module2.exports = __require("/Users/yangyanhui/projects/huiyan-manage-static/node_modules/@zto/zui/lib/theme-chalk/base.css");
}function test2(module2, exports2) {
	module2.exports = __require("/Users/yangyanhui/projects/huiyan-manage-static/node_modules/@zto/zui/lib/theme-chalk/base.css");
}`
/**
 * transfom __require to import ... from ...
 * @param {*} code 源码
 * @returns
 */
const transformCode = (code) => {
	const ast = parser.parse(code, { sourceType: 'module' })
	let importNodeList = []

	traverse.default(ast, {
		enter(path) {
			// Determine if it is a requirement function
			if (t.isCallExpression(path.node) && path.node.callee.name === '__require') {
				let parent = path.findParent((path) => path.isImportDeclaration())
				console.log(parent);
				const requireArgs = path.node.arguments.length ? path.node.arguments[0] : null
				if (requireArgs) {
					let packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`
					// generate import ... from ...
					let importNode = t.importDeclaration([t.importDefaultSpecifier(t.identifier(packageName))], t.stringLiteral(requireArgs.value))
					if (importNode) {
						importNodeList.push(importNode)
						parent.insertBefore(importNode)
						path.replaceWith(t.identifier(packageName))
					}
				}
			}
		},
		exit(path) {
			if (t.isImportDeclaration(path.node)) {
				// Write the generated code to top
				// importNodeList.forEach(node => {
				// 	path.container.unshift(node)
				// })
				// importNodeList = []
			}
		}
	})

	const result = babel.transformFromAst(ast)
	fs.writeFileSync('file.js', result.code)
	return result.code
}

transformCode(code)
/**
 *
 * @param {必填，数字} length
 * @returns hash串
 */
 function randomString(length) {
  const code = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let result = ''
  for (let index = 0; index < length; index++) {
    result += code[Math.floor(Math.random() * code.length)]
  }
  return result
}
module.exports = {
	transformCode
}
