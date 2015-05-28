/**
 * test server code
 */
/* global Vow */
var expect = require('chai').expect;

BEM.decl({name: 'test-server'}, null, {

    /**
     * run server test
     * @param  {string} name
     * @return {Promise}
     */
    test: function (name) {
        var block = this,
            CommonError = BEM.blocks['i-errors'].CommonError;

        return Vow.fulfill().then(function () {
            var test = block.tests[name];
            if (test) {
                return Vow.promise(test()).then(function () {
                    return {};
                });
            } else {
                return Vow.reject(new CommonError('Unknown test'));
            }
        }).fail(function (err) {
            setTimeout(function () {
                throw err;
            });
            return Vow.reject(err);
        });
    },

    tests: {
        'should store models for request separatly': function () {
            BEM.Model.decl('model', {
                attributes: {
                    a: {
                        type: 'String',
                        default: 'a'
                    }
                }
            });
            expect(BEM.Model.getList().length).to.be.equal(0);
            var model = BEM.blocks['model'].create({
                a: 'a-1'
            });
            expect(model).to.be.instanceof(BEM.Model);
            expect(BEM.blocks['model'].getOne()).to.be.equal(model);
            delete BEM.blocks['model'];
        }
    }
});
