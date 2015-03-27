var map = require('../maps/defaultMap');
var cache = require('../maps/cacheMap');

var mirror1 = require('../options/mirror1');
var mirror2 = require('../options/mirror2');
var mirror3 = require('../options/mirror3');
var exchange = require('../options/exchange_map');

var new_map = require('../options/new_map');
var resize_map = require('../options/resize_map');
// Make screenshots
var makeShot = false;

module.exports = {
    "Mirroring": function(test) {
		test.open("index.html");
			test.execute(function() {
				this.data('mapsizex', window.terrain.mapsizex);
				this.data('mapsizey', window.terrain.mapsizey);
			});

			// Mirror 1
			new_map.generate(test, true);
			map.drawMap(test, true, makeShot);
			cache.save(test, true);

			mirror1.mirror(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(tiles).length == 8");
			});

			// test.assert.evaluate(function() {
				// return Object.keys(window.terrain.tiles).length;
			// }, 8, "tiles length is 8");

			// Mirror 1 Extend
			cache.load(test, true);

			mirror1.mirrorExtend(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 20, "Object.keys(tiles).length == 20");
			});

			// Mirror 1 Rotate
			cache.load(test, true);

			mirror1.mirrorRotate(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(tiles).length == 7");
			});

			// Mirror 1 ExtendRotate
			cache.load(test, true);

			mirror1.mirrorExtendRotate(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 20, "Object.keys(tiles).length == 20");
			});

			// Mirror 2
			cache.load(test, true);

			mirror2.mirror(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(tiles).length == 7");
			});

			// Mirror 2 Extend
			cache.load(test, true);

			mirror2.mirrorExtend(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(tiles).length == 10");
			});

			// Mirror 2 Reverse
			cache.load(test, true);

			mirror2.mirrorReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(tiles).length == 7");
			});

			// Mirror 2 ExtendReverse
			cache.load(test, true);

			mirror2.mirrorExtendReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(tiles).length == 10");
			});

			// Mirror 3
			cache.load(test, true);

			mirror3.mirror(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(tiles).length == 7");
			});

			// Mirror 3 Extend
			cache.load(test, true);

			mirror3.mirrorExtend(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(tiles).length == 10");
			});

			// Mirror 3 Reverse
			cache.load(test, true);

			mirror3.mirrorReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(tiles).length == 7");
			});

			// Mirror 3 ExtendReverse
			cache.load(test, true);

			mirror3.mirrorExtendReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(tiles).length == 10");
			});
        test.done();
    },
	"Import": function(test) {
		test.open("index.html");
			exchange.importMap(test, true, makeShot);
			exchange.importCSVMap(test, true, makeShot);
		test.done();
	}
};