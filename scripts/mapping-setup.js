'use strict';

var config = require('../src/config');
var client = require('../src/client')();

client.indices.delete({
    index: config.elasticsearch.index
}, function() {
    client.indices.create({
        index: config.elasticsearch.index
    }, function() {
        createMappings();
    });
});

function createMappings() {
    client.indices.putMapping({
        index: config.elasticsearch.index,
        type: 'products',
        body: {
            products: {
                properties: getProductsMapping()
            }
        }
    }, function(err) {
        if (err) {
            throw err;
        }

        /* eslint no-console: 0 */
        console.log('Products type created');
    });

    client.indices.putMapping({
        index: config.elasticsearch.index,
        type: 'stores',
        body: {
            stores: {
                properties: getStoresMapping()
            }
        }
    }, function(err) {
        if (err) {
            throw err;
        }

        /* eslint no-console: 0 */
        console.log('Stores type created');
    });
}

function getProductsMapping() {
    return {
        sku: { type: 'integer' },
        title: { type: 'string' },
        containerSize: { type: 'double' },
        price: { type: 'double' },
        pricePerLiter: { type: 'double' },
        productType: { type: 'string', index: 'not_analyzed' },
        productSelection: { type: 'string', index: 'not_analyzed' },
        storeCategory: { type: 'string', index: 'not_analyzed' },
        fullness: { type: 'integer' },
        freshness: { type: 'integer' },
        tannins: { type: 'integer' },
        bitterness: { type: 'integer' },
        sweetness: { type: 'integer' },
        color: { type: 'string' },
        aroma: { type: 'string' },
        taste: { type: 'string' },
        foodPairings: { type: 'string', index: 'not_analyzed' },
        country: { type: 'string', index: 'not_analyzed' },
        region: { type: 'string', index: 'not_analyzed' },
        subRegion: { type: 'string', index: 'not_analyzed' },
        vintage: { type: 'integer' },
        ingredients: { type: 'string' },
        method: { type: 'string' },
        abv: { type: 'double' },
        ibu: { type: 'double' },
        sugar: { type: 'double' },
        acid: { type: 'double' },
        storable: { type: 'string' },
        manufacturer: { type: 'string' },
        wholesaler: { type: 'string' },
        distributor: { type: 'string' },
        containerType: { type: 'string', index: 'not_analyzed' },
        corkType: { type: 'string', index: 'not_analyzed' },
        url: { type: 'string', index: 'not_analyzed' },

        imageIdentifier: { type: 'string', index: 'not_analyzed' },
        imageLastFetched: { type: 'date' },

        rateBeerId: { type: 'integer' },
        rateBeerLastFetch: { type: 'date' },
        rateBeerScores: {
            type: 'object',
            dynamic: false,
            properties: {
                overall: { type: 'integer' },
                style: { type: 'integer' }
            }
        }
    };
}

function getStoresMapping() {
    var openingHours = {
        type: 'object',
        dynamic: false,
        properties: {
            opens: { type: 'integer' },
            closes: { type: 'integer' }
        }
    };

    return {
        name: { type: 'string' },
        streetAddress: { type: 'string' },
        streetZip: { type: 'string' },
        streetCity: { type: 'string' },
        postalAddress: { type: 'string' },
        postalZip: { type: 'string' },
        postalCity: { type: 'string' },
        phoneNumber: { type: 'string' },
        category: { type: 'string', index: 'not_analyzed' },
        gpsCoordinates: { type: 'geo_point' },
        weekNumber: { type: 'integer' },
        openingHoursMonday: openingHours,
        openingHoursTuesday: openingHours,
        openingHoursWednesday: openingHours,
        openingHoursThursday: openingHours,
        openingHoursFriday: openingHours,
        openingHoursSaturday: openingHours,
        weekNumberNext: { type: 'integer' },
        openingHoursNextMonday: openingHours,
        openingHoursNextTuesday: openingHours,
        openingHoursNextWednesday: openingHours,
        openingHoursNextThursday: openingHours,
        openingHoursNextFriday: openingHours,
        openingHoursNextSaturday: openingHours
    };
}
