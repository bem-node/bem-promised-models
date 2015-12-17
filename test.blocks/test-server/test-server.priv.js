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
                return Vow.promise(test()).then(function (res) {
                    return res || {};
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
        },

        'should end calculation': function () {
            var calcCount = 0;

            BEM.Model.decl('model', {
                attributes: {
                    id: {
                        type: 'Id'
                    },
                    a: {
                        type: 'String',
                        calculate: function () {
                            if (calcCount > 100) {
                                return undefined;
                            }

                            calcCount++;

                            return this.value;
                        },
                        default: 'a-default'
                    },

                    b: {
                        type: 'String',
                        calculate: function () {
                            return 'b-calculate';
                        }
                    }
                },

                storage: {
                    find: function () {
                        return Vow.fulfill().delay(0).then(function () {
                            return {
                                a: 'a-set',
                                b: 'b-set'
                            };
                        });
                    }
                }
            });

            var model = BEM.blocks['model'].create();
            return model.fetch().then(function () {
                expect(calcCount).to.be.lte(100);
                delete BEM.blocks['model'];
            });

        }
    }
});
