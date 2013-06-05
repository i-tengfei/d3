define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Vec3 = require( 'D3.Vec3' );
	var Attribute = require( 'D3.Attribute' );
	var Sphere =require( 'D3.Sphere' );



	function Geometry( ){
		
		this.positions = [];
		this.normals = [];
		this.colors = [];
		this.tuvs = [];

		this.faces = [];

		this.vertexPosition = new Attribute( 'aVertexPosition', 3 );
		this.vertexPosition.dirty = false;
		this.vertexNormal = new Attribute( 'aVertexNormal', 3 );
		this.vertexNormal.dirty = false;
		this.vertexColor = new Attribute( 'aVertexColor', 3 );
		this.vertexColor.dirty = false;
		this.vertexTuv = new Attribute( 'aVertexTuv', 2 );
		this.vertexTuv.dirty = false;

		this.faceIndex = {
			array 	: null,
			size 	: 1,
			dirty 	: false
		};

		this.positionsNeedUpdate	= true;
		this.normalsNeedUpdate		= true;
		this.colorsNeedUpdate		= true;
		this.tuvsNeedUpdate 		= true;

		this.facesNeedUpdate 		= true;

		this.boundingBox 	= { min: new Vec3( ), max: new Vec3( ) };
		this.__boundingSphere = null

	}




	Geometry.prototype.update = function( ){

		this.positionsNeedUpdate 	&& this.updatePositions( );
		this.normalsNeedUpdate 		&& this.updateNormals( );
		this.colorsNeedUpdate		&& this.updateColors( );
		this.tuvsNeedUpdate 		&& this.updateTuvs( );

		this.facesNeedUpdate		&& this.updateFaces( );

	};



	Geometry.prototype.updatePositions = function( ){

		var positions = this.positions,
			vertexPosition = this.vertexPosition,
			size = vertexPosition.size,
			array = [ ],
			il = positions.length;

		if( il ){

			for( var i = 0; i < il; i++ ){

				var ii = i * size,
					position = positions[ i ];

				array[  ii  ] = position.x( );
				array[ ii+1 ] = position.y( );
				array[ ii+2 ] = position.z( );

			}
				
			vertexPosition.value	= new Float32Array( array );
			vertexPosition.dirty	= true;

			this.positionsNeedUpdate = false;

		}

	};
	Geometry.prototype.updateNormals = function( ){

		var normals = this.normals,
			vertexNormal = this.vertexNormal,
			size = vertexNormal.size,
			array = [ ],
			il = normals.length;

		if( il ){

			for( var i = 0; i < il; i++ ){

				var ii = i * size,
					normal = normals[ i ];

				array[  ii  ] = normal.x( );
				array[ ii+1 ] = normal.y( );
				array[ ii+2 ] = normal.z( );

			}
				
			vertexNormal.value	= new Float32Array( array );
			vertexNormal.dirty	= true;
			
			this.normalsNeedUpdate = false;

		}

	};
	Geometry.prototype.updateColors = function( ){

		var colors = this.colors,
			vertexColor = this.vertexColor,
			size = vertexColor.size,
			array = [ ],
			il = colors.length;

		if( il ){

			for( var i = 0; i < il; i++ ){

				var ii = i * size,
					color = colors[ i ];

				array[  ii  ] = color.r( );
				array[ ii+1 ] = color.g( );
				array[ ii+2 ] = color.b( );

			}
				
			vertexColor.value	= new Float32Array( array );
			vertexColor.dirty	= true;
			
			this.colorsNeedUpdate = false;

		}

	};
	Geometry.prototype.updateTuvs = function( ){

		var tuvs = this.tuvs,
			vertexTuv = this.vertexTuv,
			size = vertexTuv.size,
			array = [ ],
			il = tuvs.length;

		if( il ){

			for( var i = 0; i < il; i++ ){

				var ii = i * size,
					tuv = tuvs[ i ];

				array[  ii  ] = tuv.x( );
				array[ ii+1 ] = tuv.y( );

			}
				
			vertexTuv.value	= new Float32Array( array );
			vertexTuv.dirty = true;
			
			this.tuvsNeedUpdate = false;

		}

	};
	Geometry.prototype.updateFaces = function( ){

		var faces = this.faces,
			faceIndex = this.faceIndex,
			size = faceIndex.size,
			array = [],
			il = faces.length;

		if( il ){

			for( var i = 0, il = faces.length; i < il; i++ ){

				var face = faces[ i ],
					farr = face.array;

				for( var f = 0, fl = face.array.length; f < fl; f++ ){

					array.push( farr[ f ] );

				}

			}

			faceIndex.array = new Uint16Array( array );
			faceIndex.dirty	= true;

			this.facesNeedUpdate = false;

		}

	};



	Geometry.prototype.computeBoundingBox = function ( ){

		if ( this.positions.length > 0 ) {

			var position, firstPosition = this.positions[ 0 ];

			this.boundingBox.min.val( firstPosition );
			this.boundingBox.max.val( firstPosition );

			var min = this.boundingBox.min,
				max = this.boundingBox.max;

			for ( var v = 1, vl = this.positions.length; v < vl; v ++ ) {

				position = this.positions[ v ];

				if ( position.x( ) < min.x( ) ) {

					min.x( position.x( ) );

				} else if ( position.x( ) > max.x( ) ) {

					min.x( position.x( ) );

				}

				if ( position.y( ) < min.y( ) ) {

					min.y( position.y( ) );

				} else if ( position.y( ) > max.y( ) ) {

					min.y( position.y( ) );

				}

				if ( position.z( ) < min.z( ) ) {

					min.z( position.z( ) );

				} else if ( position.z( ) > max.z( ) ) {

					min.z( position.z( ) );

				}

			}

		} else {

			this.boundingBox.min.val( 0, 0, 0 );
			this.boundingBox.max.val( 0, 0, 0 );

		}

	};
	Geometry.prototype.boundingSphere = function ( forcibly ) {

		if ( this.__boundingSphere === null || forcibly ) {

			this.__boundingSphere = new Sphere( );
			this.__boundingSphere.setFromCenterAndPoints( this.__boundingSphere.center, this.positions );

		}

		return this.__boundingSphere;

	}
	// Geometry.prototype.computeNormals = function ( ) {

	// 	var n, nl, v, vl, vertex, f, fl, face, vA, vB, vC,
	// 	cb = new Vector3( ), ab = new Vector3( );

	// 	for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

	// 		face = this.faces[ f ];

	// 		this.normals[ face.v1 ] = this.positions[ face.v1 ];
	// 		this.normals[ face.v2 ] = this.positions[ face.v2 ];
	// 		this.normals[ face.v3 ] = this.positions[ face.v3 ];

	// 	}

	// };



	Geometry.prototype.parse = function( data ){

		var json = typeof data === 'object' ? data : JSON.parse( data );

		var type, ind, len, vLen,
			isBitSet = D3.isBitSet;

		var positions = json.positions,
			tuvs = json.tuvs,
			normals = json.normals,
			faces = json.faces;

		ind = 0; len = faces.length;
		while ( ind < len ) {

			type = faces[ ind ++ ];

			isQuad		= isBitSet( type, 0 );
			hasTuvs		= isBitSet( type, 1 );
			hasNormals	= isBitSet( type, 2 );

			// ---------- | Positions | ---------- //
			var v1 = faces[ ind ++ ],
				v2 = faces[ ind ++ ],
				v3 = faces[ ind ++ ];

			this.positions[ v1 ] || ( this.positions[ v1 ] = new Vec3( positions[ v1 * 3 ], positions[ v1 * 3 + 1 ], positions[ v1 * 3 + 2 ] ) );
			this.positions[ v2 ] || ( this.positions[ v2 ] = new Vec3( positions[ v2 * 3 ], positions[ v2 * 3 + 1 ], positions[ v2 * 3 + 2 ] ) );
			this.positions[ v3 ] || ( this.positions[ v3 ] = new Vec3( positions[ v3 * 3 ], positions[ v3 * 3 + 1 ], positions[ v3 * 3 + 2 ] ) );
			
			if( isQuad ){

				var v4 = faces[ ind ++ ];
				this.positions[ v4 ] || ( this.positions[ v4 ] = new Vec3( positions[ v4 * 3 ], positions[ v4 * 3 + 1 ], positions[ v4 * 3 + 2 ] ) );
				
			}

			// ---------- | Tuvs | ---------- //
			if( hasTuvs ){
				var t1 = faces[ ind ++ ],
					t2 = faces[ ind ++ ],
					t3 = faces[ ind ++ ];

				this.tuvs[ v1 ] || ( this.tuvs[ v1 ] = new Vec3( tuvs[ t1 * 3 ], tuvs[ t1 * 3 + 1 ] ) );
				this.tuvs[ v2 ] || ( this.tuvs[ v2 ] = new Vec3( tuvs[ t2 * 3 ], tuvs[ t2 * 3 + 1 ] ) );
				this.tuvs[ v3 ] || ( this.tuvs[ v3 ] = new Vec3( tuvs[ t3 * 3 ], tuvs[ t3 * 3 + 1 ] ) );
				
				if( isQuad ){

					var t4 = faces[ ind ++ ];
					this.tuvs[ v4 ] || ( this.tuvs[ v4 ] = new Vec3( tuvs[ t4 * 3 ], tuvs[ t4 * 3 + 1 ] ) );
				
				}
			}

			// ---------- | Normals | ---------- //
			if( hasNormals ){
				var n1 = faces[ ind ++ ],
					n2 = faces[ ind ++ ],
					n3 = faces[ ind ++ ];

				this.normals[ v1 ] || ( this.normals[ v1 ] = new Vec3( normals[ n1 * 3 ], normals[ n1 * 3 + 1 ], normals[ n1 * 3 + 2 ] ) );
				this.normals[ v2 ] || ( this.normals[ v2 ] = new Vec3( normals[ n2 * 3 ], normals[ n2 * 3 + 1 ], normals[ n2 * 3 + 2 ] ) );
				this.normals[ v3 ] || ( this.normals[ v3 ] = new Vec3( normals[ n3 * 3 ], normals[ n3 * 3 + 1 ], normals[ n3 * 3 + 2 ] ) );
				
				if( isQuad ){

					var n4 = faces[ ind ++ ];
					this.normals[ v4 ] || ( this.normals[ v4 ] = new Vec3( normals[ n4 * 3 ], normals[ n4 * 3 + 1 ], normals[ n4 * 3 + 2 ] ) );
				
				}
			}

			this.faces.push( isQuad ? new Face4( v1, v2, v3, v4 ) : new Face3( v1, v2, v3 ) );

		}

	};

	module.exports = Geometry;

} );