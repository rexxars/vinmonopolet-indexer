'use strict';

var qs = require('querystring');
var request = require('got');
var cheerio = require('cheerio');

var rbBeerUrlRegex = /\/beer\/.*?\/(\d+)/;
var ua = [
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ',
    '(KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36'
].join('');

exports.beerSearch = function(query, callback) {
    var formData = qs.stringify({ BeerName: query }, null, null, {
        encodeURIComponent: global.escape
    }).replace(/\%20/g, '+');

    request('http://www.ratebeer.com/findbeer.asp', {
        method: 'POST',
        body: formData,
        headers: {
            'user-agent': ua,
            'content-type': 'application/x-www-form-urlencoded'
        }
    }, function(err, html) {
        if (err) {
            return callback(err);
        }

        var $ = cheerio.load(html);
        var beers = [];

        $('table.results tr').each(function(index) {
            // Skip headers
            if (index === 0) {
                return;
            }

            var tr = $(this);

            // Beer details
            var beer = tr.find('a').first(),
                name = beer.text(),
                url = beer.attr('href');

            // Add to beer array
            beers.push({
                name: name,
                url: url
            });
        });

        callback(null, beers);
    });
};

exports.beerPage = function(url, callback) {
    if (url.indexOf('//ratebeer.com/') === -1) {
        url = 'http://ratebeer.com' + url;
    }

    var beerId = parseInt(url.match(rbBeerUrlRegex)[1], 10);
    var opts = { 'user-agent': ua };
    request(url, opts, function(err, html) {
        if (err) {
            return callback(err);
        }

        var $ = cheerio.load(html);
        var rating = $('[itemprop="rating"]').first().children('div');
        var ibu = $('abbr:contains("IBU")').next().text();

        var beer = {
            ibu: ibu.length ? parseInt(ibu, 10) : null,
            rateBeerId: beerId,
            rateBeerLastFetch: (new Date()).toISOString(),
            rateBeerScores: {
                overall: parseInt(rating.first().find('span').last().text(), 10),
                style: parseInt(rating.last().find('span').first().text(), 10)
            }
        };

        callback(null, beer);
    });
};
