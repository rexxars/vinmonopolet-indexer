var _ = require('lodash'),
    vinmonopolet  = require('vinmonopolet'),
    elasticsearch = require('elasticsearch'),
    async         = require('async'),
    config        = require('./config/config.json'),
    client        = new elasticsearch.Client({ host: config.elasticsearch.host + ':' + config.elasticsearch.port });

if (config.productCategories === '*') {
    vinmonopolet.getCategories(function(err, categories) {
        if (err) {
            return console.error('Failed to get categories', err);
        }

        getProductsForCategories(categories.map(getTitle), onProductsFetched);
    });
} else {
    getProductsForCategories(config.productCategories, onProductsFetched);
}

function getTitle(item) {
    return item.title;
}

function getProductsForCategories(categories, callback) {
    async.concat(categories, vinmonopolet.getProductsByCategoryName, callback);
}

function indexProduct(product, callback) {
    client.index({
        index: config.elasticsearch.index || 'vinmonopolet',
        type: config.elasticsearch.type || 'products',
        id: product.sku,
        body: product
    }, callback);
}

function onProductsFetched(err, products) {
    if (err) {
        return console.error('Error retrieving products', err);
    }

    async.eachLimit(products, config.elasticsearch.concurrency || 5, indexProduct, function(err) {
        onProductsIndexed(err, products.length);
    });
}

function onProductsIndexed(err, numProducts) {
    client.close();

    if (err) {
        return console.error('Failed to index products', err);
    }

    console.log('Finished indexing ' + numProducts + ' products');
}