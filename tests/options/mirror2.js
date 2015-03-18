module.exports = {
	'mirror': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
		
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror2.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtend': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			//.assert.notSelected('#extend', 'Extend unchecked')
			.click('#extend')
			
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror2Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorReverse': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')
		
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror2Reverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendReverse': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')
			.click('#extend')
			
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror2ExtendReverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};