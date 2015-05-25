'use strict';

var polet = require('vinmonopolet');
var indexStore = require('../src/util/index-store');

polet
    .getStoreStream()
    .on('data', indexStore);
