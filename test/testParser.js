/*
* @Author: xiongsheng
* @Date:   2017-07-25 16:16:52
* @Last Modified by:   huoyanwuzhe629
* @Last Modified time: 2017-07-25 20:04:22
*/

'use strict';
var parser = require('../lib/parser');
var path = require('path');
var ast = parser(path.resolve(__dirname, './tutorial.thrift'));
console.log(ast)
