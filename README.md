# wfto-mapeditor
This map editor should make it fairly easy to create and share maps for "War for the Overworld"

### Release 1.1
#### New Features:
- GUI for custom tile size (default is now 64)
- Mirror map vertical/horizontal
	- Reverse lets you mirror the map reverse (1 & 2 are mirrored to 3 (2) and 4 (1) instead of 3 (1) and 4 (2))
	- Extend Map lets you extend your map (You can use the whole map and then make it 4 times bigger with Mirror Option 1)
- Color version for slower connections
- Save Configuration with localStorage/Cookies
- Preload tiles
- Information of current tile

#### Known Issues:
- Bigger rooms are not shown if the cursor is too close the border (as they are not placeable anyway)
- Several placeholder tiles (like the ugly dungeon cores)
- Several missing tiles, like:
	- Shrine(s): 
		- Perception
	- Claimed player floor
	- Chasm
	- Hero Gate
	- Bridge(s)
		- Stone
		- Wood
	- Sand
	
### Release 1.0
#### Features:
- Big rooms (bigger than 1x1) are getting destroyed if the user draws onto it.
- Export/Import of created Maps (Extension .wfto)
- Creating a Path by holding the left mousebutton and moving the mouse (Only works for 1x1 tiles)

#### Upcoming Features:
- [ ] Resizing of current Map
