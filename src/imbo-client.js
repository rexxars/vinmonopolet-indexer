'use strict';

var imbo = require('imboclient');
var config = require('./config');

var client;

module.exports = function() {
    if (!client) {
        client = new imbo.Client(
            config.imbo.host,
            config.imbo.publicKey,
            config.imbo.privateKey
        );
    }

    return client;
};
