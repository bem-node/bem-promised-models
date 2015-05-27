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
            this.__base.apply(this, arguments);
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
        var baseClass = DeclarativeModel;
        if (typeof baseBlock !== 'string') {
            staticProps = props;
            props = baseBlock;
            baseBlock = null;
        }
        if (BEM.blocks[blockName]) {
            baseClass = BEM.blocks[blockName];
        } else if (baseBlock) {
            baseClass = BEM.blocks[baseBlock];
        }

        BEM.blocks[blockName] = baseClass.inherit(props, staticProps).inherit({
            attributes: jQuery.extend({}, baseClass.prototype.attributes || {}, props.attributes)
        });

        /**
         * create model instance
         * @param  {string|number} [id]
         * @param  {object} [data]
         * @return {BEM.Model}
         */
        BEM.blocks[blockName].create = function (id, data) {
            if (arguments.length === 1) {
                return new BEM.blocks[blockName](id);
            } else {
                return new BEM.blocks[blockName](id, data);
            }
        };
    };
}(BEM.Model));
