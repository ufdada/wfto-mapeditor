window.onload = function(){
	// localStorage wrapper
	store = new dataStorage();

	terrain = new Map();
	terrain.phantomJs();
	terrain.getQueryOptions();
	initOptions();
	terrain.preloadTiles(function(images){
		terrain.images = images;
		terrain.generateTileCss();
		var draft = store.getItem("draft");
		if (draft && !terrain.isPhantom) {
			// var restoreDraft = confirm("There is a mapfile saved as draft, do you want to restore it?");
			// if (restoreDraft) {
				terrain.importData(draft);
				return;
			// } else {
				// terrain.deleteDraft();
			// }
		}
		terrain.init();
	});
};

function Map(sizex, sizey) {
	var map = this;
	this.images = [];
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
	this.assetDir = 'tiles';
	this.preloadImages = true;
	this.buttonColumns = 3;
	this.tileModeDefault = 'normal';
	this.tileMode = store.getItem("tileMode") || this.tileModeDefault;
	this.tileModes = [ 'color', 'lowres', 'normal' /*, 'highres' not implemented */ ];
	this.undoHistory = [];
	this.redoHistory = [];
	this.maxHistory = 30;
	this.dropTimeout = 0;
	this.version = "001";
	this.copiedFilenameRegex = /\s\([0-9]{1,}\)\./g;
	this.isPhantom = false;
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
	};
	this.operation = {
		before: ["shift", "unshift"],
		after: ["pop", "push"]
	};

	var mapParent = document.getElementsByTagName('body')[0];
	var dropMessage = document.getElementById("dropMessage");

	this.getQueryOptions = function() {
		for (var item in map.options) {
			var option = map.options[item].option;
			var postSave = map.options[item].postSave;
			var match = location.search.match('(^\\?|&)'+option+'=([^\\?&=]+)');
			if (match) {
				map[postSave](match[2]);
			}
		}
	};

	// TODO: Implement to save dom operations
	this.setTileMode = function(tileMode) {
		if (map.tileModes.indexOf(tileMode) == -1) {
			console.error("The tilemode " + tileMode + " is not allowed!");
			return;
		}
		store.setItem("tileMode", tileMode);
		map.tileMode = tileMode;
		//map.generateTileCss();
	};

	// TODO: Implement to save dom operations
	this.setTileSize = function(tileSize) {
		if (map.tileSizes.indexOf(parseInt(tileSize)) == -1) {
			console.error("The tileSize " + parseInt(tileSize) + " is not allowed!");
			return;
		}
		store.setItem("tileSize", tileSize);
		map.tileSize = tileSize;
		// TODO: implement instant change of tilesize
	};

	this.resetToDefault = function() {
		for (var item in map.options) {
			var option = map.options[item].option;
			map[option] = map[option + "Default"];
		}
		terrain.generateTileCss();
	};

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
					css = ' { background-color: ' + tiles[item].color + '; }\n';
					break;
				default:
					css = ' { background-image: url("img/' + map.assetDir  + "/" + map.tileMode + "/" + item + '.png"); }\n';
					break;
			}
			style.innerHTML += '/* ' + posx + ' x ' + posy + ' */\n';
			style.innerHTML += '.' + item + css;
		}
		style.innerHTML += '#resizeTable td { font-size: ' + (map.tileSize / 3) + 'px }\n';
		document.getElementsByTagName('head')[0].appendChild(style);
	};

	this.preloadTiles = function(callback) {
		var images = Object.keys(tiles);
		var image = {}, loadedImages=0;

		if (!images || !map.preloadImages || map.tileMode == "color") {
			// browser doesn't support this, so we just skip it
			callback.call(this, image);
			return;
		}

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
			preloadDiv.firstChild.innerHTML = preloadMessage.replace(/\$1/g, loadedImages).replace(/\$2/g, images.length);
			if (loadedImages == images.length){
				preloadDiv.style.display = "none";
				callback.call(this, image);
			}
		}

		for (var i=0; i< images.length; i++){
			image[images[i]] = new Image();
			image[images[i]].crossOrigin = "";
			image[images[i]].src = "img/" + map.assetDir + "/" + map.tileMode + "/" + images[i] + '.png';
			image[images[i]].onload = function(){
				imageLoaded();
			};
			image[images[i]].onerror = function(){
				imageLoaded();
			};
		}
	};

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
			};
			//button.value = item;
			button.type = "button";
			button.setAttribute("class", item + " tileButton");
			button.setAttribute("title", item);
			button.setAttribute("style", "background-size: " + parseInt(map.tileSize * 3/4) + "px; width: " + parseInt(map.tileSize * 3/4) + "px; height: " + parseInt(map.tileSize * 3/4) + "px");
			buttons.appendChild(button);
		}
		toolBox.insertBefore(buttons, info);
		toolBox.style.display = "block";
	};

	this.init = function(mapObject) {
		// only one map is allowed at the same time
		map.destroy();
		map.createButtons();
		map.version = "001";

		mapParent.ondrop = map.dropMap;
		mapParent.ondragover = map.dragOverMap;

		var table = document.createElement("table");
		table.setAttribute('id', 'map');
		table.style.width = (map.mapsizex + (map.borderSize * 2)) * map.tileSize + "px";

		var css = document.getElementById("tileCss");
		css.innerHTML += "#map { padding-top: 10px; margin-left: "+parseInt(map.tileSize * map.buttonColumns)+"px}";

		table.setAttribute('cellpadding', '0');
		table.setAttribute('cellspacing', '0');

		map.setHtml("mapsize", map.mapsizex + "x" + map.mapsizey);

		// saving the current col/row of a room
		var importedRooms = {};

		for (var row = 0; row < map.mapsizey + (map.borderSize * 2); row++) {
			var tr = document.createElement("tr");
			tr.setAttribute('id', 'row_' + row);
			tr.setAttribute('style', 'height: ' + map.tileSize + 'px;');

			for (var col = 0; col < map.mapsizex + (map.borderSize * 2); col++) {
				var tile = document.createElement("td");
				tile.innerHTML = "&nbsp;";
				tile.setAttribute('id', 'col_' + row + '_' + col);
				var roomTile = map.defaultTile;
				var isBorder = map.borderSize > 0 && row <= map.borderSize - 1 || col <= map.borderSize - 1 || row >= map.mapsizey + map.borderSize || col >= map.mapsizex + map.borderSize;
				var id = null;

				if (!isBorder) {
					// we don't want to listen to this events on the border
					tile.onmouseover = map.displayRoom;
					tile.onmouseout = map.resetRoom;
					tile.onmousedown = map.enableDrag;
					tile.onmouseup = map.disableDrag;
					tile.onmousemove = map.setRoomOnDrag;
					// disable it because it gets overwritten with mousedown
					// tile.onclick = map.setRoom;
				}

				if (isBorder) {
					// generate border
					roomTile = map.borderTile;
					tile.onmousemove = map.hideInfoBox;
				} else if (mapObject && mapObject.map && mapObject.tileIds && mapObject.tiles) {
					// import map
					var cell = mapObject.map[row - map.borderSize][col- map.borderSize];
					roomTile = mapObject.tiles[cell["tile"]];
					id = !isNaN(cell["data-id"]) && mapObject.tileIds[cell["data-id"]] || null;
					if (id) {
						tile.setAttribute("data-id", id);
						map.tiles[id] = map.tiles[id] || [];
						if (map.tiles[id].length === 0) {
							// mark the start point of a new room
							importedRooms[id] = { col: col, row: row };
						}
						map.tiles[id].push("col_" + row+ "_" + col );
						tile.setAttribute("data-pos-x", col - importedRooms[id].col);
						tile.setAttribute("data-pos-y", row - importedRooms[id].row);
					}
				} else if (mapObject && (!mapObject.map || !mapObject.tileIds || !mapObject.tiles)) {
					throw new Error("Invalid map file!");
				}

				map.setTile(tile, roomTile);
				tr.appendChild(tile);
			}
			table.appendChild(tr);
		}
		mapParent.appendChild(table);

		map.checkObsoleteRooms();
		map.setHistoryButtons();
	};

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
	};

	this.importData = function(mapString) {
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
			map.deleteDraft();
		} else {
			throw new Error("Not a valid Map!");
		}
	};

	this.exportData = function(author) {
		var json = map.mapToJson(author);
		if (json) {
			var str = JSON.stringify(json);
			return str;
		} else {
			return null;
		}
	};

	this.enableDrag = function(evt) {
		if (evt.button == map.mouseButton.left) {
			map.dragEnabled = true;
			map.insertTile(this, false, false);
		}
		return false;
	};

	this.disableDrag = function() {
		map.dragEnabled = false;
	};

	this.setRoomOnDrag = function(evt) {
		var infoBox = document.getElementById("infoBox");
		var left = evt.pageX + 20;
		var top = evt.pageY + 20;

		var height = infoBox.clientHeight;
		var width = infoBox.clientWidth;
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		var pageOffsetX = window.pageXOffset;
		var pageOffsetY = window.pageYOffset;

		if (top + height > windowHeight + pageOffsetY - 10) {
			// at the bottom edge
			infoBox.style.top = top - height - 30 + "px";
		} else {
			infoBox.style.top = top + "px";
		}

		if (left + width > windowWidth + pageOffsetX - 10) {
			// at the right edge
			infoBox.style.left = left - width - 30 + "px";
		} else {
			infoBox.style.left = left + "px";
		}

		infoBox.style.display = "block";

		map.setHtml("tile", this.getAttribute("data-temp") || this.className);
	};

	this.hideInfoBox = function() {
		map.hideElement("infoBox");
	};

	this.resetRoom = function() {
		map.insertTile(this, false, true);
	};

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
	};

	this.setRoom = function(evt) {
		// helper for selenium
		// console.log("<tr>\n\t<td>click</td>\n\t<td>id=" + this.id + "</td>\n\t<td></td>\n</tr>");
		if (evt.button == map.mouseButton.left) {
			map.insertTile(this, false, false);
		}
	};

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
	};

	this.insertTile = function(tile, temp, reset) {
		var roomTile = tiles[map.currentTile];
		var tiley = parseInt(tile.id.split("_")[1]) + 1;
		var tilex = parseInt(tile.id.split("_")[2]) + 1;

		if (!temp && !reset) {
			map.resetRedoHistory();
		}

		// that was used to restrict the room placement (so the user is not able to place rooms outside of the map). this is obsolete now!
		// if (tilex > parseInt(roomTile.sizex / 2) + map.borderSize && tiley > parseInt(roomTile.sizey / 2) + map.borderSize){
		//	if (tilex <= map.mapsizex - parseInt(roomTile.sizex / 2) + map.borderSize && tiley <= map.mapsizey - parseInt(roomTile.sizey / 2) + map.borderSize) {
				var startNoY = parseInt((tiley - roomTile.sizey / 2));
				startNoY = startNoY > map.borderSize ? startNoY : map.borderSize;
				startNoY = startNoY < map.mapsizey - roomTile.sizey  + map.borderSize ? startNoY : map.mapsizey - roomTile.sizey + map.borderSize;
				var startNoX = parseInt((tilex - roomTile.sizex / 2));
				startNoX = startNoX > map.borderSize ? startNoX : map.borderSize;
				startNoX = startNoX < map.mapsizex  - roomTile.sizex  + map.borderSize ? startNoX : map.mapsizex - roomTile.sizex + map.borderSize;
				var roomTileTiles = [];
				var id = new Date().getTime();

				for (var i = 0; i < roomTile.sizey; i++) {
					for (var k = 0; k < roomTile.sizex; k++) {
						tile = document.getElementById("col_" + (startNoY + i) + "_" + (startNoX + k));

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
		//	}
		//}
	};

	this.resetTile = function(tile) {
		var posx = tile.getAttribute('data-temp-pos-x');
		var posy = tile.getAttribute('data-temp-pos-y');
		if (posx && posy) {
			map.setTilePosition(tile, parseInt(-posx * map.tileSize) + "px " + parseInt(-posy * map.tileSize) + "px");
			tile.setAttribute("data-pos-x", posx);
			tile.setAttribute("data-pos-y", posy);
		}
		tile.hasAttribute('data-temp') && map.setTile(tile, tile.getAttribute('data-temp'));
		tile.removeAttribute('data-temp');
		tile.removeAttribute('data-temp-pos-x');
		tile.removeAttribute('data-temp-pos-y');
	};

	this.mapToJson = function(author){
		var table = document.getElementById("map");
		var mapData = {
			version: "1.5",
			author: author || "",
			border: map.borderSize,
			tiles: [],
			tileIds: [],
			map: []
		};

		if (table) {
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
						var tileTypeId = map.getMapTileId(mapData, className);

						if (id) {
							// save unique room identifier and make a reference
							var tileId = mapData.tileIds.indexOf(id);
							if (tileId == -1) {
								mapData.tileIds.push(id);
								tileId = mapData.tileIds.length - 1;
							}
							col["data-id"] = tileId;
						}

						col["tile"] = tileTypeId;
					}

					colData.push(col);
				}

				mapData.map.push(colData);
			}
			return mapData;
		} else {
			return null;
		}
	};

	this.setTilePosition = function(tile, pos) {
		tile.style.backgroundPosition = pos;
	};

	this.getTilePosition = function(tile) {
		return tile.style.backgroundPosition;
	};

	this.setTile = function(tile, currentTile) {
		var roomTile = tiles[currentTile];
		if (roomTile) {
			tile.setAttribute("class", currentTile);
			tile.style.backgroundSize = parseInt(map.tileSize * roomTile.sizex) + "px " + parseInt(map.tileSize * roomTile.sizey)+ "px ";
			if (roomTile.sizex * roomTile.sizey > 1) {
				var col = parseInt(tile.getAttribute("data-pos-x"));
				var row = parseInt(tile.getAttribute("data-pos-y"));
				if (!isNaN(col) && !isNaN(row)) {
					map.setTilePosition(tile, parseInt(-col * map.tileSize) + "px " + parseInt(-row * map.tileSize) + "px");
				} 
			} else {
				tile.removeAttribute("data-pos-x");
				tile.removeAttribute("data-pos-y");
			}
		} else {
			console.error("No tile found for "+ currentTile);
		}
	};

	this.generateRoom = function(tile, row, col, temp) {
		var roomTile = tiles[map.currentTile];
		var maxsize = roomTile.sizey * roomTile.sizex;
		tile.removeAttribute('data-temp');
		tile.removeAttribute('data-temp-pos-x');
		tile.removeAttribute('data-temp-pos-y');
		if (temp) {
			tile.setAttribute('data-temp', tile.getAttribute("class"));
			var posx = tile.getAttribute("data-pos-x");
			var posy = tile.getAttribute("data-pos-y");
			
			if (posx && posy) {
				tile.setAttribute('data-temp-pos-x', posx);
				tile.setAttribute('data-temp-pos-y', posy);
			}

			tile.setAttribute("data-pos-x", col);
			tile.setAttribute("data-pos-y", row);

			tile.style.opacity = "0.7";
		} else {
			maxsize != 1 && tile.setAttribute("data-pos-x", col);
			maxsize != 1 && tile.setAttribute("data-pos-y", row);
			tile.style.opacity = "1";
			map.saveDraft();
		}
		map.setTile(tile, map.currentTile);
	};

	this.setCurrentTile = function(roomTile) {
		// helper for selenium
		// console.log("<tr>\n\t<td>click</td>\n\t<td>id=" + roomTile + "</td>\n\t<td></td>\n</tr>");
		map.currentTile = roomTile;
	};

	this.setHtml = function(id, html) {
		document.getElementById(id).innerHTML = html;
	};

	this.hideElement = function(id) {
		document.getElementById(id).style.display = "none";
	};

	/**
	 * Mirrors a part of the map to get a better
	 * @param mirrorType determines how the map should be mirrored
	 *					 It's the sum of the cellvalues in the option menu
	 */
	this.mirrorMap = function(mirrorType, reverse, rotate) {
		map.resetRedoHistory();

		var mapObject = map.mapToJson();
		var cols = mapObject.map[0].length;
		var rows = mapObject.map.length;

		switch(mirrorType) {
			case 'first':
				// mirror 1 & 3 to 2 & 4
				map.mirrorPart(mapObject, cols, rows, rotate ? "rotate" : "vertical");
				// mirror 1 & 2 to 3 & 4
				map.mirrorPart(mapObject, cols, rows, "horizontal", rotate ? true : false);
				break;
			case 'second': // 1 & 2 to 3 & 4
				map.mirrorPart(mapObject, cols, rows, "horizontal", reverse);
				break;
			case 'third': // 1 & 3 to 2 & 4
			/* falls through */
			default:
				map.mirrorPart(mapObject, cols, rows, "vertical", reverse);
				break;
		}

		var mapData = JSON.stringify(mapObject);
		map.importData(mapData);
		map.saveDraft(mapData);
	};

	this.mirrorPart = function(mapObject, cols, rows, type, reverse) {
		var uncompleteRooms = {};
		var copiedRooms = {};
		var players = [1, 2, 3, 4];
		var playerSearch = /_p[1-8]/g;
		var mirrorPlayer = {};
		var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
		switch (type) {
			case "vertical":
				x2 = parseInt(cols / 2);
				y2 = parseInt(rows);
				break;
			case "horizontal":
				x2 = parseInt(cols);
				y2 = parseInt(rows / 2);
				break;
			case "rotate":
				x2 = parseInt(cols / 2);
				y2 = parseInt(rows / 2);
				break;
		}

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

			switch (type) {
				case "vertical":
					var newCol = map.mapsizex - 1 - col;
					var newVRow = reverse ? (y2 - 1 - row) : row;
					var tileIdVert = mapObject.tileIds[mapObject.map[newVRow][newCol]["data-id"]];
					break;
				case "horizontal":
					var newHCol = reverse ? (x2 - 1 - col) : col;
					var newRow = map.mapsizey - 1 - row;
					var tileIdHor = mapObject.tileIds[mapObject.map[newRow][newHCol]["data-id"]];
					break;
				case "rotate":
					var newRCol = y2 * 2 - 1 - row;
					var newRRow = col;
					var tileIdRot = mapObject.tileIds[mapObject.map[newRRow][newRCol]["data-id"]];
					break;
			}

			var tileIdMir = mapObject.tileIds[mirrorPart["data-id"]];
			var tileName = mapObject.tiles[mirrorPart['tile']] || "";

			if (tileIdHor && tileIdHor in uncompleteRooms) {
				// an uncomplete room should not get mirrored, we keep the tiles
				return;
			} else if (tileIdVert && tileIdVert in uncompleteRooms){
				// the same as above in vertical mirror
				return;
			} else if (tileIdRot && tileIdRot in uncompleteRooms){
				// the same as above in rotation
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
						tileName = tileName.replace(playerSearch, "_p" + player);
						var tileId = map.getMapTileId(mapObject, tileName);
						mirrorPart['tile'] = tileId;
					}
					// if the player maximum is reached, just copy them. The user has to fix it by himself
				}
			}

			switch(type) {
				case "vertical":
					mapObject.map[newVRow][newCol] = mirrorPart;
					break;
				case "horizontal":
					mapObject.map[newRow][newHCol] = mirrorPart;
					break;
				case "rotate":
					mapObject.map[newRRow][newRCol] = mirrorPart;
					break;
			}
		});
	};

	this.forEachCell = function(x1, x2, y1, y2, callback) {
		for (var row = y1; row < y2; row++){
			for (var col = x1; col < x2; col++){
				callback.call(this, col, row);
			}
		}
	};

	this.cancelDrop = function() {
		dropMessage.style.display = "none";
		clearTimeout(map.dropTimeout);
	};

	this.dragOverMap = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = "copy";

		clearTimeout(map.dropTimeout);
		map.dropTimeout = setTimeout(function(){ map.cancelDrop(); }, 200);

		dropMessage.style.display = "block";
	};

	this.dropMap = function(evt) {
		dropMessage.style.display = "none";

		evt.preventDefault();

		var dt = evt.dataTransfer;
		var files = dt.files;

		if(files && files.length !== 0) {
			var reader = new FileReader();
			var file = files[0];
			reader.readAsText(file);

			reader.onload = function(evt) {
				try {
					map.importData(atob(this.result));
					map.setFilename(file.name, false);
				} catch(e) {
					try {
						map.importCsvData(this.result);
						map.setFilename(file.name, true);
					} catch(exception) {
						alert("Could not load map.\n\n" + exception.message);
					}
				}
			};
		}
	};

	this.checkObsoleteRooms = function() {
		var tileIds = map.tiles;
		for (var tileId in tileIds) {
			var firstId = tileIds[tileId][0];
			var tile = document.getElementById(firstId);
			var tileName = tile.getAttribute("class");
			var size = tiles[tileName].sizex *  tiles[tileName].sizey;

			if (tileIds[tileId].length != size) {
				// room isn't complete, destroy it!
				map.destroyRoom(tileId);
			}
		}
	};

	this.getMapTileId = function(mapData, tileName) {
		var tileTypeId = mapData.tiles.indexOf(tileName);
		if (tileTypeId == -1) {
			// save tilename only once and make a reference
			mapData.tiles.push(tileName);
			tileTypeId = mapData.tiles.length - 1;
		}

		return tileTypeId;
	};

	this.changeColumn = function(mapData, position, add) {
		var mapArray = mapData.map;
		var operation = map.operation[position][add ? 1 : 0];

		var tileId = map.getMapTileId(mapData, map.defaultTile);

		// map size should not exceed the defined min/max size
		if (mapArray[0].length == map.minsize && !add || mapArray[0].length == map.maxsize && add) {
			return;
		}

		for (var i = 0; i < mapArray.length; i++) {
			mapArray[i][operation]({ tile: tileId });
		}
	};

	this.changeLine = function(mapData, position, add) {
		var mapArray = mapData.map;
		var operation = map.operation[position][add ? 1 : 0];

		var tileId = map.getMapTileId(mapData, map.defaultTile);

		// map size should not exceed the defined min/max size
		if (mapArray.length == map.minsize && !add || mapArray.length == map.maxsize && add) {
			return;
		}

		var cols = [];
		for (var i = 0; i < mapArray[0].length; i++) {
			cols.push({ tile: tileId });
		}
		mapArray[operation](cols);
	};

	this.changeMap = function(dir, add) {
		var mapObject = map.mapToJson();
		var position = "after";

		map.resetRedoHistory();
		map.saveUndoHistory();

		switch(dir) {
			case 'top':
				position = "before";
				/* falls through */
			case 'bottom':
				map.changeLine(mapObject, position, add);
				break;
			case 'left':
				position = "before";
				/* falls through */
			case 'right':
				map.changeColumn(mapObject, position, add);
				break;
		}

		var mapData = JSON.stringify(mapObject);
		map.importData(mapData);
		map.saveDraft(mapData);

		return false;
	};

	this.saveUndoHistory = function() {
		var mapData = map.exportData();
		var history = map.undoHistory;
		if (history.length === 0 || mapData != history[history.length - 1]) {
			history.push(mapData);
		}
		if (history.length > map.maxHistory) {
			history.shift();
		}
		map.setHistoryButtons();
	};

	this.saveRedoHistory = function() {
		var mapData = map.exportData();
		var history = map.redoHistory;
		if (history.length === 0 || mapData != [0]) {
			history.unshift(mapData);
		}
		if (history.length > map.maxHistory) {
			history.pop();
		}
		map.setHistoryButtons();
	};

	this.resetRedoHistory = function() {
		map.redoHistory = [];
		map.saveUndoHistory();
		map.setHistoryButtons();
	};

	this.undo = function() {
		if (map.undoHistory.length > 0) {
			map.saveRedoHistory();

			var mapData = map.undoHistory.pop();
			map.importData(mapData);
			map.saveDraft(mapData);
			return true;
		} else {
			return false;
		}
	};

	this.redo = function() {
		if (map.redoHistory.length > 0) {
			map.saveUndoHistory();

			var mapData = map.redoHistory.shift();
			map.importData(mapData);
			map.saveDraft(mapData);
			return true;
		} else {
			return false;
		}
	};

	this.setHistoryButtons = function() {
		var undo = document.getElementById("undo");
		var redo = document.getElementById("redo");

		undo.disabled = map.undoHistory.length > 0 ? "" : "disabled";
		redo.disabled = map.redoHistory.length > 0 ? "" : "disabled";
	};
	
	this.importCsvData = function(csvdata) {
		var bordersize = parseInt(document.getElementById("csvborder").value) || 3;
		var calcRooms = [];
		var usedCores = [];
		var mapData = {
			version: "1.5",
			author: "",
			border: 1,
			tiles: [],
			tileIds: [],
			map: []
		};

		var rows = csvdata.split("\n");
		if (rows.length > bordersize * bordersize) {
			for (var i = bordersize; i < rows.length - bordersize; i++) {
				var rowData = [];
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

					var tileTypeId = terrain.getMapTileId(mapData, tileName);
					cell["tile"] = tileTypeId;
					rowData.push(cell);
				}
				mapData.map.push(rowData);
			}

			for (var k = 0; k < calcRooms.length; k++) {
				var y = calcRooms[k][0];
				var x = calcRooms[k][1];
				var tileId = mapData.map[y][x]['tile'];
				var tile = mapData.tiles[tileId];
				// There is no tile left or above it, so lets create a new room
				if (isNaN(parseInt(mapData.map[y][x]['data-id'])))
				{
					// new room
					var id = new Date().getTime() - parseInt(Math.random() * 3000000).toString();
					mapData.tileIds.push(id);
					var roomTile = tiles[tile];
					var coreTile = '';

					var match = tile.match(/core_p([1-8])/);
					if (match) {
						var player = parseInt(match[1]);
						if (usedCores.indexOf(player) != -1 && player < 5) {
							player = usedCores.length + 1;
							tile = tile.replace(/_p([1-8])/, "_p" + player);
							mapData.tiles.push(tile);
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
			terrain.resetRedoHistory();
			terrain.importData(JSON.stringify(mapData));
		} else {
			alert("Please select a valid map file");
			return;
		}
	};

	this.fixFilename = function(filename) {
		filename = filename.replace(map.copiedFilenameRegex, ".");
		return filename;
	};

	this.setFilename = function(filename, noVersion) {
		var mapName = map.fixFilename(filename);
		mapName = mapName.substr(0, mapName.lastIndexOf("."));
		var versioning = document.getElementById('versioning');
		var mapNameInput = document.getElementById("mapName");

		if (!noVersion) {
			var versionIndex = mapName.lastIndexOf("_");
			var version = parseInt(mapName.substr(-3));

			if (versionIndex !== -1 && !isNaN(version)) {
				versioning.checked = true;
				map.updateVersion(version);
				mapName = mapName.substr(0, versionIndex);
			} else {
				versioning.checked = false;
			}
		}

		mapNameInput.value = mapName;
	};
	
	this.saveDraft = function(mapData) {
		mapData = mapData || map.exportData();
		
		if (store.localStorage && mapData && mapData.length < store.remainingSpace / 2) {
			store.removeItem("draft");
			store.setItem("draft", mapData);
		}
	};
	
	this.deleteDraft = function() {
		store.removeItem("draft");
	};
	
	this.phantomJs = function() {
		// phantom js workarround
		if (window.navigator.userAgent.indexOf("PhantomJS") != -1) {
			// Workarround for phantomjs, otherwise confirm/alert messages break tests
			window.confirm = function(text){
				//'This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?'
				return true;
			};
			window.alert = function(text){
				//'This recalculates the whole map and may remove some of your changes. Are you sure you want to continue?'
				return true;
			};
			map.isPhantom = true;
		}
	};

	this.updateVersion = function(version) {
		var oldVersion = version || map.version;
		var newVersion = "00" + (parseInt(oldVersion) + 1);
		newVersion = newVersion.substring(-3);
		map.version = newVersion;

		return newVersion;
	};
	
	this.generateImageData = function() {
		try {
			var canvas = document.createElement("canvas");
			canvas.width = map.tileSize * map.mapsizex + map.tileSize * (map.borderSize * 2);
			canvas.height = map.tileSize * map.mapsizey + map.tileSize * (map.borderSize * 2);
			var context = canvas.getContext("2d");
			var noPreload = Object.keys(map.images).length === 0;
			var tileSize = map.tileSize;

			for(var rows = 0; rows < map.mapsizey + map.borderSize * 2; rows++) {
				for(var cols = 0; cols < map.mapsizex + map.borderSize * 2; cols++) {
					var tile = document.getElementById("col_" + rows + "_" + cols);
					var image = null;
					if (noPreload) {
						var url = window.getComputedStyle(tile, false).backgroundImage.replace(/url\("?([^\)]+)"?\)/, "$1");
						image = document.createElement("img");
						image.crossOrigin = "";
						image.src = url;
					} else {
						image = map.images[tile.getAttribute("class")];
					}
					//setTimeout(function(tile, tileSize, image, cols, rows) {
						context.drawImage(image, tile.getAttribute("data-pos-x") * tileSize, tile.getAttribute("data-pos-y") * tileSize, tileSize, tileSize, cols * tileSize, rows * tileSize, tileSize, tileSize); 
					//}, 300, tile, map.tileSize, image, cols, rows);
				}
			}

			return canvas.toDataURL();
		} catch (e) {
			alert("Image could not be generated. " + e.message);
			console.error(e.stack);
			return null;
		}
	};
	
	this.generateSVG = function(){
		var canvas = document.getElementById("previewCanvas");
		var ctx = canvas.getContext("2d");
		var width = map.tileSize * map.mapsizex + map.tileSize * (map.borderSize * 2);
		var height = map.tileSize * map.mapsizey + map.tileSize * (map.borderSize * 2);
		
		var data =
			"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 " + width + " " + height + "' width='250' height='250'>" +
				"<style>" +
				document.getElementById("tileCss").innerHTML +
				"</style>" +
				"<foreignObject width='100%' height='100%'>" +
				"<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:40px'>" +
				document.getElementById("map").outerHTML
					.replace(/&nbsp;/g, "31")
					.replace(/id=\"([^\"]+)\"/g,"id=\"svg$1\"") +
				"</div>" +
				"</foreignObject>" +
			"</svg>";	
		document.getElementById("preview").innerHTML = data;
	};
}
