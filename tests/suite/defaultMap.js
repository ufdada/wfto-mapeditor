var map = require('../maps/defaultMap');
var cache = require('../maps/cacheMap');

var mirror1 = require('../options/mirror1');
var mirror2 = require('../options/mirror2');

var new_map = require('../options/new_map');
var makeShot = false;

module.exports = {
    "Mirroring": function(test) {
		test.open("index.html");
			// Mirror 1
			new_map.generate(test, true);
			map.drawMap(test, true, makeShot);
			
			cache.save(test, true);
			
			mirror1.mirror(test, true, makeShot);
			/*
						
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.notSelected('#rotate', 'Rotate unchecked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend unchecked')
			
			*/
			
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 20, "window.terrain.mapsizey == 20");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(window.terrain.tiles).length == 8");
			});
			
			// Mirror 1 Extend
			cache.load(test, true);
			mirror1.mirrorExtend(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 40, "window.terrain.mapsizex == 40");
				this.assert.ok(window.terrain.mapsizey == 40, "window.terrain.mapsizey == 40");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 20, "Object.keys(window.terrain.tiles).length == 20");
			});
			
			// Mirror 1 Rotate
			cache.load(test, true);
			
			mirror1.mirrorRotate(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 20, "window.terrain.mapsizey == 20");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(window.terrain.tiles).length == 7");
			});
			
			// Mirror 1 ExtendRotate
			cache.load(test, true);
			
			mirror1.mirrorExtendRotate(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 40, "window.terrain.mapsizex == 40");
				this.assert.ok(window.terrain.mapsizey == 40, "window.terrain.mapsizey == 40");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 20, "Object.keys(window.terrain.tiles).length == 20");
			});
			
			// Mirror 2
			cache.load(test, true);
			
			mirror2.mirror(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 20, "window.terrain.mapsizey == 20");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(window.terrain.tiles).length == 7");
			});
			
			// Mirror 2 Extend
			cache.load(test, true);
			
			mirror2.mirrorExtend(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 40, "window.terrain.mapsizey == 40");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(window.terrain.tiles).length == 10");
			});
			
			// Mirror 2 Reverse
			cache.load(test, true);
			
			mirror2.mirrorReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 20, "window.terrain.mapsizey == 20");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 7, "Object.keys(window.terrain.tiles).length == 7");
			});
			
			// Mirror 2 ExtendReverse
			cache.load(test, true);
			
			mirror2.mirrorExtendReverse(test, true, makeShot);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 40, "window.terrain.mapsizey == 40");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 10, "Object.keys(window.terrain.tiles).length == 10");
			});
        test.done();
    }
};