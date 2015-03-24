var map = require('../maps/defaultMap');
var cache = require('../maps/cacheMap');

var mirror1 = require('../options/mirror1');
var mirror2 = require('../options/mirror2');
var mirror3 = require('../options/mirror3');
var exchange = require('../options/exchange_map');

var new_map = require('../options/new_map');
// Make screenshots
var makeShot = false;

module.exports = {
	"Ticket 1 - Overwrite Rooms": function(test) {
		test.open("index.html");
			exchange.importMap(test, true, makeShot, "ticket1");
			mirror3.mirror(test, true, makeShot);
		test.execute(function() {
			this.assert.ok(window.navigator.userAgent, window.navigator.userAgent);
			this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "tiles should be 8, was " + Object.keys(window.terrain.tiles).length);
		});
		test.done();
	}
};