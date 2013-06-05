define( function( require, exports, module ) {

	function Vec4( x, y, z, w ){

		this.array = new Float32Array( 4 )
		this.set( x || 0, y || 0, z || 0, w === undefined ? 1 : w );
    
	}



	Vec4.prototype.x = function( x ){

		if( x === undefined ){
			return this.array[ 0 ];
		}else{
			this.array[ 0 ] = x;
			return this;
		}

	};
	Vec4.prototype.y = function( y ){

		if( y === undefined ){
			return this.array[ 1 ];
		}else{
			this.array[ 1 ] = y;
			return this;
		}

	};
	Vec4.prototype.z = function( z ){

		if( z === undefined ){
			return this.array[ 2 ];
		}else{
			this.array[ 2 ] = z;
			return this;
		}

	};
	Vec4.prototype.w = function( w ){

		if( w === undefined ){
			return this.array[ 3 ];
		}else{
			this.array[ 3 ] = w;
			return this;
		}

	};



	Vec4.prototype.r = function( r ){

		return this.x( r );

	};
	Vec4.prototype.g = function( g ){

		return this.y( g );

	};
	Vec4.prototype.b = function( b ){

		return this.z( b );

	};
	Vec4.prototype.a = function( a ){

		return this.w( a );

	};



	Vec4.prototype.val = function( x, y, z, w ){

		if( typeof x === 'number' && typeof y === 'number' && typeof z === 'number' && typeof w === 'number' ){

			this.x( x );
			this.y( y );
			this.z( z );
			this.w( w );
			
			return this;

		}else if( Array.isArray( x ) && x.length === 4 && y === undefined ){

			return this.val( x[ 0 ], x[ 1 ], x[ 2 ], x[ 3 ] );

		}else if( x instanceof Vec3 && y === undefined ){

			return this.val( x.x( ), x.y( ), x.z( ), x.w( ) );

		}else if( x === undefined ){

			return this.array;

		}

	};



	Vec4.prototype.zero = function( ){

		return this.val( 0, 0, 0, 0 );

	};



	module.exports = Vec4;
	
} );