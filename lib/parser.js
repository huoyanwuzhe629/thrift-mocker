'use strict';

var fs = require('fs');
var thriftParser = require('thrift-parser');
var path = require('path');

module.exports = function parser(file) {
  var buffer = fs.readFileSync(file, { encoding: "utf-8" });
  var ast = thriftParser(buffer);
  if (ast.include) {
    Object.keys(ast.include).map(function (key) {
      // var buffer = fs.readFileSync(ast.include[key].path, { encoding: "utf-8" });
      //以后可能会专门定个文件夹位置
      var extendAst = parser('./test/' + ast.include[key].path);
      ast.include[key].ast = extendAst;
    });
  }
  return ast;
};