'use strict';

var debug = require('debug')('rb-matcher');
var rb = require('./ratebeer-scraper');
var config = require('../config');
var Bing = require('bing.search');
var slug = require('slug');
var url = require('url');

var bing = new Bing(config.bing.apiKey);
var rbBeerUrlRegex = /\/beer\/.*?\/(\d+)/;

module.exports = function(beer, callback) {
    if (beer.rateBeerId) {
        debug('[' + (beer.title || beer.sku) + '] Ratebeer ID already present, fetching page directly');
        return getRatingsForBeer(beer, callback);
    }

    searchRateBeerForBeer(beer, callback);
};

module.exports.search = searchRateBeerForBeer;

function getRatingsForBeer(beer, callback) {
    var beerUrl = beer.url || ('/beer/' + slug(beer.title) + '/' + beer.rateBeerId);
    rb.beerPage(beerUrl, callback);
}

function searchRateBeerForBeer(beer, callback) {
    rb.beerSearch(beer.title, function(err, beers) {
        if (err) {
            return callback(err);
        }

        if (!beers.length || !beers[0].name || !beers[0].url) {
            debug('[' + beer.title + '] No result from searching ratebeer, trying bing');
            return searchBingForBeer(beer, callback);
        }

        debug('[' + beer.title + '] Found ratebeer page from ratebeer search, grabbing info');
        getRatingsForBeer({ url: beers[0].url }, callback);
    });
}

function searchBingForBeer(beer, callback) {
    bing.web(beer.title + ' ratebeer', { top: 3 }, function(err, links) {
        if (err) {
            return callback(err);
        }

        var matches = links.filter(function(link) {
            return link.url.match(rbBeerUrlRegex);
        });

        if (matches.length) {
            var beerUrl = url.parse(matches[0].url, false, true);
            return getRatingsForBeer({ url: beerUrl.pathname }, callback);
        }

        callback(new Error('[' + beer.title + '] No ratebeer link found on Bing'));
    });
}
