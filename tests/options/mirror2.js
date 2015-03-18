module.exports = {
	'mirror': function (test, external) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
		
			.click('#mirrorButton')
			//.screenshot("./tests/images/:browser/mirror2.png")
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
			.click('#second')
			//.assert.notSelected('#extend', 'Extend unchecked')
			.click('#extend')
			
			.click('#mirrorButton')
			.click('#extend')
			//.screenshot("./tests/images/:browser/mirror2Extend.png")
			;

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorReverse': function (test, external) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')
		
			.click('#mirrorButton')
			.click('#reverse')
			//.screenshot("./tests/images/:browser/mirror2Reverse.png")
			;

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendReverse': function (test, external) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')
			.click('#extend')
			
			.click('#mirrorButton')
			.click('#reverse')
			.click('#extend')
			//.screenshot("./tests/images/:browser/mirror2ExtendReverse.png")
			;

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};