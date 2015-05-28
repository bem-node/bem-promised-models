/**
 * Storage for registry
 */

(function (Model) {

    var list = [];

    /**
     * get storage for model instances
     * @override
     * @return {Array}
     */
    Model.getList = function () {
        return list;
    };
}(BEM.Model));
