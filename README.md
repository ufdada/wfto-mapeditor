# wfto-mapeditor
This map editor should make it fairly easy to create and share maps for "War for the Overworld"

### Release 1.2
#### New Features:
- Drag and drop import of mapfiles
- Google CSV import

### Bugfixes:
- Overall visual improvement of tiles
- Add missing tiles
- Replace siegeshrine asset with correct siegeshrine and add defence parts shrine

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
	
### Release 1.0
#### Features:
- Big rooms (bigger than 1x1) are getting destroyed if the user draws onto it.
- Export/Import of created Maps (Extension .wfto)
- Creating a Path by holding the left mousebutton and moving the mouse (Only works for 1x1 tiles)

### Upcoming Features/Bugfixes:
- [ ] Resizing of current Map
- [ ] Rotate Mirror 1 Feature
- [ ] Undo/Redo
- [ ] Get rid of the position in the mapfile on bigger rooms and calculate it instead
- [ ] Name input field for files (with versioning)

### Known Issues:
- Bigger rooms are not shown if the cursor is too close the border (as they are not placeable anyway)

Special Thanks to:
- Marrados: for helping with the assets
