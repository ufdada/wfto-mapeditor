module.exports = {
	'mirror': function (test, external) {
		test.click('#optionButton')
			.click('#first')
			.click('#mirrorButton')
			.screenshot("./tests/images/:browser/mirror1.png");
		
		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};