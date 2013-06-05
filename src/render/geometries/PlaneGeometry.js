define( function( require, exports, module ) {

	var Geometry = require( 'D3.Geometry' );
	var Vec2 = require( 'D3.Vec2' );
	var Vec3 = require( 'D3.Vec3' );
	var Vec4 = require( 'D3.Vec4' );
	var Face4 = require( 'D3.Face4' );

	function PlaneGeometry( width, height, widthSegments, heightSegments ) {

		Geometry.call( this );

		var faceWidth   = width,
			faceHeight  = height,
			halfWidth   = width * 0.5,
			halfHeight  = height * 0.5;

		widthSegments   = widthSegments  || 1;
		heightSegments  = heightSegments || 1;

		faceWidth   = width  / widthSegments ;
		faceHeight  = height / heightSegments;

		var normal = new Vec3( 0, 0, 1 );

		var	positions = this.positions,
			normals = this.normals,
			tuvs = this.tuvs,
			faces = this.faces;

		for( var h = 0; h <= heightSegments; h++ ){

			for( var w = 0; w <= widthSegments; w++ ){

				var x = w * faceWidth - halfWidth;
				var y = h * faceHeight - halfHeight;

				positions.push( new Vec3( x, - y, 0 ) );
				normals.push( normal.clone( ) );
				tuvs.push( new Vec2(  w / widthSegments, 1- h / heightSegments ) );

			}

		}

		for( var h = 0; h < heightSegments; h++ ){

			for( var w = 0; w < widthSegments; w++ ){

				var v1 =   w + ( widthSegments + 1 )        *   h;
				var v2 =   w + ( widthSegments + 1 )        * ( h + 1 );
				var v3 = ( w + 1 ) + ( widthSegments + 1 )  * ( h + 1 );
				var v4 = ( w + 1 ) + ( widthSegments + 1 )  *   h;

				faces.push( new Face4( v1, v2, v3, v4, normal.clone( ) ) );

			}

		}

	}

	PlaneGeometry.prototype = Object.create( Geometry.prototype );

	module.exports = PlaneGeometry;

} );