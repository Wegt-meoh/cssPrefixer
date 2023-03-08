const fs = require("node:fs");
const path = require("node:path");

/**
 *
 * @param {string} s
 */
function isAllWhiteSpace(s) {
  const white = /^\s*$/;
  return white.test(s);
}

/**
 *
 * @param {string} pre
 * @param {string} content
 * @returns
 */
function prefix(pre, content) {
  return content
    .split("}")
    .map((item) => {
      if (isAllWhiteSpace(item)) {
        return item;
      } else {
        const [blockName, blockContent] = item.split("{");
        let handledBlockName;
        if (blockName.includes("@")) {
          handledBlockName = blockName;
        } else {
          handledBlockName = blockName
            .split(",")
            .map((className) => {
              return pre + " " + className.trim();
            })
            .join(",");
        }

        return handledBlockName + "{" + blockContent.trim();
      }
    })
    .join("}");
}

function work(pre, filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const res = prefix(pre, content);
  const dirName = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const extName = path.extname(filePath);
  const outputPath = path.join(dirName, `${fileName}.output.${extName}`);

  fs.writeFileSync(outputPath, res);
}

module.exports = {
  work,
  isAllWhiteSpace,
};
