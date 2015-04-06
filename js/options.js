var invalidLetterRegex = /[^A-Za-z0-9\.\-\_\söüäÖÜÄ\(\)]/g;
var first = null, second = null, third = null, fourth = null, reverse =  null, extend =  null, versioning =  null, mapNameInput =  null, rotate = null, active = "", height = null; width = null;


function initOptions() {
	width = document.getElementById('width'),
	height = document.getElementById('height'),
	first = document.getElementById('first'),
	second = document.getElementById('second'),
	third = document.getElementById('third'),
	fourth = document.getElementById('fourth'),
	reverse = document.getElementById('reverse'),
	extend = document.getElementById('extend'),
	versioning = document.getElementById('versioning'),
	mapNameInput = document.getElementById("mapName");
	rotate = document.getElementById("rotate");

	resetMirror();
	
	width.value = terrain.mapsizex;
	height.value = terrain.mapsizey;

	versioning.checked = store.getItem("versioning") || false;

	extend.onchange = resetPreview;
	reverse.onchange = resetPreview;
	rotate.onchange = resetPreview;

	first.onmouseover = mirrorTable;
	second.onmouseover = mirrorTable;
	third.onmouseover = mirrorTable;
	fourth.onmouseover = mirrorTable;

	first.onmouseout = resetPreview;
	second.onmouseout = resetPreview;
	third.onmouseout = resetPreview;
	fourth.onmouseout = resetPreview;

	first.onclick = setActive;
	second.onclick = setActive;
	third.onclick = setActive;
	fourth.onclick = setActive;
}

function mirrorMap() {
	if (!active) {
		alert("Please choose a mirror type!");
		return;
	}
	var ok = confirm("This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?");
	// we extend the map
	if (!extend.disabled && extend.checked) {
		switch(active) {
			case 'first':
				terrain.mapsizex *= 2;
				terrain.mapsizey *= 2;
				break;
			case 'second':
				terrain.mapsizey *= 2;
				break;
			case 'third':
			/* falls through */
			default:
				terrain.mapsizex *= 2;
				break;
		}
	}
	if (ok) {
		var rev = !reverse.disabled ? reverse.checked : false;
		var rot = !rotate.disabled ? rotate.checked : false;
		terrain.mirrorMap(active, rev, rot);
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
			extend.disabled = "";
			reverse.disabled = "disabled";
			rotate.disabled = "";

			first.setAttribute("class", "active");
			second.innerHTML = '1';
			third.innerHTML = '1';
			fourth.innerHTML = '1';
			fourth.setAttribute("class", "mirrorBoth");

			if (!rotate.checked) {
				second.setAttribute("class", "mirrorHorizontal");
				third.setAttribute("class", "mirrorVertical");
			} else {
				second.setAttribute("class", "rotate90");
				third.setAttribute("class", "rotate270");
				// four keeps the same
				// fourth.setAttribute("class", "rotate180");
			}
			// both sides need to have the same size to work properly
			if (extend.checked && terrain.mapsizex !== terrain.mapsizey || !extend.checked && (terrain.mapsizex / 2 % 1 !== 0 || terrain.mapsizex / 2 !== terrain.mapsizey / 2)) {
				rotate.disabled = "disabled";
			}
			if (terrain.mapsizex * 2 > terrain.maxsize || terrain.mapsizey * 2 > terrain.maxsize) {
				extend.disabled = "disabled";
			}
			break;
		case 'second':
			extend.disabled = "";
			reverse.disabled = "";
			rotate.disabled = "disabled";

			first.setAttribute("class", "active");
			second.setAttribute("class", "active");

			if (store.localStorage) {
				third.innerHTML = '1';
				fourth.innerHTML = '2';
				if (reverse.checked) {
					third.parentNode.setAttribute("class", "mirrorBoth");
				} else {
					third.parentNode.setAttribute("class", "mirrorVertical");
				}
			} else {
				// ie fallback
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
			}
			if (terrain.mapsizey * 2 > terrain.maxsize) {
				extend.disabled = "disabled";
			}
			break;
		case 'third':
		/* falls through */
		default:
			extend.disabled = "";
			reverse.disabled = "";
			rotate.disabled = "disabled";

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
			if (terrain.mapsizex * 2 > terrain.maxsize) {
				extend.disabled = "disabled";
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
	extend.disabled = "";
	reverse.disabled = "";
	rotate.disabled = "";
	extend.disabled = "disabled";
	reverse.disabled = "disabled";
	rotate.disabled = "disabled";

	first.removeAttribute("class");
	second.innerHTML = '2';
	second.removeAttribute("class");
	third.innerHTML = '3';
	third.removeAttribute("class");
	fourth.innerHTML = '4';
	fourth.removeAttribute("class");

	third.parentNode.removeAttribute("class");
}

function newMap(sizex, sizey) {
	sizex = parseInt(document.getElementById("width").value);
	sizey = parseInt(document.getElementById("height").value);
	if (!isNaN(sizex) && !isNaN(sizey)) {
		if (sizex >= terrain.minsize && sizey >= terrain.minsize && sizex <= terrain.maxsize && sizey <= terrain.maxsize) {
			var images = terrain.images;
			terrain = new Map(sizex, sizey);
			terrain.images = images;
			terrain.init();
			terrain.deleteDraft();
		} else {
			alert("A valid map has to at least " + terrain.minsize + " by " + terrain.minsize + " and " + terrain.maxsize + " by " + terrain.maxsize + " max");
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
	// export as base64
	var data = btoa(terrain.exportData(author));

	var mapName = mapNameInput.value;
	if (mapName.length < 1 || mapName.match(invalidLetterRegex)) {
		alert("Invalid filename!");
		return;
	}
	if (versioning.checked) {
		mapName +=  "_" + terrain.version;
		terrain.updateVersion();
	}
	mapName += ".wfto";

	// Use the native blob constructor
	var blob = new Blob([data], {type: "application/octet-stream"});

	if (window.navigator.msSaveOrOpenBlob) {
		// IE
		window.navigator.msSaveOrOpenBlob(blob, mapName);
		return;
	}

	//Chrome
	var href = window.URL.createObjectURL(blob);

	var exportLink = document.getElementById("exportLink");
	exportLink.setAttribute("download", mapName);
	exportLink.setAttribute("href", href);
	exportLink.setAttribute("target", "_blank");
	exportLink.click();
	
	//terrain.deleteDraft();
	
	toggleOptions(false);
}

function exportImage() {
	var mapName = mapNameInput.value;
	if (mapName.length < 1 || mapName.match(invalidLetterRegex)) {
		alert("Invalid filename!");
		return;
	}
	if (versioning.checked) {
		mapName +=  "_" + terrain.version;
		//terrain.updateVersion();
	}
	mapName += ".png";
	var data = terrain.generateImageData();
	if (data !== null) {
		var byteString = atob(data.replace(/^data:.*,/, ''));
		// console.log(byteString);
		var buffer = new ArrayBuffer(byteString.length);
		var intArray = new Uint8Array(buffer);
		for (var i = 0; i < byteString.length; i++) {
			intArray[i] = byteString.charCodeAt(i);
		}
		
		var blob = new Blob([buffer], {type: "image/png"});
		
		if (window.navigator.msSaveOrOpenBlob) {
			// IE
			window.navigator.msSaveOrOpenBlob(blob, mapName);
			return;
		}

		//Chrome
		var href = window.URL.createObjectURL(blob);
		var exportLink = document.getElementById("exportLink");
		exportLink.setAttribute("download", mapName);
		exportLink.setAttribute("href", href);
		exportLink.setAttribute("target", "_blank");
		exportLink.click();
		toggleOptions(false);
	}
}

function importMap() {
	if (window.FileReader) {
		var files = document.getElementById("mapFile").files;

		if (files.length === 1) {
			if (files[0].name.match(invalidLetterRegex)) {
				alert("Invalid filename!");
				return;
			}

			var reader = new FileReader();
			reader.readAsText(files[0]);

			reader.onload = function(evt) {
				// map geladen
				try {
					terrain.resetRedoHistory();

					terrain.importData(atob(this.result));
					terrain.setFilename(files[0].name);
				} catch(e) {
					alert("Please select a valid map file.\n" + e.message);
					return;
				}
			};
		} else {
			alert("Please select a valid map file");
			return;
		}
	} else {
		alert('Your browser isn`t supported!');
		return;
	}
	toggleOptions(false);
}

function saveOptions() {
	// save terrain temporary
	var map = terrain.exportData();
	for (var item in terrain.options) {
		var element = document.getElementById(item);
		switch(element.nodeName.toLowerCase()) {
			case 'select':
				var value = element[element.selectedIndex].value;
				break;
		}
		// save it to local storage
		var option = terrain.options[item].option;
		store.setItem(option, value);
		terrain[option] = value;
		// execute post action
		// terrain[terrain.options[item].postSave](value);

	}
	// apply possible changes
	terrain.generateTileCss();
	terrain.importData(map);

	toggleOptions(false);
}

function resetOptions() {
	store.clear();
	/*for (var item in terrain.options) {
		var option = terrain[terrain.options[item].option + "Default"];
		// execute post action
		terrain[terrain.options[item].postSave](option);
	}*/
	var map = terrain.exportData();
	terrain.resetToDefault();
	terrain.importData(map);
	//terrain.saveDraft(map);
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

	setVersioning(document.getElementById("versioning"));
}

function toggleOptions(show) {
	var options = document.getElementById("options");
	options.style.display = show ? "block" : "none";

	if (show) {
		refreshOptions();
		document.getElementById("width").focus();
	}
}

function importCsv() {
	var files = document.getElementById("csv").files;

	if (files.length === 1) {

		if (files[0].name.match(invalidLetterRegex)) {
			alert("Invalid filename!");
			return;
		}

		var reader = new FileReader();
		reader.readAsText(files[0]);

		reader.onload = function(e) {
			terrain.importCsvData(this.result);
			terrain.setFilename(files[0].name, true);
		};
	} else {
		alert("Please select a valid map file");
	}
	toggleOptions(false);
}

function setVersioning(element) {
	store.setItem(element.id, element.checked);
	var mapVersion = document.getElementById("mapVersion");
	mapVersion.innerHTML = terrain.version;

	mapVersion.parentNode.style.display = element.checked ? "block" : "none";

}