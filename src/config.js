'use strict';

var debugEs = process.env.DEBUG && process.env.DEBUG.indexOf('elasticsearch') > -1;

module.exports = {
    elasticsearch: {
        host: process.env.ELASTICSEARCH_HOST || 'localhost:9200',
        log: debugEs ? 'trace' : null,

        index: process.env.ELASTICSEARCH_INDEX || 'olsentralen',
        version: process.env.ELASTICSEARCH_VERSION || '1.2.1'
    },

    bing: {
        apiKey: process.env.BING_API_KEY
    },

    imbo: {
        host: 'http://imbo',
        publicKey: 'olsentralen',
        privateKey: 'omgwtfbbq'
    }
};
