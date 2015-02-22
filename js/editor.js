window.onload = function(){
	// localStorage wrapper
	store = new dataStorage();
	
	terrain = new Map();
	terrain.getQueryOptions();
	initOptions();
	terrain.preloadTiles(function(){
		terrain.generateTileCss();
		terrain.init();
	});
}

function Map(sizex, sizey) {
	var map = this;
	this.defaultTile = 'earth';
	this.borderTile = 'impenetrable';
	this.borderSize = 1;
	this.currentTile = 'dirt';
	this.minsize = 5;
	this.maxsize = 130;
	this.mapsizex = sizex || 20;
	this.mapsizey = sizey || 20;
	this.tiles = {};
	this.tileSizeDefault = 64;
	this.tileSize = store.getItem("tileSize") || this.tileSizeDefault;
	this.tileSizes = [24, 32, 48, 64];
	this.dragEnabled = false;
	this.assetDir = './tiles/';
	this.preloadImages = true;
	this.buttonColumns = 2;
	this.tileModeDefault = 'normal';
	this.tileMode = store.getItem("tileMode") || this.tileModeDefault;
	this.tileModes = [ /* 'lowres' not implemented ,*/ 'color', 'normal'/*, 'highres' not implemented */ ];
	this.mouseButton = {
		left: 0,
		middle: 1,
		right: 2
	};
	this.options = {
		"tileModes": {
			type: "select",
			option: "tileMode",
			postSave: "setTileMode"
		},
		"tileSizes": {
			type: "select",
			option: "tileSize",
			postSave: "setTileSize"
		}
	}

	var mapParent = document.getElementsByTagName('body')[0];

	this.getQueryOptions = function() {
		for (var item in map.options) {
			var option = map.options[item].option;
			var postSave = map.options[item].postSave;
			var match = location.search.match('(^\\?|&)'+option+'=([^\\?&=]+)');
			if (match) {
				map[postSave](match[2]);
			}
		}
	}
	
	// TODO: Implement to save dom operations
	this.setTileMode = function(tileMode) {
		if (map.tileModes.indexOf(tileMode) == -1) {
			console.error("The tilemode " + tileMode + " is not allowed!");
			return;
		}
		store.setItem("tileMode", tileMode);
		map.tileMode = tileMode;
		//map.generateTileCss();
	}
	
	// TODO: Implement to save dom operations
	this.setTileSize = function(tileSize) {
		if (map.tileSizes.indexOf(parseInt(tileSize)) == -1) {
			console.error("The tileSize " + parseInt(tileSize) + " is not allowed!");
			return;
		}
		store.setItem("tileSize", tileSize);
		map.tileSize = tileSize;
		// TODO: implement instant change of tilesize
	}
	
	this.resetToDefault = function() {
		for (var item in map.options) {
			var option = map.options[item].option;
			map[option] = map[option + "Default"];
		}
		terrain.generateTileCss();
	}
	
	this.generateTileCss = function() {
		var style = document.getElementById('tileCss') || document.createElement('style');
		style.id = 'tileCss';
		style.type = 'text/css';
		style.innerHTML = '';
		for (var item in tiles) {
			var posx = tiles[item].sizex;
			var posy = tiles[item].sizey;
			var css = '';
			switch (map.tileMode) {
				case "color":
					var css = ' { background-color: ' + tiles[item].color + '; }\n';
					break;
				default:
					var css = ' { background-image: url("' + map.assetDir + item + '.png"); }\n';
					break;
			}
			style.innerHTML += '/* ' + posx + ' x ' + posy + ' */\n';
			style.innerHTML += '.' + item + css;
		}
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	this.preloadTiles = function(callback) {
		var images = Object.keys(tiles);
		
		if (!images || !map.preloadImages || map.tileMode == "color") {
			// browser doesn't support this, so we just skip it
			callback.call(this);
			return;
		}
		var image = [], loadedImages=0;
		var start = new Date();
		var preloadDiv = document.getElementById("preload");
		var preloadMessage = preloadDiv.getAttribute("data-message");
		
		function imageLoaded(){
			loadedImages++;
			var loaded = new Date();
			// if the loading of one image takes longer than 100ms we show the preloading message
			if (loadedImages == 1 && loaded - start > 100) {
				preloadDiv.style.display = "block";
			}
			preloadDiv.firstChild.innerText = preloadMessage.replace(/\$1/g, loadedImages).replace(/\$2/g, images.length);
			if (loadedImages == images.length){
				preloadDiv.style.display = "none";
				callback.call(this);
			}
		}
		
		for (var i=0; i< images.length; i++){
			image[i] = new Image();
			image[i].src = map.assetDir + images[i] + '.png';
			image[i].onload=function(){
				imageLoaded();
			}
			image[i].onerror=function(){
				imageLoaded();
			}
		}
	}

	this.createButtons = function() {
		var toolBox = document.getElementById("toolBox");
		toolBox.setAttribute("class", "toolBox" + map.tileSize);
		toolBox.onmousemove = map.hideInfoBox;
		var info = document.getElementById("info");
		var buttons = document.createElement("div");
		buttons.id = "buttons";
		buttons.style.width = parseInt(map.tileSize * 3/4 * map.buttonColumns) + "px";
		
		for (var item in tiles) {
			var button = document.createElement("input");
			button.id = item;
			button.onclick = function () {
				map.setCurrentTile(this.id);
			}
			//button.value = item;
			button.type = "button";
			button.setAttribute("class", item + " tileButton");
			button.setAttribute("title", item);
			button.setAttribute("style", "background-size: " + parseInt(map.tileSize * 3/4) + "px; width: " + parseInt(map.tileSize * 3/4) + "px; height: " + parseInt(map.tileSize * 3/4) + "px");
			buttons.appendChild(button);
		}
		toolBox.insertBefore(buttons, info);
		toolBox.style.display = "block";
	}

	this.init = function(mapObject) {
		// only one map is allowed at the same time
		map.destroy();
		map.createButtons();
		
		var table = document.createElement("table");
		table.setAttribute('id', 'map');
		table.style.width = (map.mapsizex + (map.borderSize * 2)) * map.tileSize + "px";
		table.style.marginLeft = parseInt(map.tileSize * map.buttonColumns) + 30 + "px";
		table.style.marginTop = "10px";
		table.setAttribute('cellpadding', '0');
		table.setAttribute('cellspacing', '0');
		
		map.setHtml("mapsize", map.mapsizex + "x" + map.mapsizey);
		
		for (var i = 0; i < map.mapsizey + (map.borderSize * 2); i++) {		
			var tr = document.createElement("tr");
			tr.setAttribute('id', 'row_' + i);
			tr.setAttribute('style', 'height: ' + map.tileSize + 'px;');
			
			for (var k = 0; k < map.mapsizex + (map.borderSize * 2); k++) {
				var tile = document.createElement("td");
				tile.setAttribute('id', 'col_' + i + '_' + k);
				var roomTile = map.defaultTile;
				var isBorder = map.borderSize > 0 && i <= map.borderSize - 1 || k <= map.borderSize - 1 || i >= map.mapsizey + map.borderSize || k >= map.mapsizex + map.borderSize;
				var id = null;
				var row = null;
				var col = null;

				if (!isBorder) {
					// we don't want to listen to this events on the border
					tile.onmouseover = map.displayRoom;
					tile.onmouseout = map.resetRoom;
					tile.onmousedown = map.enableDrag;
					tile.onmouseup = map.disableDrag;
					tile.onmousemove = map.setRoomOnDrag;
					tile.onclick = map.setRoom;
				}
				
				if (isBorder) {
					// generate border
					var roomTile = map.borderTile;
					tile.onmousemove = map.hideInfoBox;
				} else if (mapObject && mapObject.map && mapObject.tileIds && mapObject.tiles) {
					// import map
					var cell = mapObject.map[i - map.borderSize][k - map.borderSize];
					roomTile = mapObject.tiles[cell["tile"]];
					row = cell["data-pos-y"];
					col = cell["data-pos-x"];
					id = !isNaN(cell["data-id"]) && mapObject.tileIds[cell["data-id"]] || null;
					if (id) {
						tile.setAttribute("data-id", id);
						if (row && col) {
							map.tiles[id] = map.tiles[id] || [];
							map.tiles[id].push("col_" + i + "_" + k );
							tile.setAttribute("data-pos-x", col);
							tile.setAttribute("data-pos-y", row);
						}
					}
				} else if (mapObject && (!mapObject.map || !mapObject.tileIds || !mapObject.tiles)) {
					throw new Error("Invalid map file!");
				}
				
				map.setTile(tile, roomTile, row, col);
				tr.appendChild(tile);
			}
			table.appendChild(tr);
		}
		mapParent.appendChild(table);
	}

	this.destroy = function() {
		map.tiles = {};
		// remove buttons
		var buttons = document.getElementById("buttons");
		buttons && buttons.parentNode.removeChild(buttons);
		
		var table = document.getElementById("map");
		if (table) {
			table.parentNode.removeChild(table);
			return true;
		} else {
			return false;
		}
	}

	this.import = function(mapString) {
		var mapObject = JSON.parse(mapString);
		if (!mapObject || !mapObject.map) {
			throw new Error("Not a valid Map!");
		}
		var rows = mapObject.map.length;
		var cols = mapObject.map[0].length;
		if (rows > 0 && cols > 0) {
			map.destroy();
			map.mapsizex = cols;
			map.mapsizey = rows;
			map.init(mapObject);
		} else {
			throw new Error("Not a valid Map!");
		}
	}

	this.export = function(author) {
		var json = map.mapToJson(author);
		var str = JSON.stringify(json);
		return str;
	}

	this.enableDrag = function(evt) {
		if (evt.button == map.mouseButton.left) {
			map.dragEnabled = true;
			map.insertTile(this, false, false);
		}
		return false;
	}

	this.disableDrag = function() {
		map.dragEnabled = false;
	}

	this.setRoomOnDrag = function(evt) {
		var infoBox = document.getElementById("infoBox");
		var left = evt.pageX + 20;
		var top = evt.pageY + 20;
		infoBox.style.top = top + "px";
		infoBox.style.left = left + "px";
		
		var height = infoBox.clientHeight;
		var width = infoBox.clientWidth;
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var pageOffsetX = window.pageXOffset;
		var pageOffsetY = window.pageYOffset;
		
		if (top + height > windowHeight + pageOffsetY - 10) {
			// at the bottom
			infoBox.style.top = top - height - 30 + "px";
		}
		
		if (left + width > windowWidth + pageOffsetX - 10) {
			// at the right
			infoBox.style.left = left - width - 30 + "px";
		}
		
		infoBox.style.display = "block";
		
		map.setHtml("tile", this.getAttribute("data-temp") || this.className);
	}
	
	this.hideInfoBox = function() {
		map.hideElement("infoBox");
	}

	this.resetRoom = function() {
		map.insertTile(this, false, true);
	}

	this.displayRoom = function(evt) {
		map.insertTile(this, true, false);
		
		// Info box
		map.setHtml("posx", this.cellIndex + 1 - map.borderSize);
		var posy = this.parentNode.rowIndex != -1 ? this.parentNode.rowIndex : this.parentNode.sectionRowIndex;
		map.setHtml("posy", posy + 1 - map.borderSize);
		
		// Drag and Drop
		var roomTile = tiles[map.currentTile];
		if (map.dragEnabled && roomTile.sizex * roomTile.sizey == 1) {
			map.insertTile(this, false, false);
		}
	}

	this.setRoom = function(evt) {
		// helper for selenium
		// console.log("<tr>\n\t<td>click</td>\n\t<td>id=" + this.id + "</td>\n\t<td></td>\n</tr>");
		if (evt.button == map.mouseButton.left) {
			map.insertTile(this, false, false);
		}
	}

	this.destroyRoom = function(id) {
		if (!id) {
			return;
		}
		var roomTileTiles = map.tiles[id] || [];
		delete map.tiles[id];
		for (var i = 0; i < roomTileTiles.length; i++) {
			var tile = document.getElementById(roomTileTiles[i]);
			map.setTile(tile, map.defaultTile);
			tile.removeAttribute('data-id');
			tile.removeAttribute('data-pos-x');
			tile.removeAttribute('data-pos-y');
		}
		
	}

	this.insertTile = function(tile, temp, reset) {
		var roomTile = tiles[map.currentTile];
		var tiley = parseInt(tile.id.split("_")[1]) + 1;
		var tilex = parseInt(tile.id.split("_")[2]) + 1;
		
		if (tilex > parseInt(roomTile.sizex / 2) + map.borderSize && tiley > parseInt(roomTile.sizey / 2) + map.borderSize){
			if (tilex <= map.mapsizex - parseInt(roomTile.sizex / 2) + map.borderSize && tiley <= map.mapsizey - parseInt(roomTile.sizey / 2) + map.borderSize) {
				var startNoY = parseInt((tiley - roomTile.sizey / 2));
				var startNoX = parseInt((tilex - roomTile.sizex / 2));
				var roomTileTiles = [];
				var id = new Date().getTime();
				
				for (var i = 0; i < roomTile.sizey; i++) {
					for (var k = 0; k < roomTile.sizex; k++) {
						var tile = document.getElementById("col_" + (startNoY + i) + "_" + (startNoX + k));
						
						if (!reset) {
							// Only add the roomTile if really set
							if (!temp) {
								// destroy the roomTile if one is already set
								// it's here because not only the middle tile is able to destroy a room
								map.destroyRoom(tile.getAttribute("data-id"));
								
								roomTileTiles.push(tile.id);
								// only set the unique id if the room is bigger than 1x1
								roomTile.sizey * roomTile.sizex != 1 && tile.setAttribute("data-id", id);
							}
							map.generateRoom(tile, i, k /*(i * roomTile.sizey) + k + 1*/, temp);
						} else {
							map.resetTile(tile);
							tile.style.opacity = "1";
							//tile.removeAttribute('data-id');
						}
					}
				}
				roomTileTiles.length > 0 ? map.tiles[id] = roomTileTiles : "";
			}
		}
	}

	this.resetTile = function(tile) {
		tile.hasAttribute('data-temp') && map.setTile(tile, tile.getAttribute('data-temp'));
		tile.hasAttribute('data-temp-pos') && map.setTilePosition(tile, tile.getAttribute('data-temp-pos'));
		tile.removeAttribute('data-temp');
		tile.removeAttribute('data-temp-pos');
	}

	this.mapToJson = function(author){
		var table = document.getElementById("map");
		var mapData = {
			version: "1.1",
			author: author || "",
			border: map.borderSize,
			tiles: [],
			tileIds: [],
			map: []
		}
		
		for (var i = map.borderSize; i < map.mapsizey + map.borderSize; i++) {

			var tableRow = table.rows[i];
			var colData = [];

			for (var j = map.borderSize; j < map.mapsizex + map.borderSize; j++) {
				var col = {};
				var tile = tableRow && tableRow.cells[j] || null;
				// if the counter exeeds the count, we just add empty cells
				// handy for the extend feature
				if (tile) {
					// make sure that non temporary tile is currently set
					map.resetTile(tile);
					
					var id = tile.getAttribute("data-id");
					var className = tile.getAttribute("class");
					var tileTypeId = mapData.tiles.indexOf(className);
					if (tileTypeId == -1) {
						// save tilename only once and make a reference
						mapData.tiles.push(className);
						tileTypeId = mapData.tiles.length - 1;
					}
					
					if (id) {
						// save unique room identifier and make a reference
						var tileId = mapData.tileIds.indexOf(id);
						if (tileId == -1) {
							mapData.tileIds.push(id);
							tileId = mapData.tileIds.length - 1;
						}
						col["data-id"] = tileId;
						col["data-pos-x"] = tile.getAttribute("data-pos-x");
						col["data-pos-y"] = tile.getAttribute("data-pos-y");
					}
				
					col["tile"] = tileTypeId;
				}
				
				colData.push(col);
			}

			mapData.map.push(colData);
		}
		return mapData;		
	}

	this.setTilePosition = function(tile, pos) {
		tile.style.backgroundPosition = pos;
	}

	this.getTilePosition = function(tile) {
		return tile.style.backgroundPosition;
	}

	this.setTile = function(tile, currentTile, row, col) {
		var roomTile = tiles[currentTile];
		tile.setAttribute("class", currentTile);
		tile.style.backgroundSize = parseInt(map.tileSize * roomTile.sizex) + "px " + parseInt(map.tileSize * roomTile.sizey)+ "px ";
		if (!isNaN(parseInt(row)) && !isNaN(parseInt(col))) {
			map.setTilePosition(tile, parseInt(-col * map.tileSize) + "px " + parseInt(-row * map.tileSize) + "px");
		}
	}

	this.generateRoom = function(tile, row, col, temp) {
		var roomTile = tiles[map.currentTile];
		var maxsize = roomTile.sizey * roomTile.sizex;
		tile.removeAttribute('data-temp');
		tile.removeAttribute('data-temp-pos');
		if (temp) {
			tile.setAttribute('data-temp', tile.getAttribute("class"));
			tile.setAttribute('data-temp-pos', map.getTilePosition(tile));
			tile.style.opacity = "0.7";
		} else {
			maxsize != 1 && tile.setAttribute("data-pos-x", col);
			maxsize != 1 && tile.setAttribute("data-pos-y", row);
			tile.style.opacity = "1";
		}
		map.setTile(tile, map.currentTile, row, col);
	}

	this.setCurrentTile = function(roomTile) {
		// helper for selenium
		// console.log("<tr>\n\t<td>click</td>\n\t<td>id=" + roomTile + "</td>\n\t<td></td>\n</tr>");
		map.currentTile = roomTile;
	}
	
	this.setHtml = function(id, html) {
		document.getElementById(id).innerHTML = html;		
	}
	
	this.hideElement = function(id) {
		document.getElementById(id).style.display = "none";	
	}

	/**
	 * Mirrors a part of the map to get a better
	 * @param mirrorType determines how the map should be mirrored
	 *					 It's the sum of the cellvalues in the option menu
	 * 		---------
	 * 		| 1 | 2 | 
	 * 		---------
	 * 		| 3 | 4 |
	 *		---------
	 */
	this.mirrorMap = function(mirrorType, reverse) {
		var mapObject = map.mapToJson();
		var cols = mapObject.map[0].length;
		var rows = mapObject.map.length;
		
		switch(mirrorType) {
			case 'first':
				// mirror 1 & 3 to 2 & 4
				map.mirrorPart(mapObject, 0, parseInt(cols / 2), 0, parseInt(rows), "vertical", reverse);
				// mirror 1 & 2 to 3 & 4
				map.mirrorPart(mapObject, 0, parseInt(cols), 0, parseInt(rows / 2), "horizontal", reverse);
				break;
			case 'second': // 1 & 2 to 3 & 4
				map.mirrorPart(mapObject, 0, parseInt(cols), 0, parseInt(rows / 2), "horizontal", reverse);
				break;
			case 'third': // 1 & 3 to 2 & 4
			default:
				map.mirrorPart(mapObject, 0, parseInt(cols / 2), 0, parseInt(rows), "vertical", reverse);
				break;
		}
		
		var str = JSON.stringify(mapObject);
		map.import(str);
	}

	this.mirrorPart = function(mapObject, x1, x2, y1, y2, type, reverse) {
		var uncompleteRooms = {};
		var copiedRooms = {};
		var players = [1, 2, 3, 4];
		var playerSearch = /_p[1-8]/g;
		var mirrorPlayer = {};
		
		// find uncomplete rooms (going through the mirror part)
		map.forEachCell(x1, x2, y1, y2, function(col, row) {
			var cell = mapObject.map[row][col];
			var tile = mapObject.tiles[cell["tile"]] || "";
			var ptile = tile.search(playerSearch);
			
			if (ptile != -1) {
				// We got player tiles, remove these from the potential list
				var pnum = tile.substr(ptile + 2);
				var pindex = players.indexOf(parseInt(pnum));
				pindex != -1 && players.splice(pindex, 1);
			}
			
			var tileId = mapObject.tileIds[cell["data-id"]];
			if (!tileId) {
				return;
			}
			var room = uncompleteRooms[tileId];
			if (!room) {
				// it's not in the list
				var sizex = tiles[tile].sizex;
				var sizey = tiles[tile].sizey;	
				uncompleteRooms[tileId] = {
					"size": sizex * sizey,
					"count": 1
				};
			} else {
				room.count++;
				if (room.count == room.size) {
					// the room is complete
					delete uncompleteRooms[tileId];
				}
			}
		});
		
		// mirror the part
		map.forEachCell(x1, x2, y1, y2, function(col, row) {
			// clone the mapobject cell
			var mirrorPart = JSON.parse(JSON.stringify(mapObject.map[row][col]));
			var posy = mirrorPart['data-pos-y'];
			var newPosy = 0;
			var posx = mirrorPart['data-pos-x'];
			var newPosx = 0;
			var newCol = map.mapsizex - 1 - col;
			var newHCol = reverse ? (x2 - 1 - col) : col;
			var newRow = map.mapsizey - 1 - row;
			var newVRow = reverse ? (y2 - 1 - row) : row;
			var tileIdHor = mapObject.tileIds[mapObject.map[newRow][newHCol]["data-id"]];
			var tileIdVert = mapObject.tileIds[mapObject.map[newVRow][newCol]["data-id"]];
			var tileIdMir = mapObject.tileIds[mirrorPart["data-id"]];
			var tileName = mapObject.tiles[mirrorPart['tile']] || "";
			
			if (type == "horizontal" && tileIdHor && tileIdHor in uncompleteRooms) {
				// an uncomplete room should not get mirrored, we keep the tiles
				return;
			} else if (type == "vertical" && tileIdVert && tileIdVert in uncompleteRooms){
				// the same as above in vertical mirror
				return;
			} else if (tileIdMir && tileIdMir in uncompleteRooms) {
				// see above
				return;
			} else {
				if (tileIdMir) {
					// room is mirrored, create a new id
					var newId = copiedRooms[tileIdMir];
					if (!newId) {
						// as most of it happens nearly instantly, add a custom number to it
						// otherwise the room ids aren´t unique anymore
						newId = copiedRooms[tileIdMir] = new Date().getTime() - parseInt(Math.random() * 3000000);
						mapObject.tileIds.push(newId.toString());
					}
					var dataId = mapObject.tileIds.indexOf(newId.toString());
					mirrorPart["data-id"] = dataId;
				}
				
				// is it a player tile?
				if (tileName.search(playerSearch) != -1) {
					// lets replace all player tiles
					var playerNumber = tileName.substr(tileName.search(playerSearch) + 2);
					var player = mirrorPlayer[playerNumber];
					if (!player) {
						player = mirrorPlayer[playerNumber] = players[0];
						// remove first entry
						players.splice(0, 1);
					}
					if (player) {
						var tileName = tileName.replace(playerSearch, "_p" + player);
						var tileId = mapObject.tiles.indexOf(tileName);
						if (tileId == -1) {
							mapObject.tiles.push(tileName);
							tileId = mapObject.tiles.length - 1;
						}
						mirrorPart['tile'] = tileId;
					}
					// if the player maximum is reached, just copy them. The user has to fix it by himself
				}
			}
			
			if (posx && posy) {
				// parse it to string, otherwise the import fails
				newPosx = (tiles[tileName].sizex - posx - 1).toString();
				newPosy = (tiles[tileName].sizey - posy - 1).toString();
			}
			
			if (type == "horizontal") {
				// fix tileposition
				if (reverse && posx){
					mirrorPart['data-pos-x'] = newPosx;
				}
				if (posy) {
					mirrorPart['data-pos-y'] = newPosy;
				}
				mapObject.map[newRow][newHCol] = mirrorPart;
			} else {
				// fix tileposition
				if (reverse && posy){
					mirrorPart['data-pos-y'] = newPosy;
				}
				if (posx) {
					mirrorPart['data-pos-x'] = newPosx;
				}
				mapObject.map[newVRow][newCol] = mirrorPart;
			}
		});
	}
	
	this.forEachCell = function(x1, x2, y1, y2, callback) {
		for (var row = y1; row < y2; row++){
			for (var col = x1; col < x2; col++){
				callback.call(this, col, row);
			}
		}
	}
}