function newMap(sizex, sizey) {
	sizex = parseInt(document.getElementById("width").value);
	sizey = parseInt(document.getElementById("height").value);
	if (!isNaN(sizex) && !isNaN(sizey)) {
		if (sizex >= 5 && sizey >= 5) {
			terrain = new Map(sizex, sizey);
			terrain.init();
		} else {
			alert("A valid map has to at least 5 by 5!");
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

function toggleOptions(show) {
	var options = document.getElementById("options");
	options.style.display = show ? "block" : "none";
	
	show && document.getElementById("width").focus();
}