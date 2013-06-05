define( function( require, exports, module ) {

	var Vec3 = require( 'D3.Vec3' );

	function Sphere( center, radius ){

		this.center = ( center !== undefined ) ? center : new Vec3( );
		this.radius = ( radius !== undefined ) ? radius : 0;
		
	}

	Sphere.prototype.val = function( center, radius ){

		this.center.val( center );
		this.radius = radius;

		return this;

	};

	Sphere.prototype.setFromCenterAndPoints = function( center, points ){
		
		var maxRadiusSq = 0;

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			var radiusSq = center.distanceSquared( points[ i ] );
			maxRadiusSq = Math.max( maxRadiusSq, radiusSq );

		}

		this.center = center;
		this.radius = Math.sqrt( maxRadiusSq );

		return this;

	};

	module.exports = Sphere;

} );