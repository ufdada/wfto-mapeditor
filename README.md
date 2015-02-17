# wfto-mapeditor
This map editor should make it fairly easy to create and share maps for "War for the Overworld"

### Release 1.0
#### Features:
- Big rooms (bigger than 1x1) are getting destroyed if the user draws onto it.
- Export/Import of created Maps (Extension .wfto)
- Creating a Path by holding the left mousebutton and moving the mouse (Only works for 1x1 tiles)

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

#### Upcoming Features:
- [ ] Resizing of current Map
- [ ] GUI for custom tile size (default is now 64)
- [ ] Mirror map vertical/horizontal
- [ ] Low-Res version for slower connections
- [ ] Save Configuration with localStorage/Cookies
- [x] Preload tiles
- [x] Information of current tile
