module.exports = {
	'save': function (test, external) {
		console.log(">> Save mapdata");
		test.execute(function() {
			this.data("mapData", window.terrain.exportData());
		});
		return test;
	},
	'load': function (test, external) {
		console.log(">> Load mapdata");
		test.execute(function() {
			// reset these checkoxes, since dalek doesn't do that (wether with a second click nor through a reload) 
			window.extend.checked = "";
			window.reverse.checked = "";
			window.rotate.checked = "";
			// reimport the map
			window.terrain.importData(this.data("mapData"));
		});
		return test;
	}
};