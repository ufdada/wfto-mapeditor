'use strict';

var map = require('../maps/defaultMap');
var mirror1 = require('../options/mirror1');

module.exports = {
    "Mirroring": function(test) {
		test.open("index.html");
			map.drawDefaultMap(test, true);
			mirror1.mirror(test, true);
        test.done();
    }
}