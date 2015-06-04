/**
 * test page
 */

/* global mocha */
/* global mochaPhantomJS */
/* global chai */
/* global describe */
/* global Vow */

BN.addDecl('test', 'page', {
    route: /^\/$/
}).staticProp({
    /**
     * @override
     */
    init: function () {
        return this.out({
            block: 'test',
            js: true
        });
    },

    /**
     * @override
     */
    update: function () {
        return Vow.reject();
    }

}).instanceProp({

    /**
     * @override
     */
    init: function () {
        var expect = chai.expect;
        mocha.ui('bdd');
        mocha.reporter('html');
        this.test(expect);

        if ( window.mochaPhantomJS ) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    },

    /**
     * decl tests
     * @param  {Chai.expect} expect
     */
    test: function (expect) {
        describe('BEM.Model', function () {
            beforeEach(function () {
                BEM.Model.decl('model', {
                    attributes: {
                        a: {
                            type: 'String',
                            default: 'a'
                        }
                    }
                });
                BEM.Model.decl('other-model', {
                    attributes: {
                        a: {
                            type: 'String',
                            default: 'a'
                        }
                    }
                });
                BEM.Model.decl('nested-model', {
                    attributes: {
                        a: {
                            type: 'String',
                            default: 'a-0'
                        }
                    }
                });
                BEM.Model.decl('inerited-model', 'model');
            });
            afterEach(function () {
                BEM.Model.getList().slice(0).forEach(function (model) {
                    model.destruct();
                });
                delete BEM.blocks['model'];
                delete BEM.blocks['extended-model'];
                delete BEM.blocks['inerited-model'];
                delete BEM.blocks['other-model'];

            });
            describe('decl', function () {
                it('should add model class to BEM.blocks', function () {
                    expect(BEM.blocks['model']).to.be.not.a('undefined');
                });

                it('should extend model fields and methods in case of multiple decls', function () {
                    BEM.Model.decl('model', {
                        attributes: {
                            b: {
                                type: 'String',
                                default: 'b'
                            }
                        }
                    });
                    var model = BEM.blocks['model'].create();
                    expect(model.get('a')).to.be.equal('a');
                    expect(model.get('b')).to.be.equal('b');
                });

                it('should decl extend from base model', function () {
                    BEM.Model.decl('extended-model', 'model', {
                        attributes: {
                            b: {
                                type:'String',
                                default: 'b'
                            }
                        }
                    });
                    var model1 = BEM.blocks['model'].create(),
                        model2 = BEM.blocks['extended-model'].create();
                    expect(model1.get('a')).to.be.equal('a');
                    expect(model2.get('a')).to.be.equal('a');
                    expect(model2.get('b')).to.be.equal('b');
                    expect(function () {
                        model1.get('b');
                    }).throw(Error);
                });

                it('should decl nested models', function () {
                    BEM.Model.decl('model', {
                        attributes: {
                            nested: {
                                type: 'Model',
                                modelType: 'nested-model'
                            }
                        }
                    });
                    var data = {
                            a: {
                                a: 'a-0'
                            },
                            nested: {
                                a: 'a-1'
                            }
                        },
                        model1 = BEM.blocks['model'].create(data),
                        model2 = BEM.blocks['model'].create(data);
                    expect(model1.get('nested').get('a')).to.be.equal('a-1');
                    expect(model2.get('nested').get('a')).to.be.equal('a-1');
                });

                it('should throw error when modelType is unknown', function () {
                    BEM.Model.decl('model', {
                        attributes: {
                            nested: {
                                type: 'Model',
                                modelType: 'unknown-model'
                            }
                        }
                    });
                    var model;
                    expect(function () {
                        model = BEM.blocks['model'].create();
                    }).to.throw(/unknown attribute/i);
                });

                it('should decl collections', function () {
                    BEM.Model.decl('model', {
                        attributes: {
                            collection: {
                                type: 'ModelsList',
                                modelType: 'nested-model'
                            }
                        }
                    });
                    var model = BEM.blocks['model'].create({
                        collection: [{a: 'a-1'}]
                    });
                    expect(model.get('collection').get(0).get('a')).to.be.equal('a-1');
                });

                describe('model', function () {
                    it('should be instanceof BEM.Model', function () {
                        expect(BEM.blocks['model'].prototype instanceof BEM.Model).to.be.equal(true);
                    });
                });
            });
            describe('create', function () {
                it('should create model instance', function () {
                    expect(BN('model').create() instanceof BEM.Model).to.be.equal(true);
                });
                it('should init model with data', function () {
                    var model = BN('model').create({
                        a: 'a1'
                    });
                    expect(model.get('a')).to.be.equal('a1');
                });
            });

            describe('getOne', function () {
                it('should return first instance of model of current type', function () {
                    var model1 = BEM.blocks['model'].create(),
                        model2 = BEM.blocks['inerited-model'].create();
                    expect(BEM.blocks['model'].getOne()).to.be.equal(model1);
                    expect(BEM.blocks['inerited-model'].getOne()).to.be.equal(model2);
                });
                it('should return model by cid', function () {
                    var model1 = BEM.blocks['model'].create(),
                        model2 = BEM.blocks['inerited-model'].create(),
                        model3 = BEM.blocks['inerited-model'].create();
                    expect(BEM.Model.getOne(model1.cid)).to.be.equal(model1);
                    expect(BEM.Model.getOne(model2.cid)).to.be.equal(model2);
                    expect(BEM.Model.getOne(model3.cid)).to.be.equal(model3);
                });
                it('should get from storage nested models', function () {
                    BEM.Model.decl('model', {
                        attributes: {
                            collection: {
                                type: 'ModelsList',
                                modelType: 'nested-model'
                            }
                        }
                    });
                    var model = BEM.blocks['model'].create({
                        collection: [{a: 'a-2'}]
                    }),
                    nested = model.get('collection').get(0);
                    expect(BEM.blocks['nested-model'].getOne(nested.cid)).to.be.equal(nested);
                });
            });

            describe('destruct', function () {
                it('should remove model from registry', function () {
                    var model1 = BEM.blocks['model'].create(),
                        model2 = BEM.blocks['model'].create();
                    model1.destruct();
                    expect(BEM.Model.getOne(model1.cid)).to.be.a('undefined');
                    expect(BEM.Model.getOne(model2.cid)).to.be.equal(model2);
                });
            });

            describe('storage', function () {
                var id = jQuery.identify();
                beforeEach(function () {
                    BEM.Model.decl('model', {
                        storage: {
                            insert: function () {
                                return id;
                            }
                        }
                    });
                });
                it('should be able to declare via Model.decl', function () {
                    var model = BEM.blocks['model'].create();
                    return model.save().then(function () {
                        expect(model.id).to.be.equal(id);
                    });
                });
                it('should be inherited from prev decls', function () {
                    BEM.Model.decl('model', {
                        storage: {
                            insert: function () {
                                return this.__base() + id;
                            }
                        }
                    });
                    var model = BEM.blocks['model'].create();
                    return model.save().then(function () {
                        expect(model.id).to.be.equal(id + id);
                    });
                });
            });

            describe('getAny', function () {
                var id1 = jQuery.identify(),
                    id2 = jQuery.identify();
                it('should return instance of model', function () {
                    var model1 = BEM.blocks['model'].getAny();
                    expect(model1).to.be.instanceof(BEM.blocks['model']);
                });
                it('should create instance of model if no instance avaiable', function () {
                    var model1 = BEM.blocks['model'].getAny(),
                        model2 = BEM.blocks['model'].getAny();
                    expect(model1).to.be.equal(model2);
                });
                it('should get instance storage id or create with this id', function () {
                    var model1 = BEM.blocks['model'].getAny(id1),
                        model2 = BEM.blocks['model'].getAny(id2),
                        model11 = BEM.blocks['model'].getAny(id1),
                        model22 = BEM.blocks['model'].getAny(id2);

                    expect(model1).to.be.equal(model11);
                    expect(model2).to.be.equal(model22);
                    expect(model1).to.be.not.equal(model2);
                });
                it('should return instance of give class', function () {
                    var model1 = BEM.blocks['model'].getAny(id1),
                        model2 = BEM.blocks['other-model'].getAny(id1);
                    expect(model1).to.be.not.equal(model2);
                });
            });

            describe('server storage', function () {
                var name;
                it(name = 'should store models for request separatly', function () {
                    return BEM.blocks['test-server'].test(name).then(function () {
                        BEM.blocks['test-server'].test(name);
                    });
                });
            });

        });
    }
}).blockTemplate(function (ctx) {
    BN('i-page').addToHead([
        '<script src="/node_modules/mocha/mocha.js"></script>',
        '<link rel="stylesheet" href="/node_modules/mocha/mocha.css"/>',
        '<script src="/node_modules/chai/chai.js"></script>',
    ]);
    ctx.content('<div id="mocha"></div>');
});
