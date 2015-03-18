module.exports = {
	'mirror': function (test, external) {
		if (!external) { test.open('index.html'); }
		
		test.click('#optionButton')
			.click('#first')
			
			.click('#mirrorButton')
			//.screenshot("./tests/images/:browser/mirror1.png")
			;
		
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
			
			.click('#mirrorButton')
			.click('#extend')
			//.screenshot("./tests/images/:browser/mirror1Extend.png"
			;

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorRotate': function (test, external) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#rotate')
			
			.click('#mirrorButton')
			.click('#rotate')
			//.screenshot("./tests/images/:browser/mirror1Rotate.png")
			;

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};