define( function( require, exports, module ) {

	var Geometry = require( 'D3.Geometry' );
	var Vector2 = require( 'D3.Vector2' );
	var Vector3 = require( 'D3.Vector3' );
	var Vector4 = require( 'D3.Vector4' );
	var Face3 = require( 'D3.Face3' );
	var Face4 = require( 'D3.Face4' );

	function SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ){

		Geometry.call( this );

		radius = radius || 50;

		widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
		heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

		phiStart = phiStart !== undefined ? phiStart : 0;
		phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

		thetaStart = thetaStart !== undefined ? thetaStart : 0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

		var positions = this.positions,
			normals = this.normals,
			tuvs = this.tuvs,
			faces = this.faces;

		var x, y, vertices = [];

		for ( y = 0; y <= heightSegments; y ++ ) {

			var verticesRow = [];

			for ( x = 0; x <= widthSegments; x ++ ) {

				var u = x / widthSegments;
				var v = y / heightSegments;

				var position = new Vector3( );
				position.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
				position.y = radius * Math.cos( thetaStart + v * thetaLength );
				position.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

				positions.push( position );
				normals.push( position.clone.normalize( ) );
				tuvs.push( new Vector2( u, 1 - v ) );

				verticesRow.push( positions.length - 1 );

			}

			vertices.push( verticesRow );

		}

		for ( y = 0; y < heightSegments; y ++ ) {

			for ( x = 0; x < widthSegments; x ++ ) {

				var v1 = vertices[ y ][ x + 1 ];
				var v2 = vertices[ y ][ x ];
				var v3 = vertices[ y + 1 ][ x ];
				var v4 = vertices[ y + 1 ][ x + 1 ];

				if ( Math.abs( positions[ v1 ].y ) === radius ) {

					faces.push( new Face3( v1, v3, v4 ) );

				} else if ( Math.abs( positions[ v3 ].y ) === radius ) {

					faces.push( new Face3( v1, v2, v3 ) );

				} else {

					faces.push( new Face4( v1, v2, v3, v4 ) );

				}

			}

		}

	}

	SphereGeometry.prototype = Object.create( Geometry.prototype );

	module.exports = SphereGeometry;

} );