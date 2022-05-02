const { transformCode } = require('./transform')
// import { transformCode  } from "./transform.js"

/**
 * 替换项目中包含变量的require函数
 * includes 需要替换的文件名数组
 * @returns
 */
const replaceRequireVariable = (includes = []) => {
  return {
    name: 'replaceRequireVariable',
    apply: 'serve',
    transform(code, id) {
      // exclude node_modules
      if (/\/node_modules\//g.test(id)) return code
      if (!includes.length) return code

      let result = code
      if (id.includes('type=template') && includes.some(item => id.includes(item))) {
        result = transformCode(code, id)
      }
      return result
    }
  }
}

module.exports = {
  replaceRequireVariable
}