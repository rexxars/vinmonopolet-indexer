'use strict';

var config = require('../config');
var client = require('../client')();

module.exports = function(product, callback) {
    client.index({
        index: config.elasticsearch.index,
        type: 'products',
        id: product.sku,
        body: product
    }, callback || logError);
};

function logError(err) {
    if (!err) {
        return;
    }

    /* eslint no-console: 0 */
    console.error('Error indexing product: ', err);
}
