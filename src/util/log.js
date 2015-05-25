'use strict';

var util = require('util');

module.exports = function(obj) {
    /* eslint no-console: 0 */
    console.log(util.inspect(obj, { colors: true, depth: 8 }));
};
