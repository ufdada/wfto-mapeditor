var map = require('../maps/defaultMap');
var cache = require('../maps/cacheMap');

var mirror1 = require('../options/mirror1');
var mirror2 = require('../options/mirror2');
var mirror3 = require('../options/mirror3');
var exchange = require('../options/exchange_map');

var new_map = require('../options/new_map');

var helper = require('../helper');
// Make screenshots
var makeShot = false;

module.exports = {
	"Ticket #12 - Overwrite Rooms": function(test) {
		console.log(">> Test ticket #12".purple());
		
		// TODO: find out why enabling this makes the grunt test fail
		test.open("index.html");
			exchange.importMap(test, true, makeShot, "Ticket_12");
			mirror3.mirror(test, true, makeShot);
		test.execute(function() {
			this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "tiles should be 8, was " + Object.keys(window.terrain.tiles).length);
		});
		test.done();
	}
};