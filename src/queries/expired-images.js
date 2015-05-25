'use strict';

var since = new Date(Date.now() - (86400 * 15 * 1000));

module.exports = {
    query: {
        filtered: {
            query: {
                term: { productType: 'Øl' }
            },

            filter: {
                bool: {
                    must: [
                        {
                            exists: {
                                field: 'rateBeerId'
                            }
                        }
                    ],

                    should: [
                        {
                            missing: {
                                field: 'imageIdentifier'
                            }
                        },

                        {
                            range: {
                                imageLastFetched: {
                                    lt: since.toISOString()
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
};
