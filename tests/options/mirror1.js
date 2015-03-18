module.exports = {
	'mirror': function (test, external) {
		test.click('#optionButton')
			.click('#first')
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.notSelected('#rotate', 'Rotate unchecked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')
			.click('#mirrorButton')
			.screenshot("./tests/images/:browser/mirror1.png");
		
		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtend': function (test, external) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#extend')
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.notSelected('#rotate', 'Rotate unchecked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend unchecked')
			.click('#mirrorButton')
			.click('#extend')
			.screenshot("./tests/images/:browser/mirror1Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};