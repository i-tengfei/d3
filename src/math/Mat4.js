define( function( require, exports, module ) {

	function Mat4( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {

		this.array = new Float32Array( 16 );

		this.val(

			( m11 !== undefined ) ? m11 : 1, m12 || 0, m13 || 0, m14 || 0,
			m21 || 0, ( m22 !== undefined ) ? m22 : 1, m23 || 0, m24 || 0,
			m31 || 0, m32 || 0, ( m33 !== undefined ) ? m33 : 1, m34 || 0,
			m41 || 0, m42 || 0, m43 || 0, ( m44 !== undefined ) ? m44 : 1

		);

	};



	Mat4.prototype.n = function( n, v ){

		if( typeof n === 'number' && typeof v === 'number' ){

			this.array[ n ] = v;
			return this;

		}else if( typeof n === 'number' && v === undefined ){

			return this.array[ n ];

		}

	};
	Mat4.prototype.m = function( m, v ){

		return this.n( ( m/10|0 ) + ( m % 10 ) * 4 - 5, v );

	};



	Mat4.prototype.val = function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ) {

		if( typeof m11 === 'number' && typeof m12 === 'number' && typeof m13 === 'number' && typeof m14 === 'number' && 
			typeof m21 === 'number' && typeof m22 === 'number' && typeof m23 === 'number' && typeof m24 === 'number' && 
			typeof m31 === 'number' && typeof m32 === 'number' && typeof m33 === 'number' && typeof m34 === 'number' && 
			typeof m41 === 'number' && typeof m42 === 'number' && typeof m43 === 'number' && typeof m44 === 'number' ){

			this.n(  0, m11 ); this.n(  4, m12 ); this.n(  8, m13 ); this.n( 12, m14 );
			this.n(  1, m21 ); this.n(  5, m22 ); this.n(  9, m23 ); this.n( 13, m24 );
			this.n(  2, m31 ); this.n(  6, m32 ); this.n( 10, m33 ); this.n( 14, m34 );
			this.n(  3, m41 ); this.n(  7, m42 ); this.n( 11, m43 ); this.n( 15, m44 );

			return this;

		}else if( m11 instanceof Mat4 && m12 === undefined ){

			return this.val(
				m11.m( 11 ), m11.m( 12 ), m11.m( 13 ), m11.m( 14 ),
				m11.m( 21 ), m11.m( 22 ), m11.m( 23 ), m11.m( 24 ),
				m11.m( 31 ), m11.m( 32 ), m11.m( 33 ), m11.m( 34 ),
				m11.m( 41 ), m11.m( 42 ), m11.m( 43 ), m11.m( 44 )
			);

		}else if( m11 === undefined ){

			return this.array;

		}

	};



	Mat4.prototype.clone = function( ){

		return new Mat4( 
			this.m( 11 ), this.m( 12 ), this.m( 13 ), this.m( 14 ), 
			this.m( 21 ), this.m( 22 ), this.m( 23 ), this.m( 24 ),
			this.m( 31 ), this.m( 32 ), this.m( 33 ), this.m( 34 ),
			this.m( 41 ), this.m( 42 ), this.m( 43 ), this.m( 44 )
		);

	};
	Mat4.prototype.zero = function( ) {

		return this.val(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		);

	};
	Mat4.prototype.identity = function( ) {

		return this.val(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);

	};
	Mat4.prototype.determinant = function( ){

		var m11 = this.m( 11 ), m12 = this.m( 12 ), m13 = this.m( 13 ), m14 = this.m( 14 );
		var m21 = this.m( 21 ), m22 = this.m( 22 ), m23 = this.m( 23 ), m24 = this.m( 24 );
		var m31 = this.m( 31 ), m32 = this.m( 32 ), m33 = this.m( 33 ), m34 = this.m( 34 );
		var m41 = this.m( 41 ), m42 = this.m( 42 ), m43 = this.m( 43 ), m44 = this.m( 44 );

		return (
			m41 * (
				+ m14 * m23 * m32
				- m13 * m24 * m32
				- m14 * m22 * m33
				+ m12 * m24 * m33
				+ m13 * m22 * m34
				- m12 * m23 * m34
			) +
			m42 * (
				+ m11 * m23 * m34
				- m11 * m24 * m33
				+ m14 * m21 * m33
				- m13 * m21 * m34
				+ m13 * m24 * m31
				- m14 * m23 * m31
			) +
			m43 * (
				+ m11 * m24 * m32
				- m11 * m22 * m34
				- m14 * m21 * m32
				+ m12 * m21 * m34
				+ m14 * m22 * m31
				- m12 * m24 * m31
			) +
			m44 * (
				- m13 * m22 * m31
				- m11 * m23 * m32
				+ m11 * m22 * m33
				+ m13 * m21 * m32
				- m12 * m21 * m33
				+ m12 * m23 * m31
			)

		);

	};
	Mat4.prototype.transpose = function( ) {

		var tmp;

		tmp = this.m( 21 ); this.m( 21 , this.m( 12 ) ); this.m( 12, tmp );
		tmp = this.m( 31 ); this.m( 31 , this.m( 13 ) ); this.m( 13, tmp );
		tmp = this.m( 32 ); this.m( 32 , this.m( 23 ) ); this.m( 23, tmp );

		tmp = this.m( 41 ); this.m( 41 , this.m( 14 ) ); this.m( 14, tmp );
		tmp = this.m( 42 ); this.m( 42 , this.m( 24 ) ); this.m( 24, tmp );
		tmp = this.m( 43 ); this.m( 43 , this.m( 34 ) ); this.m( 34, tmp );

		return this;

	};
	Mat4.prototype.invert = function( m ) {

		if( m ){

			return this.val( m ).invert( );

		}else{

			var m11 = this.m( 11 ), m12 = this.m( 12 ), m13 = this.m( 13 ), m14 = this.m( 14 ),
				m21 = this.m( 21 ), m22 = this.m( 22 ), m23 = this.m( 23 ), m24 = this.m( 24 ),
				m31 = this.m( 31 ), m32 = this.m( 32 ), m33 = this.m( 33 ), m34 = this.m( 34 ),
				m41 = this.m( 41 ), m42 = this.m( 42 ), m43 = this.m( 43 ), m44 = this.m( 44 )

			determinant = this.determinant( );

			if( determinant === 0 ) {
				throw( "Matrix determinant is zero, can't invert." );
			}

			this.m( 11, m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44 );
			this.m( 12, m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44 );
			this.m( 13, m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44 );
			this.m( 14, m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34 );
			this.m( 21, m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44 );
			this.m( 22, m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44 );
			this.m( 23, m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44 );
			this.m( 24, m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34 );
			this.m( 31, m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44 );
			this.m( 32, m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44 );
			this.m( 33, m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44 );
			this.m( 34, m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34 );
			this.m( 41, m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43 );
			this.m( 42, m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43 );
			this.m( 43, m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43 );
			this.m( 44, m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33 );

			return this.multiply( 1 / determinant );

		}

	};



	Mat4.prototype.multiply = function( m1, m2 ) {

		if( m1 instanceof Mat4 && m2 instanceof Mat4 ){

			this.m( 11, m1.m( 11 ) * m2.m( 11 ) + m1.m( 12 ) * m2.m( 21 ) + m1.m( 13 ) * m2.m( 31 ) + m1.m( 14 ) * m2.m( 41 ) );
			this.m( 12, m1.m( 11 ) * m2.m( 12 ) + m1.m( 12 ) * m2.m( 22 ) + m1.m( 13 ) * m2.m( 32 ) + m1.m( 14 ) * m2.m( 42 ) );
			this.m( 13, m1.m( 11 ) * m2.m( 13 ) + m1.m( 12 ) * m2.m( 23 ) + m1.m( 13 ) * m2.m( 33 ) + m1.m( 14 ) * m2.m( 43 ) );
			this.m( 14, m1.m( 11 ) * m2.m( 14 ) + m1.m( 12 ) * m2.m( 24 ) + m1.m( 13 ) * m2.m( 34 ) + m1.m( 14 ) * m2.m( 44 ) );

			this.m( 21, m1.m( 21 ) * m2.m( 11 ) + m1.m( 22 ) * m2.m( 21 ) + m1.m( 23 ) * m2.m( 31 ) + m1.m( 24 ) * m2.m( 41 ) );
			this.m( 22, m1.m( 21 ) * m2.m( 12 ) + m1.m( 22 ) * m2.m( 22 ) + m1.m( 23 ) * m2.m( 32 ) + m1.m( 24 ) * m2.m( 42 ) );
			this.m( 23, m1.m( 21 ) * m2.m( 13 ) + m1.m( 22 ) * m2.m( 23 ) + m1.m( 23 ) * m2.m( 33 ) + m1.m( 24 ) * m2.m( 43 ) );
			this.m( 24, m1.m( 21 ) * m2.m( 14 ) + m1.m( 22 ) * m2.m( 24 ) + m1.m( 23 ) * m2.m( 34 ) + m1.m( 24 ) * m2.m( 44 ) );

			this.m( 31, m1.m( 31 ) * m2.m( 11 ) + m1.m( 32 ) * m2.m( 21 ) + m1.m( 33 ) * m2.m( 31 ) + m1.m( 34 ) * m2.m( 41 ) );
			this.m( 32, m1.m( 31 ) * m2.m( 12 ) + m1.m( 32 ) * m2.m( 22 ) + m1.m( 33 ) * m2.m( 32 ) + m1.m( 34 ) * m2.m( 42 ) );
			this.m( 33, m1.m( 31 ) * m2.m( 13 ) + m1.m( 32 ) * m2.m( 23 ) + m1.m( 33 ) * m2.m( 33 ) + m1.m( 34 ) * m2.m( 43 ) );
			this.m( 34, m1.m( 31 ) * m2.m( 14 ) + m1.m( 32 ) * m2.m( 24 ) + m1.m( 33 ) * m2.m( 34 ) + m1.m( 34 ) * m2.m( 44 ) );

			this.m( 41, m1.m( 41 ) * m2.m( 11 ) + m1.m( 42 ) * m2.m( 21 ) + m1.m( 43 ) * m2.m( 31 ) + m1.m( 44 ) * m2.m( 41 ) );
			this.m( 42, m1.m( 41 ) * m2.m( 12 ) + m1.m( 42 ) * m2.m( 22 ) + m1.m( 43 ) * m2.m( 32 ) + m1.m( 44 ) * m2.m( 42 ) );
			this.m( 43, m1.m( 41 ) * m2.m( 13 ) + m1.m( 42 ) * m2.m( 23 ) + m1.m( 43 ) * m2.m( 33 ) + m1.m( 44 ) * m2.m( 43 ) );
			this.m( 44, m1.m( 41 ) * m2.m( 14 ) + m1.m( 42 ) * m2.m( 24 ) + m1.m( 43 ) * m2.m( 34 ) + m1.m( 44 ) * m2.m( 44 ) );

			return this;

		}else if( m1 instanceof Mat4 && m2 === undefined  ){

			return this.multiply( this, m1 );

		}else if( typeof m1 === 'number' && m2 === undefined ){
			
			this.m( 11, this.m( 11 ) * m1 ); this.m( 12, this.m( 12 ) * m1 ); this.m( 13, this.m( 13 ) * m1 ); this.m( 14, this.m( 14 ) * m1 );
			this.m( 21, this.m( 21 ) * m1 ); this.m( 22, this.m( 22 ) * m1 ); this.m( 23, this.m( 23 ) * m1 ); this.m( 24, this.m( 24 ) * m1 );
			this.m( 31, this.m( 31 ) * m1 ); this.m( 32, this.m( 32 ) * m1 ); this.m( 33, this.m( 33 ) * m1 ); this.m( 34, this.m( 34 ) * m1 );
			this.m( 41, this.m( 41 ) * m1 ); this.m( 42, this.m( 42 ) * m1 ); this.m( 43, this.m( 43 ) * m1 ); this.m( 44, this.m( 44 ) * m1 );

			return this;

		}
	
	};



	// ---------- ---------- For Camera ---------- ---------- //
	Mat4.prototype.frustum = function ( left, right, bottom, top, near, far ) {

		var a =  ( right + left )	/ ( right - left ),
			b =  ( top + bottom )	/ ( top - bottom ),
			c = -( far + near ) 	/ ( far - near	 ),
			d = -2 * far * near 	/ ( far - near	 ),
			x =  2 * near 			/ ( right - left ),
			y =  2 * near 			/ ( top - bottom );

		return this.val(
			x,  0,  a,  0,
			0,  y,  b,  0,
			0,  0,  c,  d,
			0,  0, -1,  0
		);

	};
	Mat4.prototype.perspective = function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( fov * Math.PI / 360 );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.frustum( xmin, xmax, ymin, ymax, near, far );

	};
	Mat4.prototype.lookAt = function( eye, target, up ) {

		var x = __v1 || eye.clone( );
		var y = __v2 || eye.clone( );
		var z = __v3 || eye.clone( );

		z.sub( eye, target ).normalize( );

		if ( z.length === 0 ) {

			z.z = 1;

		}

		x.cross( up, z ).normalize( );

		if ( x.length === 0 ) {

			z.x += 0.0001;
			x.cross( up, z ).normalize( );

		}

		y.cross( z, x );

		this.m( 11, x.x( ) ); this.m( 12, y.x( ) ); this.m( 13, z.x( ) );
		this.m( 21, x.y( ) ); this.m( 22, y.y( ) ); this.m( 23, z.y( ) );
		this.m( 31, x.z( ) ); this.m( 32, y.z( ) ); this.m( 33, z.z( ) );

		return this;

	};
	Mat4.prototype.maxScaleOnAxis = function ( ) {

		var scaleXSq = this.n( 0 ) * this.n( 0 ) + this.n( 1 ) * this.n( 1 ) + this.n( 2 ) * this.n( 2 );
		var scaleYSq = this.n( 4 ) * this.n( 4 ) + this.n( 5 ) * this.n( 5 ) + this.n( 6 ) * this.n( 6 );
		var scaleZSq = this.n( 8 ) * this.n( 8 ) + this.n( 9 ) * this.n( 9 ) + this.n( 10 ) * this.n( 10 );

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	};



	Mat4.prototype.makePosition = function( v ) {

		this.n( 12, v.x( ) );
		this.n( 13, v.y( ) );
		this.n( 14, v.z( ) );

		return this;

	};
	Mat4.prototype.makeRotation = function( v ) {

		var x = v.x( ), y = v.y( ), z = v.z( );

		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		var ae = a * e, af = a * f, be = b * e, bf = b * f;

		this.m( 11, c * e );
		this.m( 12, - c * f );
		this.m( 13, d );

		this.m( 21, af + be * d );
		this.m( 22, ae - bf * d );
		this.m( 23, - b * c );

		this.m( 31, bf - ae * d );
		this.m( 32, be + af * d );
		this.m( 33, a * c );

		return this;

	};



	var __v1, __v2, __v3;



	module.exports = Mat4;

} );