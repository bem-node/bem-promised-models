/**
 * test server code
 */
BEM.decl({name: 'test-server'}, null, {

    /**
     * run server test
     * @param  {string} name of test
     * @return {Promise}
     */
    test: function () {
        return this.invoke('test', arguments);
    }
});
