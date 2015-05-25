/**
 * This script should be set up to run every minute
 */
'use strict';

var debug = require('debug')('rb-matcher');
var pluck = require('lodash.pluck');
var config = require('../src/config');
var getRbInfo = require('../src/util/get-ratebeer-info');
var client = require('../src/client')();
var extend = require('lodash.assign');
var indexProduct = require('../src/util/index-product');

client.search({
    index: config.elasticsearch.index,
    type: 'products',
    body: require('../src/queries/expired-ratebeer-ratings')
}, function(err, result) {
    if (err) {
        throw err;
    }

    pluck(result.hits.hits, '_source')
        .forEach(fetchAndPopulate);
});

function fetchAndPopulate(beer) {
    debug('Fetching info for ' + beer.title);
    getRbInfo(beer, function(err, result) {
        if (err) {
            /* eslint no-console: 0 */
            return console.error(err);
        }

        debug('Got info for ' + beer.title, result);
        indexProduct(extend(beer, result));
    });
}
