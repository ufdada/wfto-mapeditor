function initOptions() {
	var first = document.getElementById('first');
	var second = document.getElementById('second');
	var third = document.getElementById('third');
	var fourth = document.getElementById('fourth');
	var reverse = document.getElementById('reverse');

	reverse.onchange = resetPreview;

	first.onmouseover = mirrorTable;
	second.onmouseover = mirrorTable;
	third.onmouseover = mirrorTable;

	first.onmouseout = resetPreview;
	second.onmouseout = resetPreview;
	third.onmouseout = resetPreview;

	first.onclick = setActive;
	second.onclick = setActive;
	third.onclick = setActive;

	active = "";
}

function mirrorMap() {
	var ok = confirm("This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?");
	if (ok) {
		terrain.mirrorMap(active, !reverse.disabled ? reverse.checked : false);
		toggleOptions(false);
	}
}

function setActive() {
	active = this.id;
}

function mirrorTable() {
	var type = this.id;
	resetMirror();
	mirrorPreview(type);
}

function mirrorPreview(type) {
	switch(type) {
		case 'first':
			first.setAttribute("class", "active");
			second.innerHTML = '1';
			second.setAttribute("class", "mirrorHorizontal");
			third.innerHTML = '1';
			third.setAttribute("class", "mirrorVertical");
			fourth.innerHTML = '1';
			fourth.setAttribute("class", "mirrorBoth");
			reverse.disabled = "disabled";
			break;
		case 'second':
			first.setAttribute("class", "active");
			second.setAttribute("class", "active");
			if (reverse.checked) {
				third.innerHTML = '2';
				third.setAttribute("class", "mirrorBoth");
				fourth.innerHTML = '1';
				fourth.setAttribute("class", "mirrorBoth");
			} else {
				third.innerHTML = '1';
				third.setAttribute("class", "mirrorVertical");
				fourth.innerHTML = '2';
				fourth.setAttribute("class", "mirrorVertical");
			}
			break;
		case 'third':
			first.setAttribute("class", "active");
			third.setAttribute("class", "active");
			if (reverse.checked) {
				second.innerHTML = '3';
				second.setAttribute("class", "mirrorBoth");
				fourth.innerHTML = '1';
				fourth.setAttribute("class", "mirrorBoth");
			} else {
				second.innerHTML = '1';
				second.setAttribute("class", "mirrorHorizontal");
				fourth.innerHTML = '3';
				fourth.setAttribute("class", "mirrorHorizontal");
			}
			break;
	}
}

function resetPreview(){
	resetMirror();
	
	if (active) {
		mirrorPreview(active);
	}
}

function resetMirror() {
	reverse.disabled = "";

	first.removeAttribute("class");
	second.innerHTML = '2';
	second.removeAttribute("class");
	third.innerHTML = '3';
	third.removeAttribute("class");
	fourth.innerHTML = '4';
	fourth.removeAttribute("class");
}

function newMap(sizex, sizey) {
	sizex = parseInt(document.getElementById("width").value);
	sizey = parseInt(document.getElementById("height").value);
	if (!isNaN(sizex) && !isNaN(sizey)) {
		if (sizex >= 5 && sizey >= 5 && sizex <= 130 && sizey <= 130) {
			terrain = new Map(sizex, sizey);
			terrain.init();
		} else {
			alert("A valid map has to at least 5 by 5 and 130 by 130 max");
			return;
		}
	} else {
		alert("Only numeric values are allowed!");
		return;
	}
	toggleOptions(false);
}

function exportMap() {
	// Maybe later
	var author = ''; //document.getElementById("author").value;
	var data = terrain.export(author);
	var mapName = "Map.wfto";

	// Use the native blob constructor
	var blob = new Blob([data], {type: "application/octet-stream"});
	
	if (window.navigator.msSaveOrOpenBlob) {
		// IE
		window.navigator.msSaveOrOpenBlob(blob, mapName);
		return;
	}
	
	//Chrome
	var href = window.URL.createObjectURL(blob);
	
	var exportButton = document.getElementById("export");
	exportButton.setAttribute("download", mapName);
	exportButton.setAttribute("href", href);
	exportButton.setAttribute("target", "_blank");
	toggleOptions(false);
}

function importMap() {
	if (window.FileReader) {
		var files = document.getElementById("mapFile").files;
		
		if (files.length == 1) {
			
			var reader = new FileReader();
			reader.readAsText(files[0]);
			
			reader.onload = function(e) {
				// map geladen
				terrain.import(this.result);
			}
		} else {
			alert("Please select a valid map file");
			return;
		}
	} else {
		alert('Your browser isn´t supported!');
		return;
	}
	toggleOptions(false);
}

function saveOptions() {
	// save terrain temporary
	var map = terrain.export();
	for (var item in terrain.options) {
		var element = document.getElementById(item);
		switch(element.nodeName.toLowerCase()) {
			case 'select':
				var value = element[element.selectedIndex].value;
				break;
		}
		// save it to local storage
		var option = terrain.options[item].option;
		localStorage.setItem(option, value);
		terrain[option] = value;
		// execute post action
		// terrain[terrain.options[item].postSave](value);

	}
	// apply possible changes
	terrain.generateTileCss();
	terrain.import(map);
	
	toggleOptions(false);
}

function resetOptions() {
	localStorage.clear();
	/*for (var item in terrain.options) {
		var option = terrain[terrain.options[item].option + "Default"];
		// execute post action
		terrain[terrain.options[item].postSave](option);
	}*/
	var map = terrain.export();
	terrain.resetToDefault();
	terrain.import(map);
	toggleOptions(false);
}

function refreshOptions() {
	var generalOptions = document.getElementById("generalOptions") || document.createElement("div");
	generalOptions.id = "generalOptions";
	var general = document.getElementById("general");
	var saveOptions = document.getElementById("saveOptions");
	generalOptions.innerHTML = "";
	for (var item in terrain.options) {
		var label = document.createElement("label");
		label["for"] = item;
		label.innerHTML = terrain.options[item].option + ": ";
		generalOptions.appendChild(label);
		var type = terrain.options[item].type;
		var optionvalue = terrain.options[item].option;
		switch (type) {
			case "select":
				var element = document.createElement("select");
				element.id = item;
				for (var i = 0; i < terrain[item].length; i++) {
					var option = document.createElement("option");
					option.innerHTML = terrain[item][i];
					option.value = terrain[item][i];
					
					// Set default to the label to mark the default value
					if(terrain[item][i] == terrain[optionvalue + "Default"]) {
						option.innerHTML = option.innerHTML + " (default)";
					}
					
					// Select the current value
					if (terrain[item][i] == terrain[optionvalue]) {
						option.selected = "selected";
					}
					element.appendChild(option);
				}
				break;
		}
		generalOptions.appendChild(element);
		generalOptions.appendChild(document.createElement("br"));
	}
	general.insertBefore(generalOptions, saveOptions);
}

function toggleOptions(show) {
	var options = document.getElementById("options");
	options.style.display = show ? "block" : "none";
	
	if (show) {
		refreshOptions();
		document.getElementById("width").focus();
	}
}