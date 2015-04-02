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
		makeShot && test.screenshot("./tests/images/:browser/ticket_12.png");
		test.done();
	},
	"Ticket #22 - Big rooms on border": function(test) {
		console.log(">> Test ticket #22".purple());

		// TODO: find out why enabling this makes the grunt test fail
		test.open("index.html");
		test
			.click("#core_p1")
			.click("#col_1_1")
			.click("#col_20_1")
			.click("#col_20_20")
			.click("#col_1_20");
		
		makeShot && test.screenshot("./tests/images/:browser/ticket_22_1.png");

		test.execute(function() {
			this.assert.ok(Object.keys(window.terrain.tiles).length == 4, "tiles should be 4, was " + Object.keys(window.terrain.tiles).length);
			// export and import map because it erases uncomplete rooms
			this.data("mapData", window.terrain.mapToJson().map);
			window.terrain.importData(window.terrain.exportData());
			this.assert.ok(Object.keys(window.terrain.tiles).length == 4, "tiles should be 4, was " + Object.keys(window.terrain.tiles).length);
		});
		
		test.done();
	},
	"Ticket #23 - Map that has been download multiple times can't be imported": function(test) {
		console.log(">> Test ticket #23".purple());

		test.open("index.html");
		// wfto file without versioning
			exchange.importMap(test, true, makeShot, "Ticket_23 (6)");
		test.execute(function() {
			this.assert.ok(Object.keys(window.terrain.tiles).length == 1, "tiles should be 1, was " + Object.keys(window.terrain.tiles).length);
			this.assert.ok(window.terrain.version === "001", "Version should be 001, it is " + window.terrain.version);
		});
		// wfto file with versioning
			exchange.importMap(test, true, makeShot, "Ticket_23_003 (3)");
		test.execute(function() {
			this.assert.ok(Object.keys(window.terrain.tiles).length == 1, "tiles should be 1, was " + Object.keys(window.terrain.tiles).length);
			this.assert.ok(window.terrain.version === "004", "Version should be 004, it is " + window.terrain.version);
		});
		test.done();
	}
};