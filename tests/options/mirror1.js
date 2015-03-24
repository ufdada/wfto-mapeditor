module.exports = {
	'mirror': function (test, external, makeShot) {
		console.log('mirror1 - mirror');
		if (!external) { test.open('index.html'); }
		
		test.click('#optionButton')
			.click('#first')
			
			.click('#mirrorButton')
			
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.notSelected('#rotate', 'Rotate unchecked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')
			
			.execute(function(){
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});
			
		makeShot && test.screenshot("./tests/images/:browser/mirror1.png");
		
		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtend': function (test, external, makeShot) {
		console.log('mirror1 - mirrorExtend');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#extend')
			.click('#mirrorButton')
			
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.notSelected('#rotate', 'Rotate unchecked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')

			.execute(function(){
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex') * 2, "mapsizex == " + this.data('mapsizex') * 2);
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey') * 2, "mapsizey == " + this.data('mapsizey') * 2);
			});
			
		makeShot && test.screenshot("./tests/images/:browser/mirror1Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorRotate': function (test, external, makeShot) {
		console.log('mirror1 - mirrorRotate');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#rotate')
			
			.click('#mirrorButton')
			
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.selected('#rotate', 'Rotate checked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')
			
			.execute(function(){
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});
			
		makeShot && test.screenshot("./tests/images/:browser/mirror1Rotate.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendRotate': function (test, external, makeShot) {
		console.log('mirror1 - mirrorExtendRotate');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#first')
			.click('#rotate')
			.click('#extend')
			
			.click('#mirrorButton')
			
			.assert.enabled('#rotate', 'Rotate enabled')
			.assert.selected('#rotate', 'Rotate checked')
			.assert.disabled('#reverse', 'Reverse disabled')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')
			
			.execute(function(){
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex') * 2, "mapsizex == " + this.data('mapsizex') * 2);
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey') * 2, "mapsizey == " + this.data('mapsizey') * 2);
			});
			
		makeShot && test.screenshot("./tests/images/:browser/mirror1ExtendRotate.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};