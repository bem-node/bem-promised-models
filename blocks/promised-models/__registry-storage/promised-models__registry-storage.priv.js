/**
 * Storage for registry
 */

(function (Model) {

    Model._state = BEM.blocks['i-state'].initNs('promised-models');

    /**
     * get storage for model instances
     * @override
     * @return {Array} [description]
     */
    Model.getList = function () {
        if (!Model._state.get()) {
            Model._state.set('list', []);
        }
        return Model._state.get().list;
    };
}(BEM.Model));
