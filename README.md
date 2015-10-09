bem-promised-models [![Build Status](https://travis-ci.org/bem-node/bem-promised-models.svg?branch=master)](https://travis-ci.org/bem-node/bem-promised-models)

BEM wrapper for [promised-models2](https://github.com/bem-node/promised-models)

## Key features

* support for [BEM](https://en.bem.info) and [bem-node](https://github.com/bem-node/bem-node)
* promise based ([Vow Promises](https://github.com/dfilatov/vow))
* typed attributes
* nested models and collections
* async calculations and validation
* can be used in `priv.js` with bem-node's `i-state`

## Install

    $ npm install --save bem-promised-models

Add `node_modules/bem-promised-models/blocks` to your levels lists

Add deps for promised-models

```
({
    mustDeps: [
        {block: 'promised-models', elems: ['model', 'registry', 'registry-storage']}
    ]
})
```

For noBEM setups use [promised-models2](https://github.com/bem-node/promised-models)

## Usage

```
BEM.Model.decl('fashion-model', {
    attributes: {
        name: {
            type: 'String'
        }
    }
});

var model = BEM.blocks['fashion-model'].create({
    name: 'Kate'
});

model.get('name'); //Kate
```

### Extend

Add declaration for existent one:

```
BEM.Model.decl('fashion-model', {
    attributes: {
        sename: {
            type: 'String'
        }
    },

    getFullName: function () {
        return [this.get('name') + this.get('sename')].join(' ');
    }
});

var model = BEM.blocks['fashion-model'].create({
    name: 'Kate',
    sename: 'Moss'
});

model.getFullName(); //Kate Moss
```

Inherit:

```
BEM.Model.decl('uppercased-model', 'fashion-model', {
    getFullName: function () {
        return this.__base().toUpperCase();
    }
});
```

### Nested models and collections

```
BEM.Model.decl('podium', {
    attributes: {

        //nested
        currentModel: {
            type: 'Model',
            modelType: 'fashion-model'
        },

        //collections
        avaibleModels: {
            type: 'ModelsList',
            modelType: 'fashion-model'
        }
    }
});
```

### Pass models by client id (for browser render only)

```
//bh template
var model = BEM.blocks['fashion-model'].create();
ctx.content({
    block: 'view',
    js: {
        modelId: model.cid
    }
});

//BEM.DOM declaration
var model = BEM.blocks['fashion-model'].getOne(this.params.modelId);
```

### Find models by storage id

```
var model = BEM.blocks['fashion-model'].getAny(this.params.mongoId);

//load data from storage
model.fetch().done();
```

### Define storage

```
BEM.Model.decl('fashion-model', {
   storage: {
        insert: function (model) {
            //...
        },

        update: function (model) {
            //...
        },

        find: function (model) {
            //...
        },

        remove: function (model) {
            //...
        }
   }
});
```

## API

### BEM.Model

#### `.decl(modelName, [baseModel], [properties], [staticProperties])`

Add model declaration

#### `.getOne([cid])`

Get model instance by client id `model.cid`

### BEM.blocks['some-model']

#### `.create([id], [data])`

Create model instance with storage id and data

#### `.getOne([cid])`

Get model instance of current class by client id `model.cid`

#### `.getAny([id])`

Get model instance by storage id `model.id`. If no instance with `id` was found, create new one.


### model instance

See [promised-models2](https://github.com/bem-node/promised-models/blob/master/README.md#api-reference-in-progress)







