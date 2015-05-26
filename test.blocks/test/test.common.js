/**
 * test page
 */

/* global mocha */
/* global mochaPhantomJS */
/* global chai */
/* global describe */

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
    }
}).instanceProp({
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

    test: function (expect) {
        describe('model decl', function () {
            before(function () {
                BEM.Model.delc('model', {
                    attributes: {
                        a: {
                            type: 'string',
                            default: 'a'
                        }
                    }
                });
            });

            it('should add model class to BEM.blocks', function () {
                expect(BEM.blocks['model']).to.be.not.a('undefined');
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
