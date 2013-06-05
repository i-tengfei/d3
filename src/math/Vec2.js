define( function( require, exports, module ) {

	function Vec2( x, y ){

		this.array = new Float32Array( 2 );
		this.val( x || 0, y || 0 );
	
	}



	Vec2.prototype.x = function( x ){

		if( x === undefined ){
			return this.array[ 0 ];
		}else{
			this.array[ 0 ] = x;
			return this;
		}

	};
	Vec2.prototype.y = function( y ){

		if( y === undefined ){
			return this.array[ 1 ];
		}else{
			this.array[ 1 ] = y;
			return this;
		}

	};



	Vec2.prototype.u = function( u ){

		return this.x( u );

	};
	Vec2.prototype.v = function( v ){

		return this.y( v );

	};



	Vec2.prototype.val = function( x, y ){

		if( typeof x === 'number' && typeof y === 'number' ){

			this.x( x );
			this.y( y );
			
			return this;

		}else if( Array.isArray( x ) && x.length === 2 && y === undefined ){

			return this.val( x[ 0 ], x[ 1 ] );

		}else if( x instanceof Vec2 && y === undefined ){

			return this.val( x.x( ), x.y( ) );

		}else if( x === undefined ){

			return this.array;

		}

	};



	Vec2.prototype.clone = function( ){

		return new Vec2( this.x( ), this.y( ) );

	};
	Vec2.prototype.zero = function( ){

		return this.val( 0, 0 );

	};
	Vec2.prototype.length = function( ){

		return Math.sqrt( this.x( ) * this.x( ) + this.y( ) * this.y( ) );
	
	};
	Vec2.prototype.normalize = function( ) {

		len = 1 / ( this.length( ) || 1 );

		this.x( this.x( ) * len );
		this.y( this.y( ) * len );

		return this;

	};



	module.exports = Vec2;

} );