module.exports = {
	'generate': function (test, external, width, height) {
		width = width || '20';
		height = height || '20';

		if (!external) { test.open("index.html"); }

		test
		.click('#optionButton')
		.setValue('#width', width)
		.setValue('#height', height)
		.click('input[type="submit"]')
		.execute(function(){
			this.assert.ok(window.terrain.mapsizex == width.value, "Mapwidth is " + width.value);
			this.assert.ok(window.terrain.mapsizey == height.value, "Mapwidth is " + height.value);
		});

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};