function convertTests() {
	var testnameRegex = /<thead><tr><td[^>]+>([^<]+)+.*/;
	var testRegex = /<tr><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)?<\/td><\/tr>/g;

	content = content.replace(/[\r\n\t]/g, "");

	var testName = content.match(testnameRegex)[1];
	rc = testName + "\r\n";
	while (tests = testRegex.exec(content)){
		var cmd = tests[1];
		var selector = tests[2];
		var val = tests[3];
		
		// correct selector
		selector = selector
			.replace(/id=/g, "#")
			.replace(/css=/g, "")
			.replace(/&gt;/g, ">")
			.replace(/&lt;/g, "<");
		params = val ? selector + "', '" + val : selector;

		// correct cmd
		cmd = cmd
			.replace(/waitForElementPresent/g, "waitForElement")
			.replace(/assertConfirmation/g, "assert.dialogText")
			.replace(/assertConfirmation/g, "assert.dialogText")
			.replace(/waitForNotVisible/g, 'waitFor(function () { return document.getElementById("' + selector.substr(1) + '").style.display == none;}, [], 10000) //')
			.replace(/assertEval/g, 'assert.ok("' + selector + ' == ' + val + '", "' + selector + ' == ' + val + '") //');
		
		command = "." + cmd + "('" + params + "')";
		rc += command + "\r\n";
	}
	
	return rc;
}

convertTests();
