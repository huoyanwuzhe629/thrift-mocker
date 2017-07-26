import assert from 'assert';
import should from 'should';
import ThriftMocker from '../lib/';
import path from 'path';
import { extend } from '../lib/utils/helper';
import ttypes from '../gen-nodejs/tutorial_types';


let thriftMocker;
let work;

describe('Your tests go here!', function() {

    beforeEach(function() {
        thriftMocker = new ThriftMocker({
            service: path.resolve(__dirname, './tutorial.thrift'),
            models: [ttypes.Work, ttypes.InvalidOperation],
            strictMode: true,
            serviceName: "Calculator",
            thriftPath: './test/'
        });
        work = new ttypes.Work();
        work.op = ttypes.Operation.DIVIDE;
        work.num1 = 1;
        work.num2 = 0;
    });

    // it('check type is ok', function(done) {
    //     thriftMocker.exec('Reserved argument', 'calculate', 1, work)
    //         .then(result => {
    //             should(result).be.a.Number();
    //             done();
    //         }).catch(e => {
    //             assert(false, 'type is not ok!');
    //             done();
    //         });
    // });

    // it('check extends is ok', function(done) {
    //     try {
    //         thriftMocker.exec('anything', 'getStruct', 1).then(result => {
    //             should(result).be.a.Object();
    //             should(result.key).be.a.Number();
    //             should(result.value).be.a.String();
    //             done();
    //         });
    //     }catch(e){
    //         assert(false, 'can not get extend function');
    //         done();
    //     }
    // })

    it('check exception is ok', function(done) {
        try {
            thriftMocker.exec('exception', 'calculate', 1, work).then(result => {
                should(result).be.a.Object();
                should(result.whatOp).be.a.Number();
                should(result.why).be.a.String();
                done();
            })
        }catch(e){
            assert(false, 'exception is not ok!');
            done();
        };
    })

    // it('check i64 is ok', function(done) {
    //   try {
    //     thriftMocker.exec('Reserved argument', 'calculate', '43', work);
    //   }catch(e){
    //     assert(e instanceof TypeError, 'not TypeError, error happened');
    //     done();
    //   }
    // });

    // it('test case 2', function() {
    //   assert(extend({}, {a:1}).a === 1);
    // });
});