module.exports = {
	'mirror': function (test, external) {
		test.click('#optionButton')
			.click('#first')
			.click('#mirrorButton')
			//.assert.dialogText('This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?')
			//.accept()
			//.waitFor(function () { return document.getElementById("options").style.display == none;}, [], 500) //('#options')
			.screenshot("./tests/images/:browser/mirror1.png");
		
		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};