window.onload = function(){
	terrain = new Map();
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
	this.mapsizex = sizex || 20;
	this.mapsizey = sizey || 20;
	this.tiles = {};
	this.tileSize = 64;
	this.dragEnabled = false;
	this.assetDir = './tiles/';
	this.preloadImages = true;

	var mapParent = document.getElementsByTagName('body')[0];

	this.generateTileCss = function() {
		var style = document.createElement('style');
		style.type = 'text/css';
		for (var item in tiles) {
			var posx = tiles[item].sizex;
			var posy = tiles[item].sizey;
			style.innerHTML += '/* ' + posx + ' x ' + posy + ' */\n';
			style.innerHTML += '.' + item + ' { background-image: url("' + map.assetDir + item + '.png"); }\n';
		}
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	this.preloadTiles = function(callback) {
		var image = [], loadedImages=0;
		var images = Object.keys(tiles);
		var start = new Date();
		if (!images || !map.preloadImages) {
			// browser doesn't support this, so we just skip it
			callback.call(this);
			return;
		}
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
		var toolbox = document.getElementById("toolbox");
		var buttons = document.createElement("div");
		buttons.id = "buttons";
		buttons.style.width = parseInt(map.tileSize * 2) + "px";
		
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
		toolbox.appendChild(buttons);
		toolbox.style.display = "block";
	}

	this.init = function(mapObject) {
		// only one map is allowed at the same time
		map.destroy();
		map.createButtons();
		
		var table = document.createElement("table");
		table.setAttribute('id', 'map');
		table.setAttribute('style', "width: " + (map.mapsizex + (map.borderSize * 2)) * map.tileSize + "px");
		table.setAttribute('cellpadding', '0');
		table.setAttribute('cellspacing', '0');
		
		for (var i = 0; i < map.mapsizey + (map.borderSize * 2); i++) {		
			var tr = document.createElement("tr");
			tr.setAttribute('id', 'row_' + i);
			tr.setAttribute('style', 'height: ' + map.tileSize + 'px;');
			
			for (var k = 0; k < map.mapsizex + (map.borderSize * 2); k++) {
				var tile = document.createElement("td");
				tile.setAttribute('id', 'col_' + i + '_' + k);
				tile.onmouseover = map.displayRoom;
				tile.onmouseout = map.resetRoom;
				tile.onmousedown = map.enableDrag;
				tile.onmouseup = map.disableDrag;
				tile.onmousemove = map.setRoomOnDrag;
				tile.onclick = map.setRoom;
				var id = null;
				var row = null;
				var col = null;
				var roomTile = map.defaultTile;
				
				if (map.borderSize > 0 && i <= map.borderSize - 1 || k <= map.borderSize - 1 || i >= map.mapsizey + map.borderSize || k >= map.mapsizex + map.borderSize) {
					// generate border
					var roomTile = map.borderTile;
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

	this.import = function(base64) {
		var mapObject = JSON.parse(atob(base64));
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
		base64 = btoa(str);
		return base64;
	}

	this.enableDrag = function() {
		map.dragEnabled = true;
		return false;
	}

	this.disableDrag = function() {
		map.dragEnabled = false;
	}

	this.setRoomOnDrag = function() {
		var roomTile = tiles[map.currentTile];
		if (map.dragEnabled && roomTile.sizex * roomTile.sizey == 1) {
			map.insertTile(this, false, false);
		}
	}

	this.resetRoom = function() {
		map.insertTile(this, false, true);
	}

	this.displayRoom = function() {
		map.insertTile(this, true, false);
	}

	this.setRoom = function() {
		map.insertTile(this, false, false);
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
			version: "1.0",
			author: author || "",
			border: map.borderSize,
			tiles: [],
			tileIds: [],
			map: []
		}
		
		for (var i = map.borderSize; i < table.rows.length - map.borderSize; i++) {

			var tableRow = table.rows[i];
			var colData = [];

			for (var j = map.borderSize; j < tableRow.cells.length - map.borderSize; j++) {
				var col = {};
				var tile = tableRow.cells[j];
				// make sure that non temporäry tile is currently set
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
		map.currentTile = roomTile;
	}
}