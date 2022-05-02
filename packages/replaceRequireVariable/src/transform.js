const parser = require("@babel/parser")
const traverse = require("@babel/traverse")
const t = require("@babel/types")
const babel = require("@babel/core")
const path = require("path")
const glob = require("glob")
// import * as parser from "@babel/parser"
// import * as traverse  from "@babel/traverse"
// import * as t from "@babel/types"
// import * as babel from "@babel/core"
// import path from "path"
// import glob from "glob"
// import fs from 'fs'

const fileObj = `_$_file_obj_${randomString(6)}`
const transformCode = (code, id) => {
	const ast = parser.parse(code, { sourceType: 'module' })
	let importNodeList = []
	let objNodes = null

	traverse.default(ast, {
		enter(path) {
			// Determine if it is a requirement function
			if (t.isCallExpression(path.node) && path.node.callee.name === 'require') {
				// get require function params
				const requireArgs = path.node.arguments[0]

				let relatedPath = ''
				let suffix = ''
				if (t.isMemberExpression(requireArgs)) {
					// get 'require("../../assets/img/icon_".concat(_vm.fileType, ".png"))' relative path
					relatedPath = requireArgs.callee.object.value
					// get the file suffix
					suffix = requireArgs.arguments[1].value
				} else if (t.isBinaryExpression(requireArgs)) {
					// get 'require("../../assets/img/icon_" + _vm.fileType + ".png")' relative path
					relatedPath = requireArgs.left.left.value
					// get the file suffix
					suffix = requireArgs.right.value
				} else if (t.isTemplateLiteral(requireArgs)) {
          // get 'require(`../../assets/img/icon_${_vm.fileType}.png`)' relative path
          relatedPath = requireArgs.quasis[0].value.raw
          // get the file suffix
          suffix = requireArgs.quasis[requireArgs.quasis.length - 1].value.raw
        }
				// generate ../../assets/img/**/*
				const lastIndex = relatedPath.lastIndexOf('/')
				let allFilePath = insertStr(relatedPath, lastIndex + 1, '**/')
				allFilePath += '*' + suffix
				// get generate import ... from ... code
				const { importNodes, objNode } = getImportCode(allFilePath, id)
				importNodeList = importNodes
				objNodes = objNode
				// replace varible
        if (objNodes)
				  path.replaceWith(t.memberExpression(t.identifier(fileObj), requireArgs, true))
			}
		},
		exit(path) {
			// Write the generated code
			if(t.isVariableDeclaration(path.node) && path.node.declarations[0].id.name === 'render') {
				path.insertBefore(importNodeList)
				path.insertBefore(objNodes)
			}
		}
	})

	const result = babel.transformFromAst(ast)
	// fs.writeFileSync('file.js', result.code)
	return result.code
}

/**
 * get generate import ... from ... code
 * @param {*} allFilePath
 * @param {*} id file path
 * @returns importNodes and objNode
 */
function getImportCode(allFilePath, id) {
	// get the last / position
	const idLastIndex = id.lastIndexOf('/')
	// get fullpath according last /
	const absoluteDir = id.substr(0, idLastIndex + 1)
	// get fullpath according absolute path and relative path
	// eg: /mnt/c/Users/yangyanhui/projects/huiyan-manage-static/src/assets/img/**/icon_*.png
	const readAbsoluteDir = path.join(absoluteDir, allFilePath)
	// get all files of types
	const allFiles = glob.sync(readAbsoluteDir)
	let importNodes = []
	let objNode = null
	if (allFiles.length) {
		const properyNodes = []
		allFiles.forEach((file) => {
			// get ref relative path
			const relativePath = path.relative(absoluteDir, file)
			const tempFile = `_$_img_${randomString(6)}`
			// generate key: value
			properyNodes.push(t.objectProperty(t.stringLiteral(relativePath), t.identifier(tempFile)))
			// generate import ... from
			importNodes.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier(tempFile))], t.stringLiteral(file)))
		})
		// generate custom varible
		objNode = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(fileObj), t.objectExpression(properyNodes))])
	}
	return { importNodes, objNode }
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

function insertStr(source, start, newStr) {
  return source.slice(0, start) + newStr + source.slice(start)
}

module.exports = {
  transformCode
}