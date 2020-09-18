//导入 fs path 这里是node.js 所以只能用require。
const fs = require("fs"),
  path = require("path"),
  //入口文件夹路径
  entriesDirPath = "./src/entries";
//导入设置多页面，最终达到动态设置多页面，不需要在选项中直接写死。
//directoryPath是获取的文件路径
const setPages = directoryPath => {
  //同步读取文件的路径
  let items = fs.readdirSync(directoryPath);
  // console.log(directoryPath);
  //要判断是否文件夹为空，通过数组长度来判断
  if (items.length) {
    //循环这个数组
    items.forEach(item => {
      let itemPath = path.join(directoryPath, item),
        stat = fs.statSync(itemPath);
      if (exculed.indexOf(itemPath) > -1) {
        return;
      }
      if (stat.isDirectory()) {
        setPages(itemPath);
      } else if (stat.isFile() && /\.js$/.test(item)) {
        let relativePath = path.relative(entriesDirPath, itemPath),
          key = relativePath.replace(".js", "").replace(/\//g, "-");

        pages[key] = {
          entry: itemPath,
          filename: relativePath.replace(".js", ".html")
        };
      }
    });
  }
};
let pages = {},
  //下面是是否禁止多入口文件的中某些文件不上传
  // process.env.获取env中别名的方法
  exculed = process.env.VUE_APP_EXCLUED_ENTRIES;
//下面是去掉env中获取内容的间隔"，"
exculed = exculed ? exculed.split(",") : [];
//循环禁止运行文件的名称，且将入口文件夹路径与禁止文件名的数组这两者连接生成路径
exculed = exculed.map(item => {
  return path.join(entriesDirPath, item);
});

//初始化该路径导入方法
setPages(entriesDirPath);

//下面是配置的选项
module.exports = {
  pages
};
