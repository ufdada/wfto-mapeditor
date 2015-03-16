function convert() {
	var files = document.getElementById("files");
	if (files.files.length > 0) {
		var file = files.files[0];
		
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(){
			var text = convertTests(this.result);
			var output = document.getElementById("output");
			var pre = document.createElement("pre");
			
			pre.innerHTML= text;
			output.appendChild(pre);
		}
	}
}

function convertTests(content) {
	var testnameRegex = /<thead><tr><td[^>]+>([^<]+)+.*/;
	var testRegex = /<tr><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)?<\/td><\/tr>/g;

	content = content.replace(/[\r\n\t]/g, "");

	var testName = content.match(testnameRegex)[1];
	var header = "module.exports = {\r\n\t'" + testName + "': function (test, external) {\r\n\r\n\t\tif (!external) { test.open('index.html'); }\r\n\r\n\t\ttest\r\n";
	var footer = "\t\tif (external) {\r\n\t\t\treturn test;\r\n\t\t} else {\r\n\t\t\ttest.done();\r\n\t\t}\r\n\t}\r\n};";
	
	var rc = header;
	
	while (tests = testRegex.exec(content)){
		var cmd = tests[1];
		var selector = tests[2];
		var val = tests[3];
		
		// correct selector
		selector = selector
			.replace(/id=/g, "#")
			.replace(/css=/g, "")
			.replace(/&gt;/g, ">")
			.replace(/&lt;/g, "<")
			.replace(/&quot;/g, "\"");
		params = val ? selector + "', '" + val : selector;

		// correct cmd
		cmd = cmd
			.replace(/waitForElementPresent/g, "waitForElement")
			.replace(/assertConfirmation/g, "assert.dialogText")
			.replace(/assertConfirmation/g, "assert.dialogText")
			.replace(/waitForNotVisible/g, 'waitFor(function () { return document.getElementById("' + selector.substr(1) + '").style.display == none;}, [], 10000) //')
			.replace(/assertEval/g, 'assert.ok("' + selector + ' == ' + val + '", "' + selector + ' == ' + val + '") //');
		
		command = "\t\t." + cmd + "('" + params + "')";
		rc += command + "\r\n";
	}
	
	return rc + "\r\n" + footer;
}
