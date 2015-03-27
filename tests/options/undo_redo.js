module.exports = {
	'undo': function (test, external, makeShot) {
		if (!external) { test.open("index.html"); }

		test
			.execute(function(){
				this.data("undoHistory", window.terrain.undoHistory);
				this.data("redoHistory", window.terrain.redoHistory);
			})
			.assert.enabled("#undo", "Undo should be enabled!")
			
			.click('#undo')
			
			.execute(function(){
				this.assert.ok(window.terrain.undoHistory.length == this.data("undoHistory").length - 1, "undoHistory.length should be " + (this.data("undoHistory").length - 1) + ", was " + window.terrain.undoHistory.length);
				this.assert.ok(window.terrain.redoHistory.length == this.data("redoHistory").length + 1, "redoHistory.length should be " + (this.data("redoHistory").length + 1) + ", was " + window.terrain.redoHistory.length);
			})
			.assert.enabled("#redo", "Redo should be enabled!")
			.assert.enabled("#undo", "Undo should be enabled!")

		makeShot && test.screenshot("./tests/images/:browser/undo.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	},
	'redo': function (test, external, makeShot) {
		if (!external) { test.open("index.html"); }

		test
			.execute(function(){
				this.data("undoHistory", window.terrain.undoHistory);
				this.data("redoHistory", window.terrain.redoHistory);
			})
			.assert.enabled("#redo", "Redo should be enabled!")
			
			.click('#redo')
			
			.execute(function(){
				this.assert.ok(window.terrain.undoHistory.length == this.data("undoHistory").length + 1, "undoHistory.length should be " + (this.data("undoHistory").length + 1) + ", was " + window.terrain.undoHistory.length);
				this.assert.ok(window.terrain.redoHistory.length == this.data("redoHistory").length - 1, "redoHistory.length should be " + (this.data("redoHistory").length - 1) + ", was " + window.terrain.redoHistory.length);
				this.data("mapData", window.terrain.exportData());
			})

		makeShot && test.screenshot("./tests/images/:browser/redo.png");

		if (external) {
			return test;
		} else {
			test.done();
		}
	}
};