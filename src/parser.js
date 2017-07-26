'use strict';

var fs = require('fs');
var thriftParser = require('thrift-parser');
var path = require('path');

module.exports = function parser(file, thriftPath) {
    var buffer = fs.readFileSync(file, { encoding: "utf-8" });
    var ast = thriftParser(buffer);
    thriftPath = thriftPath || '';
    if (ast.include) {
        Object.keys(ast.include).map(key => {
            // var buffer = fs.readFileSync(ast.include[key].path, { encoding: "utf-8" });
            //以后可能会专门定个文件夹位置
            var extendAst = parser(`${thriftPath}${ast.include[key].path}`, thriftPath);
            ast.include[key].ast = extendAst;
        })
    }
    return ast;
}