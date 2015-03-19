module.exports = {
	'importMap1': function (test, external) {
		
		if (!external) { test.open("index.html"); }
		
		test
		.click('#optionButton')
		.setValue('#mapFile', ".\\tests\\files\\Testfile1.wfto")
		.click('#import')
		.assert.val('#mapName', 'Testfile1', 'Map name is Testfile1')
		.screenshot("./tests/images/:browser/Testfile1_import.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};