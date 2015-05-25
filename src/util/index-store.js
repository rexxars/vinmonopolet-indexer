'use strict';

var crypto = require('crypto');
var config = require('../config');
var client = require('../client')();

module.exports = function(store, callback) {
    client.index({
        index: config.elasticsearch.index,
        type: 'stores',
        id: getId(store),
        body: store
    }, callback || logError);
};

function getId(store) {
    return (crypto
        .createHash('sha1')
        .update(store.name)
        .digest('hex')
    );
}

function logError(err) {
    if (!err) {
        return;
    }

    /* eslint no-console: 0 */
    console.error('Error indexing store: ', err);
}
