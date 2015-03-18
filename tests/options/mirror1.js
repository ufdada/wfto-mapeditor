module.exports = {
	'mirror': function (test, external, makeShot) {
		if (!external) { test.open('index.html'); }
		
		test.click('#optionButton')
			.click('#first')
			
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror1.png");
		
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
			.click('#first')
			.click('#extend')
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror1Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorRotate': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#rotate')
			
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror1Rotate.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendRotate': function (test, external, makeShot) {

		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#rotate')
			.click('#extend')
			
			.click('#mirrorButton');
			makeShot && test.screenshot("./tests/images/:browser/mirror1ExtendRotate.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};