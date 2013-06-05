define( function( require, exports, module ) {

	var Vec3 = require( 'D3.Vec3' );

	function Ray( origin, direction ){

		this.val( ( origin !== undefined ) ? origin : new Vec3( ), ( direction !== undefined ) ? direction : new Vec3( ) );

	}

	Ray.prototype.val = function( origin, direction ){

		if( origin instanceof Vec3 && direction instanceof Vec3 ){

			this.origin ? this.origin.val( origin ) : this.origin = origin;
			this.direction ? this.direction.val( direction ) : this.direction = direction;

			return this;

		}else if( origin instanceof Ray && direction === undefined ){

			return this.val( origin.origin, origin.direction );

		}

	};

	Ray.prototype.at = function( t, optionalTarget ){

		var result = optionalTarget || new Vec3( );
		return result.val( this.direction ).multiply( t ).add( this.origin );

	};

	Ray.prototype.applyMat4 = function( mat4 ){

		this.direction.add( this.origin ).applyMat4( mat4 );
		this.origin.applyMat4( mat4 );
		this.direction.sub( this.origin );

		return this;

	};

	Ray.prototype.distance = function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	};

	Ray.prototype.distanceSquared = function ( v ) {

		var dx = this.x( ) - v.x( );
		var dy = this.y( ) - v.y( );
		var dz = this.z( ) - v.z( );

		return dx * dx + dy * dy + dz * dz;

	};

	Ray.prototype.distancePlane = function( plane ){

		var denominator = plane.normal.dot( this.direction );

		if ( denominator == 0 ) {

			if( plane.distancePoint( this.origin ) == 0 ) {

				return 0;

			}

			return undefined;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		return t;

	};

	Ray.prototype.distancePoint = function( ){

		var v1 = new Vec3( );

		return function ( point ) {

			var directionDistance = v1.sub( point, this.origin ).dot( this.direction );
			v1.val( this.direction ).multiply( directionDistance ).add( this.origin );

			return v1.distance( point );

		};

	}( );

	Ray.prototype.intersectionSphere = function( sphere ) {

		return ( this.distancePoint( sphere.center ) <= sphere.radius );

	};

	module.exports = Ray;

} );