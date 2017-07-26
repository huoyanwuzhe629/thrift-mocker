/*
* @Author: xiongsheng
* @Date:   2017-07-25 16:16:52
* @Last Modified by:   xiongsheng
* @Last Modified time: 2017-07-26 10:47:34
*/

'use strict';
var parser = require('../lib/parser');
var path = require('path');
var ast = parser(path.resolve(__dirname, './tutorial.thrift'));
console.log(ast)
