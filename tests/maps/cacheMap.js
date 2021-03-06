var helper = require('../helper');

module.exports = {
	'save': function (test, external) {
		console.log(">> Save mapdata".purple());
		test.execute(function() {
			this.data("mapData", window.terrain.exportData());
		});
		return test;
	},
	'load': function (test, external) {
		console.log(">> Load mapdata".purple());
		test.execute(function() {
			// reset these checkoxes, since dalek doesn't do that (wether with a second click nor through a reload)
			window.extend.checked = "";
			window.reverse.checked = "";
			window.rotate.checked = "";
			// reimport the map
			window.terrain.importData(this.data("mapData"));
			this.data('mapsizex', window.terrain.mapsizex);
			this.data('mapsizey', window.terrain.mapsizey);
		});
		return test;
	}
};