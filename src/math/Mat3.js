define( function( require, exports, module ) {

	function Mat3( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) {

		this.array = new Float32Array( 9 );

		this.val(

			( m11 !== undefined ) ? m11 : 1, m12 || 0, m13 || 0,
			m21 || 0, ( m22 !== undefined ) ? m22 : 1, m23 || 0,
			m31 || 0, m32 || 0, ( m33 !== undefined ) ? m33 : 1

		);

	};



	Mat3.prototype.n = function( n, v ){

		if( typeof n === 'number' && typeof v === 'number' ){

			this.array[ n ] = v;
			return this;

		}else if( typeof n === 'number' && v === undefined ){

			return this.array[ n ];

		}

	};
	Mat3.prototype.m = function( m, v ){

		return this.n( ( m/10|0 ) + ( m % 10 ) * 3 - 4, v );

	};



	Mat3.prototype.val = function ( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) {

		if( typeof m11 === 'number' && typeof m12 === 'number' && typeof m13 === 'number' && 
			typeof m21 === 'number' && typeof m22 === 'number' && typeof m23 === 'number' && 
			typeof m31 === 'number' && typeof m32 === 'number' && typeof m33 === 'number' ){

			this.n( 0, m11 ); this.n( 3, m12 ); this.n( 6, m13 );
			this.n( 1, m21 ); this.n( 4, m22 ); this.n( 7, m23 );
			this.n( 2, m31 ); this.n( 5, m32 ); this.n( 8, m33 );

			return this;

		}else if( m11 instanceof Mat3 && m12 === undefined ){

			return this.val(
				m11.m( 11 ), m11.m( 12 ), m11.m( 13 ),
				m11.m( 21 ), m11.m( 22 ), m11.m( 23 ),
				m11.m( 31 ), m11.m( 32 ), m11.m( 33 )
			);

		}else if( m11 === undefined ){

			return this.array;

		}

	};



	Mat3.prototype.clone = function( ){

		return new Mat3( 
			this.m( 11 ), this.m( 12 ), this.m( 13 ),
			this.m( 21 ), this.m( 22 ), this.m( 23 ),
			this.m( 31 ), this.m( 32 ), this.m( 33 )
		);

	};
	Mat3.prototype.zero = function( ) {

		return this.val(
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		);

	};
	Mat3.prototype.identity = function( ) {

		return this.val(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);

	};
	Mat3.prototype.determinant = function( ){

		var a = this.m( 11 ), b = this.m( 21 ), c = this.m( 31 ),
			d = this.m( 12 ), e = this.m( 22 ), f = this.m( 32 ),
			g = this.m( 13 ), h = this.m( 23 ), i = this.m( 33 );

		return a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g;

	};
	Mat3.prototype.transpose = function( ) {

		var m12 = this.m( 12 ), m13 = this.m( 13 ),
			m21 = this.m( 21 ), m23 = this.m( 23 ),
			m31 = this.m( 31 ),	m32 = this.m( 32 );

		this.m( 12, m21 ); this.m( 13, m31 );
		this.m( 21, m12 ); this.m( 23, m32 );
		this.m( 31, m13 ); this.m( 32, m23 );

		return this;

	};
	Mat3.prototype.invert = function( ) {

		var m11 = this.m( 11 ), m12 = this.m( 12 ), m13 = this.m( 13 ),
			m21 = this.m( 21 ), m22 = this.m( 22 ), m23 = this.m( 23 ),
			m31 = this.m( 31 ), m32 = this.m( 32 ), m33 = this.m( 33 ),

			determinant = this.determinant( );

		if( determinant === 0 ) {
			throw("Matrix determinant is zero, can't invert.");
		}

		this.m( 11, m22 * m33 - m23 * m32 );
		this.m( 12, m13 * m32 - m12 * m33 );
		this.m( 13, m12 * m23 - m13 * m22 );
		this.m( 21, m23 * m31 - m21 * m33 );
		this.m( 22, m11 * m33 - m13 * m31 );
		this.m( 23, m13 * m21 - m11 * m23 );
		this.m( 31, m21 * m32 - m22 * m31 );
		this.m( 32, m12 * m31 - m11 * m32 );
		this.m( 33, m11 * m22 - m12 * m21 );

		return this.multiply( 1 / determinant );

	};



	Mat3.prototype.multiply = function( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) {

		
	
	};



	module.exports = Mat3;

} );