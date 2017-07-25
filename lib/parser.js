'use strict';

var fs = require('fs');
var thriftParser = require('thrift-parser');

module.exports = function parser(file) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var buffer = fs.readFileSync(file, { encoding: "utf-8" });
  return thriftParser(buffer);
};