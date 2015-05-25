var tileTable = {
	defaultValue: 'earth',
	map: {
		'gold': [
			'go',
			'0'
		],
		'dirt': [
			'di',
			'8'
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
			'wb',
			''
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
		]
	},
	
	getGoogleCsvValue: function ( value ) {
		return this.map[ value ][0];
	},
	
	getWFTOCsvValue: function ( value ) {
		return this.map[ value ][1];
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
}