// const { transformCode } = require('./transform.js')
/**
 * 替换第三方插件里面的 __require() 方法
 * @param {*} code
 * @param {*} id
 * @returns
 */
export const __requireToImport = (includes = []) => {
	return {
		name: '__requireToImport',
		apply: 'serve',
		transform(code, id) {
			let result = code
			if (includes.some(item => id.includes(item))) {
				if (!/\/node_modules\//g.test(id)) return result
				// 该插件不适合用ast去转换，第三方插件的代码量太大
				// result = transformCode(code)
				const requireRegex = /_{2}require*\(\s*(["'].*["'])\s*\)/g
				const IMPORT_STRING_PREFIX = '__require_for_vite'
				const requireMatches = result.matchAll(requireRegex)
				let importsString = ''
				let packageName = ''
				let replaced = false
				for (const item of requireMatches) {
					if (!isString(item[1])) {
						console.warn(`Not supported dynamic import, file:${id}`)
						continue
					}
					replaced = true
					packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`
					importsString += `import ${packageName} from ${item[1]};\n`
					result = result.replace(item[0], `${packageName}`)
				}
				if (replaced) {
					result = importsString + result
				}
			}

			return {
				code: result,
				map: null,
				warnings: null
			}
		}
	}
}

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

function isString(text) {
	try {
	  return typeof eval(text) === 'string'
	} catch (err) {
	  return false
	}
}