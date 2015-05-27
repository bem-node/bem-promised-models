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
                delete BEM.blocks['model'];
                delete BEM.blocks['extended-model'];
                delete BEM.blocks['other-model'];
                BEM.Model.decl('model', {
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
                BEM.Model.decl('other-model', 'model');
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
                    var model = BEM.blocks['model'].create({
                        a: {
                            a: 'a-0'
                        },
                        nested: {
                            a: 'a-1'
                        }
                    });
                    expect(model.get('nested').get('a')).to.be.equal('a-1');
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
                        model2 = BEM.blocks['other-model'].create();
                    expect(BEM.blocks['model'].getOne()).to.be.equal(model1);
                    expect(BEM.blocks['other-model'].getOne()).to.be.equal(model2);
                });
                it('should return model by cid', function () {
                    var model1 = BEM.blocks['model'].create(),
                        model2 = BEM.blocks['other-model'].create(),
                        model3 = BEM.blocks['other-model'].create();
                    expect(BEM.Model.getOne(model1.cid)).to.be.equal(model1);
                    expect(BEM.Model.getOne(model2.cid)).to.be.equal(model2);
                    expect(BEM.Model.getOne(model3.cid)).to.be.equal(model3);
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
                it('should be able to declare via Model.decl', function () {
                    var id = jQuery.identify();
                    BEM.Model.decl('model', {
                        storage: {
                            insert: function () {
                                return id;
                            }
                        }
                    });
                    var model = BEM.blocks['model'].create();
                    return model.save().then(function () {
                        expect(model.id).to.be.equal(id);
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
