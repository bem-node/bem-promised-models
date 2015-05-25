/**
 * browserify promised-models
 */
var browserify = require('browserify'),
    literalify = require('literalify'),
    fs = require('fs'),
    b = browserify();

b.add(require.resolve('promised-models'));
b.add(require.resolve('./promised-models'));
b.transform(literalify.configure({
    vow: 'window.Vow',
    inherit: 'window.$.inherit'
}));
b.bundle().pipe(fs.createWriteStream(__dirname + '/../blocks/promised-models/promised-models.js'));
