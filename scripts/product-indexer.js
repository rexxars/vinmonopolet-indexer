'use strict';

var polet = require('vinmonopolet');
var indexProduct = require('../src/util/index-product');

polet
    .getProductStream()
    .on('data', indexProduct);
