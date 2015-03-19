module.exports = {
	'generate': function (test, external, width, height) {
		String.prototype.purple = function() {
			return "\033[35m" + this + "\033[0m";
		};
		
		width = width || '20';
		height = height || '20';
		
		if (!external) { test.open("index.html"); }
		
		test
		.execute(function(){
			// Workarround for phantomjs, otherwise confirm/alert messages break tests
			window.confirm = function(text){ 
				//'This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?'
				return true; 
			};
			window.alert = function(text){ 
				//'This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?'
				return true; 
			};
		})
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