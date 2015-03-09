var invalidLetterRegex = /[^A-Za-z0-9\.\-\_\söüäÖÜÄ]/g;

function initOptions() {
	first = document.getElementById('first');
	second = document.getElementById('second');
	third = document.getElementById('third');
	fourth = document.getElementById('fourth');
	reverse = document.getElementById('reverse');
	extend = document.getElementById('extend');
	versioning = document.getElementById('versioning');
	mapNameInput = document.getElementById("mapName");

	reverse.checked = "";
	extend.checked = "";
	
	versioning.checked = store.getItem("versioning") || false;
	
	reverse.onchange = resetPreview;

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

	active = "";
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
			default:
				terrain.mapsizex *= 2;
				break;
		}
	}
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
			if (terrain.mapsizex * 2 > terrain.maxsize || terrain.mapsizey * 2 > terrain.maxsize) {
				extend.disabled = "disabled";
			}
			break;
		case 'second':
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
		default:
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
	reverse.disabled = "";
	extend.disabled = "";

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
			terrain = new Map(sizex, sizey);
			terrain.init();
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
	var data = btoa(terrain.export(author));
	var mapName = mapNameInput.value;
	if (mapName.length < 1 || mapName.match(invalidLetterRegex)) {
		alert("Invalid filename!");
		return;
	}
	mapName += versioning.checked ? "_" + terrain.version : "";
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
			if (files[0].name.match(invalidLetterRegex)) {
				alert("Invalid filename!");
				return;
			}
			
			var reader = new FileReader();
			reader.readAsText(files[0]);
			
			reader.onload = function(e) {
				// map geladen
				try {
					terrain.import(atob(this.result));
					
					var name = files[0].name.split(".")[0];
					
					var versionIndex = name.lastIndexOf("_");
					var version = parseInt(name.substr(versionIndex + 1, 3));
					
					if (versionIndex !== -1 && !isNaN(version)) {
						versioning.checked = true;
						var newVersion = "00" + (version + 1);
						terrain.version = newVersion.substring(newVersion.length - 3);
						name = name.substr(0, versionIndex);
					}
					
					mapNameInput.value = name;
				} catch(e) {
					alert("Please select a valid map file.\n" + e.message);
					return;
				}
			}
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
		store.setItem(option, value);
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
	store.clear();
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
	var bordersize = parseInt(document.getElementById("csvborder").value) || 3;
	
	if (files.length == 1) {
		
		if (files[0].name.match(invalidLetterRegex)) {
			alert("Invalid filename!");
			return;
		}
		
		var reader = new FileReader();
		reader.readAsText(files[0]);
		
		var mapName = files[0].name;
		mapName = mapName.substr(0, mapName.lastIndexOf("."));
		mapNameInput.value = mapName;
		
		reader.onload = function(e) {
			var calcRooms = [];
			var usedCores = [];
			var mapData = {
				version: "1.3",
				author: "",
				border: 1,
				tiles: [],
				tileIds: [],
				map: []
			}

			var rows = this.result.split("\n");
			if (rows.length > bordersize * bordersize) {
				for (var i = bordersize; i < rows.length - bordersize; i++) {
					var rowData = []
					var cells = rows[i].split(",");
					
					for (var j = bordersize; j < cells.length - bordersize; j++) {
						var tileName = "";
						var cell = {};
						switch(cells[j].substring(0,2)) {
							case 'go':
								tileName = "gold";
								break;
							case 'di':
								tileName = "dirt";
								break;
							case 'ch':
								tileName = "chasm";
								break;
							case 'wa':
								tileName = "water";
								break;
							case 'ga':
								tileName = "gateway";
								break;
							case 'la':
								tileName = "lava";
								break;
							case 'co':
								tileName = "core_p1";
								break;
							case 'im':
								tileName = "impenetrable";
								break;
							case 'br':
								tileName = "brimstone";
								break;
							case 'se':
								tileName = "sacred_earth";
								break;
							case 'nb':
								tileName = "stone_bridge";
								break;
							case 'pf':
								tileName = "permafrost";
								break;
							case 'sa':
								tileName = "sand";
								break;
							case 'sh':
								tileName = "archiveshrine";
								break;
							case 'sg':
								tileName = "goldshrine";
								break;
							case 'ss':
								tileName = "siegeshrine";
								break;
							case 'sd':
								tileName = "defencepartshrine";
								break;
							case 'sm':
								tileName = "manashrine";
								break;
							case 'sp':
								tileName = "perceptionshrine";
								break;
							case '':
								tileName = "earth";
								break;
							default:
								console.error("Tile " + cells[j] + " could not be converted!");
								tileName = "earth";
						}
						
						var tileConfig = tiles[tileName];
						if (tileConfig && tileConfig.sizex * tileConfig.sizey > 1) {
							calcRooms.push([i - bordersize, j - bordersize]);
						}
						
						var tileTypeId = mapData.tiles.indexOf(tileName);
						if (tileTypeId == -1) {
							// save tilename only once and make a reference
							mapData.tiles.push(tileName);
							tileTypeId = mapData.tiles.length - 1;
						}
						cell["tile"] = tileTypeId;
						rowData.push(cell);
					}
					mapData.map.push(rowData);
				}
				
				for (var k = 0; k < calcRooms.length; k++) {
					var y = calcRooms[k][0];
					var x = calcRooms[k][1];
					var tileId = mapData.map[y][x]['tile'];
					var tileName = mapData.tiles[tileId];
					// There is no tile left or above it, so lets create a new room
					if (isNaN(parseInt(mapData.map[y][x]['data-id'])))
					{
						// new room
						var id = new Date().getTime() - parseInt(Math.random() * 3000000).toString();
						mapData.tileIds.push(id);
						var roomTile = tiles[tileName];
						var coreTile = '';
						
						var match = tileName.match(/core_p([1-8])/);
						if (match) {
							var player = parseInt(match[1]);
							if (usedCores.indexOf(player) != -1 && player < 5) {
								player = usedCores.length + 1;
								tileName = tileName.replace(/_p([1-8])/, "_p" + player)
								mapData.tiles.push(tileName);
								tileId = mapData.tiles.length - 1;
							}
							usedCores.push(player);
						}
						
						for (var posy = 0; posy < roomTile.sizey; posy++) {
							for (var posx = 0; posx < roomTile.sizex; posx++) {
								mapData.map[y + posy][x + posx]['tile'] = tileId;
								mapData.map[y + posy][x + posx]['data-id'] = mapData.tileIds.length - 1;
							}
						}
					}
				}
				terrain.import(JSON.stringify(mapData));
			} else {
				alert("Please select a valid map file");
				return;
			}
		}
	} else {
		alert("Please select a valid map file");
	}
	toggleOptions(false);
}

function setVersioning(element) {
	store.setItem(element.id, element.checked);
	var mapVersion = document.getElementById("mapVersion");
	mapVersion.innerText = terrain.version;
	
	mapVersion.parentNode.style.display = element.checked ? "block" : "none";
	
}