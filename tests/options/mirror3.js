module.exports = {
	'mirror': function (test, external, makeShot) {
		console.log('mirror3 - mirror');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#third')
		
			.click('#mirrorButton')
			
			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.notSelected('#reverse', 'Reverse unchecked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')

			.execute(function(){
				this.assert.ok(window.active == "third", "window.active should be 'third', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror3.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtend': function (test, external, makeShot) {
		console.log('mirror3 - mirrorExtend');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#third')
			.click('#extend')
			
			.click('#mirrorButton')
			
			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.notSelected('#reverse', 'Reverse unchecked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')
			
			.execute(function(){
				this.assert.ok(window.active == "third", "window.active should be 'third', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex') * 2, "mapsizex == " + this.data('mapsizex') * 2);
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});
		
		makeShot && test.screenshot("./tests/images/:browser/mirror3Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorReverse': function (test, external, makeShot) {
		console.log('mirror3 - mirrorReverse');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#third')
			.click('#reverse')
		
			.click('#mirrorButton')
			
			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.selected('#reverse', 'Reverse checked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')

			.execute(function(){
				this.assert.ok(window.active == "third", "window.active should be 'third', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror3Reverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendReverse': function (test, external, makeShot) {
		console.log('mirror3 - mirrorExtendReverse');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#third')
			.click('#reverse')
			.click('#extend')

			.click('#mirrorButton')

			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.selected('#reverse', 'Reverse checked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')

			.execute(function(){
				this.assert.ok(window.active == "third", "window.active should be 'third', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex') * 2, "mapsizex == " + this.data('mapsizex') * 2);
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror3ExtendReverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};
