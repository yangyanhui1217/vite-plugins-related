const { transformCode } = require('./transform')

/**
 * 将require动态加载转换为import懒加载
 * filters 需要替换的文件后缀名数组
 * @returns
 */
const dynamicRequireToImport = (filters = /(.js|.jsx)$/) => {
  return {
    name: 'dynamicRequireToImport',
    apply: 'serve',
    transform(code, id) {
      // exclude node_modules
      if (/\/node_modules\//g.test(id)) return { code }
      if (!filters.test(id)) return { code }

      let result = transformCode(code)
      return result
    }
  }
}

module.exports = {
  dynamicRequireToImport
}