const path = require('path')
const glob = require('glob')

/**
 * 替换项目中包含变量的require函数
 * includes 需要替换的文件名
 * @returns
 */
const replaceRequireVariable = (includes = []) => {
  return {
    name: 'replaceRequireVariable',
    apply: 'serve',
    transform(code, id) {
      let result = code
      if (includes.some(item => id.includes(item))) {
        result = replace_require_variable(code, id)
      }
      return result
    }
  }
}

const replace_require_variable = function(code, id) {
  // node_modules排除
  if (/\/node_modules\//g.test(id)) return code

  const regex = /require\(\(\s*(["].*["])\s*\)\)/g
  const requireMatches = code.matchAll(regex)
  let importString = ''
  let constObjString = ''
  for (const item of requireMatches) {
    /**
     * item[0] 匹配出来的选项 例如：require(("../../assets/img/" + _vm.filePath + ".png"))
     * item[1] 匹配出来的路径 例如："../../assets/img/" + _vm.filePath + ".png"
     *  */
    const arr = item[1].split('+')
    // 组装获取文件夹下边文件的全部路径
    let allFilePath = ''
    arr.forEach((itemStr, index) => {
      // 去除”和多余的空格
      itemStr = itemStr.replace(/"/g, '').trim()
      if (index === 0) {
        const lastIndex = itemStr.lastIndexOf('/')
        allFilePath = insertStr(itemStr, lastIndex + 1, '**/')
      } else if (index === arr.length - 1 && itemStr.startsWith('.')) {
        allFilePath += itemStr
      } else {
        allFilePath += '*'
      }
    })
    // 获取最后一个/的位置
    const lastIndex = id.lastIndexOf('/')
    // 获取Id最后一个/之前的全路径
    const absoluteDir = id.substr(0, lastIndex + 1)
    // 根绝id的全路径和相对路径获取要去获取文件的全路径
    // /mnt/c/Users/yangyanhui/projects/huiyan-manage-static/src/assets/img/**/icon_*.png
    const readAbsoluteDir = path.join(absoluteDir, allFilePath)

    // 拿到所有的指定文件
    const allFile = glob.sync(readAbsoluteDir)
    const fileObj = `_$_file_obj_${randomString(6)}`
    let fileObjectStr = ''
    if (allFile.length) {
      // 拼接文件常量
      fileObjectStr = `const ${fileObj} = {`
      allFile.forEach((file, index) => {
        // 获取引入文件的相对路径
        const relativePath = path.relative(absoluteDir, file)
        const tempFile = `_$_img_${randomString(6)}`
        fileObjectStr += `'${relativePath}': ${tempFile},`
        if (index === allFile.length - 1) fileObjectStr += '}'

        importString += `import ${tempFile} from '${file}';\n`
      })

      constObjString += `${fileObjectStr};\n`
      // require(("../../assets/img/" + _vm.filePath + ".png")) 用 fileObj 对象替换
      code = code.replace(item[0], `${fileObj}[${item[1]}]`)
    }
  }

  code = importString + constObjString + code
  return code
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
	replaceRequireVariable
}