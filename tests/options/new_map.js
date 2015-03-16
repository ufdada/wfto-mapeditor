module.exports = {
	'new': function (test, external, width, height) {
		var width = width || '40';
		var height = height || '40';
		
		if (!external) { test.open("index.html"); }
		
		test
		.click('#optionButton')
		.type('#width', width)
		.type('#height', height)
		.click('input[type="submit"]')

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};