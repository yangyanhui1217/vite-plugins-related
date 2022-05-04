const parser = require("@babel/parser")
const traverse = require("@babel/traverse")
const t = require("@babel/types")
const babel = require("@babel/core")
// const fs = require('fs')

const IMPORT_STRING_PREFIX = '__require_for_vite'

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
				const requireArgs = path.node.arguments.length ? path.node.arguments[0] : null
				if (requireArgs) {
					let packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`
					// generate import ... from ...
					let importNode = t.importDeclaration([t.importDefaultSpecifier(t.identifier(packageName))], t.stringLiteral(requireArgs.value))
					if (importNode) {
						importNodeList.push(importNode)
						path.replaceWith(t.identifier(packageName))
					}
				}
			}
		},
		exit(path) {
			if (t.isProgram(path.node)) {
				importNodeList.forEach(node => {
					path.node.body.unshift(node)
				})
				importNodeList = []
			}
		}
	})

	const result = babel.transformFromAst(ast)
	// fs.writeFileSync('file.js', result.code)
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
