'use strict';

var elasticsearch = require('elasticsearch');
var config = require('./config');

var client;

module.exports = function() {
    if (!client) {
        client = new elasticsearch.Client(config.elasticsearch);
    }

    return client;
};
