String.prototype.purple = function() {
	return "\033[35m" + this + "\033[0m";
};

module.exports = {
	'fixFilename': function(filename) {
		return filename.replace(/\s\([0-9]{1,}\)\./g, ".");
	},
	'getFilename': function(filename) {
		filename = this.fixFilename(filename);
		filename = filename.split(".")[0];
		if (filename.split("_").length > 2) {
			filename = filename.substr(0, filename.lastIndexOf("_"));
		}
		return filename;
	}
};