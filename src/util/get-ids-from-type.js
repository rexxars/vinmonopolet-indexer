'use strict';

var config = require('../config');
var client = require('../client');

module.exports = function(type, callback) {
    client.search({
        index: config.elasticsearch.index,
        type: type,
        body: {
            query: {
                'match_all': {}
            },
            fields: []
        }
    }, function(err) {
        if (err) {
            return callback(err);
        }

        callback(null, []);
    });
};
