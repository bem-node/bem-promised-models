/**
 * browserify promised-models
 */
var browserify = require('browserify'),
    literalify = require('literalify'),
    fs = require('fs'),
    b = browserify();

b.add(require.resolve('promised-models2'));
b.add(require.resolve('../blocks/promised-models/__model/promised-models__model.priv.js'));
b.transform(literalify.configure({
    vow: 'window.Vow',
    inherit: 'window.$.inherit'
}));
b.bundle().pipe(fs.createWriteStream(__dirname + '/../blocks/promised-models/__model/promised-models__model.js'));
