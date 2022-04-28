var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  __requireToImport: () => __requireToImport
});
module.exports = __toCommonJS(src_exports);
var __requireToImport = (includes = []) => {
  return {
    name: "__requireToImport",
    apply: "serve",
    transform(code, id) {
      let result = code;
      if (includes.some((item) => id.includes(item))) {
        if (!/\/node_modules\//g.test(id))
          return result;
        const requireRegex = /_{2}require*\(\s*(["'].*["'])\s*\)/g;
        const IMPORT_STRING_PREFIX = "__require_for_vite";
        const requireMatches = result.matchAll(requireRegex);
        let importsString = "";
        let packageName = "";
        let replaced = false;
        for (const item of requireMatches) {
          if (!isString(item[1])) {
            console.warn(`Not supported dynamic import, file:${id}`);
            continue;
          }
          replaced = true;
          packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`;
          importsString += `import ${packageName} from ${item[1]};
`;
          result = result.replace(item[0], `${packageName}`);
        }
        if (replaced) {
          result = importsString + result;
        }
      }
      return {
        code: result,
        map: null,
        warnings: null
      };
    }
  };
};
function randomString(length) {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let index = 0; index < length; index++) {
    result += code[Math.floor(Math.random() * code.length)];
  }
  return result;
}
function isString(text) {
  try {
    return typeof eval(text) === "string";
  } catch (err) {
    return false;
  }
}
