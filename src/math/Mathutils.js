define( function( require, exports, module ) {

	module.exports = Mathutils = { };

	Mathutils.deg2Rad = function ( degrees ) {

		return degrees * Mathutils.__d2r;

	};

	Mathutils.rad2Deg = function ( radians ) {

		return radians * Mathutils.__r2d;

	};
	
	Mathutils.__d2r =  Math.PI / 180;
	Mathutils.__r2d =  180 / Math.PI;

} );