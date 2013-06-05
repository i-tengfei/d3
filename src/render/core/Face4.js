define( function( require, exports, module ) {

	var Vec3 = require( 'D3.Vec3' );

	function Face4( v1, v2, v3, v4, normal ) {

		this.array = new Float32Array( 6 );
		this.normal = normal || new Vec3( );

		return this.val( v1, v2, v3, v4 );

	}

	Face4.prototype.v1 = function( v ){

		if( v === undefined ){

			return this.array[ 0 ];

		}else{

			this.array[ 0 ] = this.array[ 3 ] = v;
			return this;

		}
	
	};
	Face4.prototype.v2 = function( v ){

		if( v === undefined ){

			return this.array[ 1 ];

		}else{

			this.array[ 1 ] = v;
			return this;

		}
	
	};
	Face4.prototype.v3 = function( v ){

		if( v === undefined ){

			return this.array[ 2 ];

		}else{

			this.array[ 2 ] = this.array[ 4 ] = v;
			return this;

		}
	
	};
	Face4.prototype.v4 = function( v ){

		if( v === undefined ){

			return this.array[ 5 ];

		}else{

			this.array[ 5 ] = v;
			return this;

		}
	
	};



	Face4.prototype.val = function( v1, v2, v3, v4 ){

		if( typeof v1 === 'number' && typeof v2 === 'number' && typeof v3 === 'number' && typeof v4 === 'number' ){

			this.v1( v1 );
			this.v2( v2 );
			this.v3( v3 );
			this.v4( v4 );
			
			return this;

		}else if( Array.isArray( v1 ) && v1.length === 4 && v2 === undefined ){

			return this.val( v1[ 0 ], v1[ 1 ], v1[ 2 ], v1[ 3 ] );

		}else if( v1 instanceof Face4 && v2 === undefined ){

			return this.val( v1.v1( ), v1.v2( ), v1.v3( ), v1.v4( ) );

		}else if( v1 === undefined ){

			return this.array;

		}

	}


	module.exports = Face4;


} );