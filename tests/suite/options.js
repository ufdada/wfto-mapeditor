var cache = require('../maps/cacheMap');
var exchange = require('../options/exchange_map');
var resize_map = require('../options/resize_map');
var undo_redo = require('../options/undo_redo');

var helper = require('../helper');
// Make screenshots
var makeShot = false;

module.exports = {
	"Resize": function(test) {
		console.log(">> Test Resizing".purple());
		test.open("index.html");

			exchange.importMap(test, true, makeShot);

			// top
			cache.save(test, true);
			resize_map.top_add(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(tiles).length == 8");
			});

			cache.load(test, true);
			resize_map.top_remove(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 6, "Object.keys(tiles).length == 6");
			});

			// left
			cache.load(test, true);
			resize_map.left_add(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(tiles).length == 8");
			});

			cache.load(test, true);
			resize_map.left_remove(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 6, "Object.keys(tiles).length == 6");
			});

			// right
			cache.load(test, true);
			resize_map.right_add(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(tiles).length == 8");
			});

			cache.load(test, true);
			resize_map.right_remove(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 6, "Object.keys(tiles).length == 6");
			});

			// bottom
			cache.load(test, true);
			resize_map.bottom_add(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(tiles).length == 8");
			});

			cache.load(test, true);
			resize_map.bottom_remove(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 6, "Object.keys(tiles).length == 6");
			});

		test.done();
	},
	"Undomanager part 1": function(test) {
		console.log(">> Test Undomanager".purple());
		test.open("index.html");
		test
			.execute(function(){
				this.data("undoHistory", window.terrain.undoHistory);
				this.data("redoHistory", window.terrain.redoHistory);
			})
			.click('#claimed_earth_p1')
			.click('#col_6_1')
			.click('#col_6_2')
			.execute(function(){
				this.assert.ok(window.terrain.undoHistory.length == this.data("undoHistory").length + 2, "undoHistory.length should be " + (this.data("undoHistory").length + 2) + ", was " + window.terrain.undoHistory.length);
				this.assert.ok(window.terrain.redoHistory.length == this.data("redoHistory").length, "redoHistory.length should be " + this.data("redoHistory").length + ", was " + window.terrain.redoHistory.length);
				this.data("mapData", window.terrain.exportData());
			});

		undo_redo.undo(test, true, makeShot);
		undo_redo.redo(test, true, makeShot);

		// Import map
		exchange.importMap(test, true, makeShot);
		undo_redo.undo(test, true, makeShot);
		test.execute(function(){
			this.assert.ok(window.terrain.exportData() == this.data("mapData"), "exported map should be the same as before action");
		});
		undo_redo.redo(test, true, makeShot);

		// Import csv
		exchange.importCSVMap(test, true, makeShot);
		undo_redo.undo(test, true, makeShot);
		test.execute(function(){
			this.assert.ok(window.terrain.exportData() == this.data("mapData"), "exported map should be the same as before action");
		});
		undo_redo.redo(test, true, makeShot);

		test.execute(function(){
			this.data("undoHistory", window.terrain.undoHistory);
			this.data("redoHistory", window.terrain.redoHistory);
		});

		test.done();
	},
	"Undomanager part 2": function(test) {
		/*test
			.click('#claimed_earth_p1')
			.click('#col_6_1')
			.click('#col_6_2')
			.execute(function(){
				this.data("undoHistory", window.terrain.undoHistory);
				this.data("redoHistory", window.terrain.redoHistory);
				this.data("mapData", window.terrain.exportData());
			});
			// Resize map
		resize_map.top_add(test, true, makeShot);
		resize_map.left_add(test, true, makeShot);
		resize_map.right_add(test, true, makeShot);
		resize_map.bottom_add(test, true, makeShot);
		test
			.execute(function(){
				this.assert.ok(window.terrain.undoHistory.length == this.data("undoHistory").length + 4, "undoHistory.length should be " + (this.data("undoHistory").length  + 4) + ", was " + window.terrain.undoHistory.length);
				this.assert.ok(window.terrain.redoHistory.length == this.data("redoHistory").length, "redoHistory.length should be " + this.data("redoHistory").length + ", was " + window.terrain.redoHistory.length);
			})
			.click("#undo")
			.click("#undo")
			.click("#undo")
			.click("#undo")
			.execute(function(){
				this.assert.ok(window.terrain.exportData() == this.data("mapData"), "exported map should be the same as before action");
			});
		/*
			mirror
		*/
		test.done();
	}
};