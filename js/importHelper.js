tileTable = {
	defaultTile: 'earth',
	map: {
		'gold': [
			'go',
			'0'
		],
		'dirt': [
			'di',
			'8'
		],
		'earth': [
			'',
			'2'
		],
		'chasm': [
			'ch',
			'4'
		],
		'water': [
			'wa',
			'27'
		],
		'gateway': [
			'ga',
			'65'
		],
		'lava': [
			'la',
			'26'
		],
		'core_p1': [
			'co',
			'79'
		],
		'core_p2': [
			'co',
			'79'
		],
		'core_p3': [
			'co',
			'79'
		],
		'core_p4': [
			'co',
			'79'
		],
		'impenetrable': [
			'im',
			'1'
		],
		'brimstone': [
			'br',
			'6'
		],
		'sacred_earth': [
			'se',
			'5'
		],
		'stone_bridge': [
			'nb',
			'14'
		],
		'wood_bridge': [
			'nb',
			'13'
		],
		'natural_bridge': [
			'nb',
			'13'
		],
		'permafrost': [
			'pf',
			'3'
		],
		'sand': [
			'sa',
			'7'
		],
		'archiveshrine': [
			'sh',
			'128'
		],
		'goldshrine': [
			'sg',
			'71'
		],
		'siegeshrine': [
			'ss',
			'131'
		],
		'defencepartshrine': [
			'sd',
			'68'
		],
		'manashrine': [
			'sm',
			'125'
		],
		'perceptionshrine': [
			'sp',
			'122'
		],
		// Additional tiles beyond the google csv ones
		'claimed_earth_empire': [
			'cee',
			'10'
		],
		'claimed_floor_empire': [
			'cfe',
			'9'
		],
		'claimed_earth_p1': [
			'cep',
			'29'
		],
		'claimed_floor_p1': [
			'cfp',
			'28'
		],
		'claimed_earth_p2': [
			'cep',
			'29'
		],
		'claimed_floor_p2': [
			'cfp',
			'28'
		],
		'claimed_earth_p3': [
			'cep',
			'29'
		],
		'claimed_floor_p3': [
			'cfp',
			'28'
		],
		'claimed_earth_p4': [
			'cep',
			'29'
		],
		'claimed_floor_p4': [
			'cfp',
			'28'
		],
		'herogate': [
			'hg',
			'74'
		],
		// Beyond the terrain id table of marados
		'inhibitorshrine': [
			'si',
			'134'
		]
	},
	
	getGoogleCsvValue: function ( value ) {
		return this.getMapValue(value)[0];
	},
	
	getWFTOCsvValue: function ( value ) {
		return this.getMapValue(value)[1];
	},
	
	getMapValue: function ( value ) {
		return this.map[ value ] || this.map[ this.defaultTile ];
	},
	
	getEditorTilename: function ( value ) {
		var tilename = this.getKeyByValue( value );
		if ( !tilename ) {
			console.error("Tile " + value + " could not be converted! Falling back to default tile.");
			tilename = this.defaultTile;
		}
		return tilename;
	},
	
	getKeyByValue: function( value, map ) {
		var obj = map || this.map;
		for( var prop in  obj) {
			if( obj.hasOwnProperty( prop ) ) {
				if( obj[ prop ] === value ) {
					return prop;
				} else if (typeof obj[ prop ] == 'object') {
					var item = this.getKeyByValue(value, obj[ prop ]);
					if (item) {
						return prop;
					}
				}
			}
		}
	}
};