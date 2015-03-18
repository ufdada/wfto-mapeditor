var map = require('../maps/defaultMap');
var mirror1 = require('../options/mirror1');
var new_map = require('../options/new_map');

module.exports = {
    "Mirroring": function(test) {
		test.open("index.html");
			// Mirror 1
			new_map.generate(test, true);
			map.drawMap(test, true);
			mirror1.mirror(test, true);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 20, "window.terrain.mapsizex == 20");
				this.assert.ok(window.terrain.mapsizey == 20, "window.terrain.mapsizey == 20");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 8, "Object.keys(window.terrain.tiles).length == 8");
			});
			// Mirror 1 Extend
			new_map.generate(test, true);
			map.drawMap(test, true);
			mirror1.mirrorExtend(test, true);
			test.execute(function() {
				this.assert.ok(window.terrain.mapsizex == 40, "window.terrain.mapsizex == 40");
				this.assert.ok(window.terrain.mapsizey == 40, "window.terrain.mapsizey == 40");
				this.assert.ok(Object.keys(window.terrain.tiles).length == 20, "Object.keys(window.terrain.tiles).length == 20");
			});
        test.done();
    }	
			
};