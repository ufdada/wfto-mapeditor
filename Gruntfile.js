module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: [
				"js/**/*.js",
				"tests/**/*.js",
				"*.json"
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		lint5: {
			dirPath: "",
			templates: [
				"index.html",
				"./tests/convert.html"
			],
			ignoreList: [
				'.wfto',
				'.csv'
			]
		},
		dalek: {
			dist: {
				src: [
					'./tests/suite/defaultMap.js' /*,
					'./tests/suite/options.js',
					'./tests/suite/tickets.js'*/
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-lint5');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-dalek');

	grunt.registerTask('test', ['validate', 'dalek']);
	grunt.registerTask('validate', ['jshint'/*, 'lint5'*/]);

	grunt.registerTask('default', ['test']);
};
