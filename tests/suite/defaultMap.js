'use strict';

var map = require('../maps/defaultMap');
var mirror1 = require('../options/mirror1');
var new_map = require('../options/new_map');

module.exports = {
    "Mirroring": function(test) {
		test.open("index.html");
			new_map.new(test, true);
			map.drawDefaultMap(test, true);
			mirror1.mirror(test, true);
        test.done();
    }
}