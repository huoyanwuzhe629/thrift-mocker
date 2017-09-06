"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (options) {
    if (!options || (typeof options === "undefined" ? "undefined" : _typeof(options)) !== 'object') {
        throw new Error("Argument required!");
    }
    if (!options.service) {
        throw new Error("Thrift service file is required!");
    }
    if (!fs.existsSync(options.service)) {
        throw new Error("Thrift service file not found, please check!");
    }
    //继承的thrift文件位置
    var ast = (0, _parser2.default)(options.service, options.thriftPath);
    var services = Object.keys(ast.service);
    if (services && services.length > 1 && !options.serviceName) {
        throw new Error("Service file should only contains one service! please check!");
    }
    options.models = Array.isArray(options.models) ? options.models : [options.models];
    var service = options.serviceName ? ast.service[options.serviceName] : ast.service[services[0]];

    return {
        exec: function exec(responseType, methodName) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            var method = service.functions[methodName];
            var methodAst = ast;
            if (!method) {
                if (service.extends) {
                    var extendList = service.extends.split('.');
                    methodAst = ast.include[extendList[0]].ast;
                    method = methodAst.service[extendList[1]].functions[methodName];
                } else {
                    throw new Error(methodName + " not found in Service! please check!");
                }
            }
            if (args.length !== method.args.length) {
                throw new Error("Arguments length not match! expect " + method.args.length + " and received " + args.length + "!");
            }
            (0, _typecheck2.default)(args, method.args, options.models, !!options.strictMode);
            return new Promise(function (resolve, reject) {
                try {
                    //异常的时候，抛异常的类型
                    var type = responseType == 'exception' ? method.throws[0].type : method.type;
                    var data = (0, _generateData2.default)(type, methodAst, {
                        mockData: options.mockData && options.mockData[methodName] || {},
                        commonData: options.commonData,
                        boundary: options.boundary,
                        responseType: responseType
                    });
                    if (options.cache) {
                        var cacheKey = methodName + JSON.stringify(args);
                        if (cache[cacheKey]) {
                            resolve(cache[cacheKey]);
                        } else {
                            cache[cacheKey] = data;
                        }
                    }
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            });
        },
        getAst: function getAst() {
            return ast;
        }
    };
};

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _typecheck = require("./typecheck");

var _typecheck2 = _interopRequireDefault(_typecheck);

var _generateData = require("./generate-data");

var _generateData2 = _interopRequireDefault(_generateData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

var cache = {};

module.exports = exports["default"];