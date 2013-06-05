define( function( require, exports, module ) {
	
	var Vec3 = require( 'D3.Vec3' );

	function Triangle( v1, v2, v3 ){

	}

	Triangle.containsPoint = function( ) {

		var v1 = new Vec3( );

		return function ( point, a, b, c ) {

			var result = Triangle.barycoordFromPoint( point, a, b, c, v1 );

			return ( result.x( ) >= 0 ) && ( result.y( ) >= 0 ) && ( ( result.x( ) + result.y( ) ) <= 1 );

		};

	}( );

	Triangle.barycoordFromPoint = function( ) {

		var v0 = new Vec3( );
		var v1 = new Vec3( );
		var v2 = new Vec3( );

		return function ( point, a, b, c, optionalTarget ) {

			v0.sub( c, a );
			v1.sub( b, a );
			v2.sub( point, a );

			var dot00 = v0.dot( v0 );
			var dot01 = v0.dot( v1 );
			var dot02 = v0.dot( v2 );
			var dot11 = v1.dot( v1 );
			var dot12 = v1.dot( v2 );

			var denom = ( dot00 * dot11 - dot01 * dot01 );

			var result = optionalTarget || new Vec3( );

			if( denom == 0 ) {
				return result.val( -2, -1, -1 );
			}

			var invDenom = 1 / denom;
			var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
			var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

			return result.val( 1 - u - v, v, u );

		};

	}( );

	module.exports = Triangle;

} );