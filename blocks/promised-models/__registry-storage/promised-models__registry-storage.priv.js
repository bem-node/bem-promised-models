/**
 * Storage for registry
 */

(function (Model) {

    /**
     * get storage for model instances
     * @override
     * @return {Array} [description]
     */
    Model.getList = function () {
        if (!this._state) {
            this._state = BEM.blocks['i-state'].initNs('Promised-models');
            this._state.set('list', []);
        }
        return this._state.get().list;
    };
}(BEM.Model));
