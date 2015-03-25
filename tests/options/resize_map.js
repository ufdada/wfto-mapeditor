/*
- test for each direction and type (add/remove)
- test for deceeding/exceeding mapsize
- test for big rooms on removed row / removed column
*/
module.exports = {
	'top_add': function (test, external) {
		if (!external) { test.open("index.html"); }
		
		test
		// click top add
		
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