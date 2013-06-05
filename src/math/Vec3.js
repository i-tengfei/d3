define( function( require, exports, module ) {

	function Vec3( x, y, z ){

		this.array = new Float32Array( 3 );
		this.val( x || 0, y || 0, z || 0 );
	
	}



	Vec3.prototype.x = function( x ){

		if( x === undefined ){
			return this.array[ 0 ];
		}else{
			this.array[ 0 ] = x;
			return this;
		}

	};
	Vec3.prototype.y = function( y ){

		if( y === undefined ){
			return this.array[ 1 ];
		}else{
			this.array[ 1 ] = y;
			return this;
		}

	};
	Vec3.prototype.z = function( z ){

		if( z === undefined ){
			return this.array[ 2 ];
		}else{
			this.array[ 2 ] = z;
			return this;
		}

	};



	Vec3.prototype.r = function( r ){

		return this.x( r );

	};
	Vec3.prototype.g = function( g ){

		return this.y( g );

	};
	Vec3.prototype.b = function( b ){

		return this.z( b );

	};



	Vec3.prototype.val = function( x, y, z ){

		if( typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ){

			this.x( x );
			this.y( y );
			this.z( z );
			
			return this;

		}else if( Array.isArray( x ) && x.length === 3 && y === undefined ){

			return this.val( x[ 0 ], x[ 1 ], x[ 2 ] );

		}else if( x instanceof Vec3 && y === undefined ){

			return this.val( x.x( ), x.y( ), x.z( ) );

		}else if( x === undefined ){

			return this.array;

		}

	};



	Vec3.prototype.clone = function( ){

		return new Vec3( this.x( ), this.y( ), this.z( ) );

	};
	Vec3.prototype.zero = function( ){

		return this.val( 0, 0, 0 );

	};
	Vec3.prototype.lengthSquared = function( ){

		return this.dot( this );

	};
	Vec3.prototype.distance = function ( v ) {

		return Math.sqrt( this.distanceSquared( v ) );

	};
	Vec3.prototype.distanceSquared = function( v ){

		var dx = this.x( ) - v.x( );
		var dy = this.y( ) - v.y( );
		var dz = this.z( ) - v.z( );

		return dx * dx + dy * dy + dz * dz;

	};
	Vec3.prototype.length = function( ){

		return Math.sqrt( this.lengthSquared( ) );
	
	};
	Vec3.prototype.normalize = function( ) {

		len = 1 / ( this.length( ) || 1 );

		this.x( this.x( ) * len );
		this.y( this.y( ) * len );
		this.z( this.z( ) * len );

		return this;

	};



	Vec3.prototype.add = function( x, y, z ){

		if( typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ){

			this.x( this.x( ) + x );
			this.y( this.y( ) + y );
			this.z( this.z( ) + z );

			return this;

		}else if( x instanceof Vec3 && y instanceof Vec3 && z === undefined ){

			return this.val( x ).add( y );

		}else if( x instanceof Vec3 && y === undefined  ){

			return this.add( x.x( ), x.y( ), x.z( ) );

		}

	};
	Vec3.prototype.sub = function( x, y, z ){

		if( typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ){

			this.x( this.x( ) - x );
			this.y( this.y( ) - y );
			this.z( this.z( ) - z );

			return this;

		}else if( x instanceof Vec3 && y instanceof Vec3 && z === undefined ){

			return this.val( x ).sub( y );

		}else if( x instanceof Vec3 && y === undefined  ){

			return this.sub( x.x( ), x.y( ), x.z( ) );

		}

	};
	Vec3.prototype.multiply = function( x, y, z ) {

		if( typeof x === 'number' && typeof y === 'number' && typeof z === 'number' ){

			this.x( this.x( ) * x );
			this.y( this.y( ) * y );
			this.z( this.z( ) * z );

			return this;

		}else if( x instanceof Vec3 && y instanceof Vec3 && z === undefined ){

			return this.val( x ).multiply( y );

		}else if( x instanceof Vec3 && y === undefined ){

			return this.multiply( x.x( ), x.y( ), x.z( ) );

		}else if( typeof x === 'number' && y === undefined ){

			return this.multiply( x, x, x );

		}

	};
	Vec3.prototype.dot = function( v ){

		return this.x( ) * v.x( ) + this.y( ) * v.y( ) + this.z( ) * v.z( );

	};
	Vec3.prototype.cross = function( v1, v2 ){

		if( v1 && v2 ){

			this.x( v1.y( ) * v2.z( ) - v1.z( ) * v2.y( ) );
			this.y( v1.z( ) * v2.x( ) - v1.x( ) * v2.z( ) );
			this.z( v1.x( ) * v2.y( ) - v1.y( ) * v2.x( ) );

			return this;

		}else if( v1 ){

			return this.cross( this, v1 );

		}

	};



	Vec3.prototype.makePosition = function( m ){

		this.val( m.n( 12 ), m.n( 13 ), m.n( 14 ) );

		return this;

	};
	Vec3.prototype.makeRotation = function ( m ) {

		function clamp( x ) {

			return Math.min( Math.max( x, -1 ), 1 );

		}

		var x, y, z;

		y = Math.asin( clamp( m.m( 13 ) ) );

		if ( Math.abs( m.m( 13 ) ) < 0.99999 ) {

			x = Math.atan2( - m.m( 23 ), m.m( 33 ) );
			z =  Math.atan2( - m.m( 12 ), m.m( 11 ) );

		} else {

			x = Math.atan2( m.m( 32 ), m.m( 22 ) );
			z = 0;

		}

		return this.val( x, y, z );

	};



	Vec3.prototype.applyProjection = function ( m ) {

		var x = this.x( ), y = this.y( ), z = this.z( );

		var d = 1 / ( m.n( 3 ) * x + m.n( 7 ) * y + m.n( 11 ) * z + m.n( 15 ) );

		this.x( ( m.n( 0 ) * x + m.n( 4 ) * y + m.n( 8 )  * z + m.n( 12 ) ) * d );
		this.y( ( m.n( 1 ) * x + m.n( 5 ) * y + m.n( 9 )  * z + m.n( 13 ) ) * d );
		this.z( ( m.n( 2 ) * x + m.n( 6 ) * y + m.n( 10 ) * z + m.n( 14 ) ) * d );

		return this;

	};
	Vec3.prototype.applyMat4 = function ( m ) {

		var x = this.x( ), y = this.y( ), z = this.z( );

		this.x( m.n( 0 ) * x + m.n( 4 ) * y + m.n( 8 )  * z + m.n( 12 ) );
		this.y( m.n( 1 ) * x + m.n( 5 ) * y + m.n( 9 )  * z + m.n( 13 ) );
		this.z( m.n( 2 ) * x + m.n( 6 ) * y + m.n( 10 ) * z + m.n( 14 ) );

		return this;

	};



	module.exports = Vec3;

} );