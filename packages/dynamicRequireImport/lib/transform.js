const parser = require("@babel/parser")
const traverse = require("@babel/traverse")
const t = require("@babel/types")
const babel = require("@babel/core")

const transformCode = (code) => {
	const ast = parser.parse(code, { sourceType: 'module' })
	let needModify = false

	traverse.default(ast, {
		enter(path) {
			// record component Object
			if (t.isObjectProperty(path.node) && path.node.key.name === 'component') {
				needModify = true
			}

			if (needModify && t.isIdentifier(path.node) && path.node.name === 'resolve') {
				// remove resolve
				path.remove()
			}
			// Determine if it is a requirement function
			if (needModify && t.isCallExpression(path.node) && path.node.callee.name === 'require') {
				// get require function params
				const requireArgs = path.node.arguments ? path.node.arguments[0] : null
				if (requireArgs) {
					const relativePath = requireArgs.elements[0].value
					// generate import(".......")
					path.replaceWith(t.callExpression(t.import(), [t.stringLiteral(relativePath)]))
				}
				needModify = false
			}
		},
	})

	const result = babel.transformFromAst(ast)
	return result.code
}

module.exports = {
  transformCode
}