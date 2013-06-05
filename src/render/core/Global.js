define( function( require, exports, module ) {

	var Global = {};

	Global.MAX_LIGHTS = 5;


	Global.wrapTypes = {
		MIRRORED_REPEAT	: 'mirroredRepeat',
		CLAMP_TO_EDGE	: 'clampToEdge',
		REPEAT			: 'repeat'
	};
	Global.drawTypes = {
		TRIANGLE_STRIP	: 'triangleStrip',
		TRIANGLES		: 'triangles',
		POINTS			: 'points'
	};


	Global.lightTypes = {
		NONE		: 0,
		AMBIENT		: 1,
		DIRECTIONAL	: 2,
		POINT		: 3
	};
	Global.shaderTypes = {
		VERTEX	: 'vertex',
		FRAGMENT: 'fragment'
	};
	Global.objectTypes = {
		OBJECT3D : 0,
		DISPLAY : 1,
		LIGHT : 2,
		MESH : 3,
		PARTICLE : 4,
		CSS3D : 5
	};
	Global.sideTypes = {
		FRONT : 0,
		BACK : 1,
		DOUBLE : 2
	};


	Global.checkValue = function( value, def ) {

		var returnValue = value;

		if( value === undefined || value === null ) {
			returnValue = def;
		}

		return returnValue;

	};
	Global.isBitSet = function( value, position ) {

		return value & ( 1 << position );

	};



	( function ( ) {

		var lastTime = 0;
		var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

		for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {

			window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
			window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

		}

		if ( window.requestAnimationFrame === undefined ) {

			window.requestAnimationFrame = function ( callback, element ) {

				var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
				var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
				lastTime = currTime + timeToCall;
				return id;

			};

		}

		window.cancelAnimationFrame = window.cancelAnimationFrame || function ( id ) { window.clearTimeout( id ) };

	}( ) );



	module.exports = Global;

} );