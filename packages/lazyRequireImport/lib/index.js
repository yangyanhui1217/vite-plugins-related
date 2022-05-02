const { transformCode } = require('./transform')

/**
 * 将require懒加载转换为import懒加载
 * includes 需要替换的文件后缀名数组
 * @returns
 */
const lazyRequireImport = (filters = /(.js|.jsx)$/) => {
  return {
    name: 'lazyRequireImport',
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
  lazyRequireImport
}