﻿# wfto-mapeditor
This map editor should make it fairly easy to create and share maps for "War for the Overworld"
[![Build Status](https://travis-ci.org/ufdada/wfto-mapeditor.svg)](https://travis-ci.org/ufdada/wfto-mapeditor)

Just go to http://ufdada.github.io/wfto-mapeditor/ to start mapping!

### Release 1.4
#### New Features:
- Undo / Redo actions
- Lowres tile mode

#### Bugfixes:
- Firefox didn't display the preload message correctly
- Hide infobox when hovering the options

### Release 1.3
#### New Features:
- Name input field for files (with versioning)
- Rotate Mirror 1 Feature
- Resizing of current Map

#### Improvements:
- Get rid of the position in the mapfile on bigger rooms and calculate it instead (saves filesize)
- Map gets cleaned from uncompleted rooms

### Release 1.2
#### New Features:
- Drag and drop import of mapfiles
- Google CSV import

#### Bugfixes:
- Overall visual improvement of tiles
- Add missing tiles
- Replace siegeshrine asset with correct siegeshrine and add defence parts shrine
- Improve mirror visual for internet explorer

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

### Special Thanks to:
- **Marados**: for helping with the assets
