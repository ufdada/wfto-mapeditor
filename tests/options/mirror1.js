module.exports = {
	'mirror': function (test, external) {
		test.click('#optionButton')
			.click('#first')
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.click('#mirrorButton')
			//.waitFor(function () { return document.getElementById("options").style.display == none;}, [], 500) //('#options')
			.screenshot("./tests/images/:browser/mirror1.png");
		
		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};