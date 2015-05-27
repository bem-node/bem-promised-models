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
                BEM.Model.decl('model', {
                    attributes: {
                        a: {
                            type: 'String',
                            default: 'a'
                        }
                    }
                });
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
