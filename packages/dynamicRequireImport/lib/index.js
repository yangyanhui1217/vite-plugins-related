const { transformCode } = require('./transform')

/**
 * filters RegExp
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