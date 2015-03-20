var fs = require('fs');
var dir = ".\\tests\\files\\";

module.exports = {
	'importMap': function (test, external, makeShot, mapname) {
		if (!external) { test.open("index.html"); }
		
		mapname = mapname || "Testimport";
		console.log("exchange - Import map: " + mapname);
		
		test
		.click('#optionButton')
		.setValue('#mapFile', dir + mapname + ".wfto")
		.click('#import')
		.assert.val('#mapName', mapname, 'Map name is ' + mapname)
		.assert.notVisible("#options");
		
		makeShot && test.screenshot("./tests/images/:browser/" + mapname + "_import.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'importCSVMap': function (test, external, makeShot, mapname, width, height, border) {
		
		if (!external) { test.open("index.html"); }
		
		mapname = mapname || "Testimport";
		width = width || 40;
		height = height || 40;
		border = border	|| 1;
		
		console.log("exchange - Import CSV map: " + mapname);
		
		test
		.click('#optionButton')
		.setValue('#csv', dir + mapname + ".csv")
		.setValue('#csvborder', '"' + border + '"')
		.click('#importcsv')
		.assert.val('#mapName', mapname, 'Map name is ' + mapname)
		// TODO Evaluate map size
		.assert.notVisible("#options");
		
		makeShot && test.screenshot("./tests/images/:browser/" + mapname + "_csvimport.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'exportMap': function (test, external, mapname) {
		
		if (!external) { test.open("index.html"); }
		// TODO: Implement test for exporting map (maybe phantomjs 2.0)
		test.done();
		/*
		mapname = mapname || "Testimport";
		
		test
		.click('#optionButton')
		.setValue('#mapFile', dir + mapname + ".wfto")
		.click('#import')
		.click('#optionButton')
		.click('#export');
	
		if (external) {
			return test;
		} else {
			test.done();
		}
		*/
	}
};