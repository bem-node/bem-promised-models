/**
 * Promised-models BEM registry
 */

(function (Model) {

    /**
     * model with declarative format for attributes
     * @class {Model}
     */
    var DeclarativeModel = Model.inherit({

        /**
         * @override
         */
        __constructor: function () {
            var model = this;
            this.attributes = Object.keys(this.attributes || {}).reduce(function (attributes, attributeName) {
                var attributeDecl = model.attributes[attributeName],
                    type = attributeDecl.type,
                    modelType = attributeDecl.modelType,
                    attributeClass;
                if (attributeDecl instanceof Model.Attribute) {
                    //class
                    attributeClass = attributeDecl;
                } else if (type === 'Model' || type === 'ModelsList') {
                    //nested type
                    attributeDecl.modelType = Model.attributeTypes[modelType] || BEM.blocks[modelType];
                    attributeClass = Model.attributeTypes[type].inherit(attributeDecl);
                } else if (Model.attributeTypes[type]) {
                    //common types
                    attributeClass = Model.attributeTypes[type].inherit(attributeDecl);
                } else if (BEM.blocks[type]) {
                    //custom type
                    attributeClass = BEM.blocks[type].inherit(attributeDecl);
                } else {
                    throw new Error('Unknown attribute type:' + type);
                }
                attributes[attributeName] = attributeClass;
                return attributes;
            }, {});
            this.cid = jQuery.identify();
            this.__base.apply(this, arguments);
        },

        /**
         * @override
         */
        destruct: function () {
            var list = Model.getList(),
                index = list.indexOf(this);
            if (index !== -1) {
                list.splice(index, 1);
            }
            this.__base.apply(this, arguments);
        },

    }, {
        /**
         * get model of current class
         * @param  {Model.cid} cid
         * @return {Model}
         */
        getOne: function (cid) {
            var modelClass = this;
            if (arguments.length === 0) {
                return Model.getList().filter(function (instance) {
                    return instance instanceof modelClass;
                })[0];
            } else {
                return Model.getOne(cid);
            }
        },

        /**
         * create model instance
         * @param  {string|number} [id]
         * @param  {object} [data]
         * @return {BEM.Model}
         */
        create: function (id, data) {
            var instance;
            if (arguments.length === 1) {
                instance =  new this(id);
            } else {
                instance =  new this(id, data);
            }
            Model.getList().push(instance);
            return instance;
        }
    });

    /**
     * decl model
     * @param  {string} blockName
     * @param  {string} [baseBlock]
     * @param  {Object} props
     * @param  {Object} [staticProps]
     */
    Model.decl = function (blockName, baseBlock, props, staticProps) {
        var baseClass,
            baseStorageClass;

        if (typeof baseBlock !== 'string') {
            staticProps = props;
            props = baseBlock;
            baseBlock = null;
        }

        props = props || {};

        if (BEM.blocks[blockName]) {
            baseClass = BEM.blocks[blockName];
        } else if (baseBlock) {
            baseClass = BEM.blocks[baseBlock];
        } else {
            baseClass = DeclarativeModel;
        }

        baseStorageClass = baseClass.prototype.storage || Model.Storage;

        if (props.storage && !(props.storage instanceof Model.Storage)) {
            props.storage = baseStorageClass.inherit(props.storage);
        }

        BEM.blocks[blockName] = baseClass.inherit(props, staticProps).inherit({
            blockName: blockName,
            attributes: jQuery.extend({}, baseClass.prototype.attributes || {}, props.attributes || {})
        });

    };

    /**
     * get model instance
     * @param  {Model.cid} cid
     * @return {Model}
     */
    Model.getOne = function (cid) {
        if (arguments.length === 0) {
            return this.getList()[0];
        } else {
            return this.getList().filter(function (instance) {
                return instance.cid === cid;
            })[0];
        }
    };

    /**
     * get storage for model instances
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
