'use strict';

var since = new Date(Date.now() - (86400 * 5 * 1000));

module.exports = {
    query: {
        filtered: {
            query: {
                term: { productType: 'Øl' }
            },

            filter: {
                bool: {
                    should: [
                        {
                            missing: {
                                field: 'rateBeerLastFetch'
                            }
                        },

                        {
                            range: {
                                rateBeerLastFetch: {
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
