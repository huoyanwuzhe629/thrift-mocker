import parser from "./parser";
import typecheck from "./typecheck";
import generate from "./generate-data";

const fs = require('fs');

let cache = {};

export default function(options) {
    if (!options || typeof options !== 'object') {
        throw new Error("Argument required!");
    }
    if (!options.service) {
        throw new Error("Thrift service file is required!");
    }
    if (!fs.existsSync(options.service)) {
        throw new Error("Thrift service file not found, please check!");
    }
    //继承的thrift文件位置
    const ast = parser(options.service, options.thriftPath);
    const services = Object.keys(ast.service);
    if (services && services.length > 1 && !options.serviceName) {
        throw new Error("Service file should only contains one service! please check!");
    }
    options.models = Array.isArray(options.models) ? options.models : [options.models];
    const service = options.serviceName ? ast.service[options.serviceName] : ast.service[services[0]];

    return {
        exec(responseType, methodName, ...args) {
            let method = service.functions[methodName];
            let methodAst = ast;
            if (!method) {
                if (service.extends) {
                    const extendList = service.extends.split('.');
                    methodAst = ast.include[extendList[0]].ast;
                    method = methodAst.service[extendList[1]].functions[methodName];
                } else {
                    throw new Error(methodName + " not found in Service! please check!");
                }
            }
            if (args.length !== method.args.length) {
                throw new Error("Arguments length not match! expect " + method.args.length + " and received " + args.length + "!");
            }
            typecheck(args, method.args, options.models, !!options.strictMode);
            return new Promise((resolve, reject) => {
                try {
                    //异常的时候，抛异常的类型
                    const type = responseType == 'exception' ? method.throws[0].type : method.type;
                    const data = generate(type, methodAst, {
                        mockData: options.mockData && options.mockData[methodName] || {},
                        commonData: options.commonData,
                        boundary: options.boundary,
                        responseType
                    });
                    if (options.cache) {
                        const cacheKey = methodName + JSON.stringify(args);
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
        getAst() {
            return ast;
        }
    }
}