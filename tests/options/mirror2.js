module.exports = {
	'mirror': function (test, external, makeShot) {
		console.log('mirror2 - mirror');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')

			.click('#mirrorButton')

			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.notSelected('#reverse', 'Reverse unchecked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')

			.execute(function(){
				this.assert.ok(window.active == "second", "window.active should be 'second', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror2.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtend': function (test, external, makeShot) {
		console.log('mirror2 - mirrorExtend');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			//.assert.notSelected('#extend', 'Extend unchecked')
			.click('#extend')

			.click('#mirrorButton')

			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.notSelected('#reverse', 'Reverse unchecked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')

			.execute(function(){
				this.assert.ok(window.active == "second", "window.active should be 'second', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey') * 2, "mapsizey == " + this.data('mapsizey') * 2);
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror2Extend.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorReverse': function (test, external, makeShot) {
		console.log('mirror2 - mirrorReverse');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')

			.click('#mirrorButton')

			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.selected('#reverse', 'Reverse checked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.notSelected('#extend', 'Extend unchecked')

			.execute(function(){
				this.assert.ok(window.active == "second", "window.active should be 'second', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey'), "mapsizey == " + this.data('mapsizey'));
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror2Reverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'mirrorExtendReverse': function (test, external, makeShot) {
		console.log('mirror2 - mirrorExtendReverse');
		if (!external) { test.open('index.html'); }

		test
			.click('#optionButton')
			.click('#second')
			.click('#reverse')
			.click('#extend')

			.click('#mirrorButton')

			.assert.disabled('#rotate', 'Rotate disabled')
			.assert.enabled('#reverse', 'Reverse enabled')
			.assert.selected('#reverse', 'Reverse checked')
			.assert.enabled('#extend', 'Extend enabled')
			.assert.selected('#extend', 'Extend checked')

			.execute(function(){
				this.assert.ok(window.active == "second", "window.active should be 'second', was " + window.active);
				this.assert.ok(window.terrain.mapsizex == this.data('mapsizex'), "mapsizex == " + this.data('mapsizex'));
				this.assert.ok(window.terrain.mapsizey == this.data('mapsizey') * 2, "mapsizey == " + this.data('mapsizey') * 2);
			});

		makeShot && test.screenshot("./tests/images/:browser/mirror2ExtendReverse.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};