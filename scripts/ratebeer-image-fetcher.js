'use strict';

var got = require('got');
var crypto = require('crypto');
var debug = require('debug')('rb-matcher');
var pluck = require('lodash.pluck');
var config = require('../src/config');
var client = require('../src/client')();
var imbo = require('../src/imbo-client')();
var extend = require('lodash.assign');
var indexProduct = require('../src/util/index-product');

client.search({
    index: config.elasticsearch.index,
    type: 'products',
    body: require('../src/queries/expired-images')
}, function(err, result) {
    if (err) {
        throw err;
    }

    pluck(result.hits.hits, '_source')
        .forEach(fetchAndPopulate);
});

function fetchAndPopulate(beer) {
    debug('Fetching image for ' + beer.title);
    fetchAndAddImageToImbo(beer, function(err, identifier) {
        if (err) {
            /* eslint no-console: 0 */
            return console.error(err);
        }

        debug('Added image for ' + beer.title, identifier);
        indexProduct(extend(beer, {
            imageIdentifier: identifier,
            imageLastFetched: (new Date()).toISOString()
        }));
    });
}

function fetchAndAddImageToImbo(beer, callback) {
    var imageUrl = getImageUrl(beer.rateBeerId);

    got(imageUrl, function(err, data) {
        if (err) {
            return callback(err);
        }

        if (md5(data) === 'a9ddb268994507da47fd53c83f9e59ba') {
            debug('Image for ' + beer.title + ' was the ratebeer 404 image');
            return callback(null, null);
        }

        imbo.addImageFromUrl(imageUrl, callback);
    });
}

function getImageUrl(beerId) {
    var url = 'http://res.cloudinary.com/ratebeer/image/upload/';
    url += 'w_1024,c_limit,q_85,d_beer_def.gif/beer_' + beerId + '.jpg';

    return url;
}

function md5(buffer) {
    return (crypto
        .createHash('md5')
        .update(buffer)
        .digest('hex')
    );
}
