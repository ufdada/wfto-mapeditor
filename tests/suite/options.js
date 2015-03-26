var cache = require('../maps/cacheMap');
var exchange = require('../options/exchange_map');
var resize_map = require('../options/resize_map');

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
	"Undomanager": function(test) {
		console.log(">> Test Undomanager".purple());
		test.open("index.html");
		test.done();
	}
};