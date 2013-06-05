define( function( require, exports, module ) {
    
	var Geometry = require( 'D3.Geometry' );
	var Vec3 = require( 'D3.Vec3' );
	var Vec2 = require( 'D3.Vec2' );
	var Face4 = require( 'D3.Face4' );

    function CubeGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ){

		Geometry.call( this );

		this.widthSegments = widthSegments || 1;
		this.heightSegments = heightSegments || 1;
		this.depthSegments = depthSegments || 1;

		var halfWidth = width / 2;
		var halfHeight = height / 2;
		var halfDepth = depth / 2;

		this.buildPlane( 'z', 'y', - 1, - 1, depth, height,   halfWidth , 0 ); // px
		this.buildPlane( 'z', 'y',   1, - 1, depth, height, - halfWidth , 1 ); // nx
		this.buildPlane( 'x', 'z',   1,   1, width, depth ,   halfHeight, 2 ); // py
		this.buildPlane( 'x', 'z',   1, - 1, width, depth , - halfHeight, 3 ); // ny
		this.buildPlane( 'x', 'y',   1, - 1, width, height,   halfDepth , 4 ); // pz
		this.buildPlane( 'x', 'y', - 1, - 1, width, height, - halfDepth , 5 ); // nz

    }
    
    CubeGeometry.prototype = Object.create( Geometry.prototype );

    CubeGeometry.prototype.buildPlane = function( u, v, udir, vdir, width, height, depth, materialIndex ) {

        var w, ix, iy,
            widthSegments = this.widthSegments,
            widthSegments = this.heightSegments,
            halfWidth = width / 2,
            halfHeight = height / 2,
            offset = this.positions.length;

        if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

            w = 'z';

        } else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

            w = 'y';
            widthSegments = this.depthSegments;

        } else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

            w = 'x';
            widthSegments = this.depthSegments;

        }

        var faceWidth = width / widthSegments,
            faceHeight = height / widthSegments,
            normal = new Vec3( );

        normal[ w ]( depth > 0 ? 1 : - 1 );

        for ( iy = 0; iy <= widthSegments; iy ++ ) {

            for ( ix = 0; ix <= widthSegments; ix ++ ) {

				var vertex = new Vec3();
				vertex[ u ]( ( ix * faceWidth - halfWidth ) * udir );
				vertex[ v ]( ( iy * faceHeight - halfHeight ) * vdir );
				vertex[ w ]( depth );
				this.positions.push( vertex );
				this.normals.push( normal.clone( ) );
				this.tuvs.push( new Vec2( ix / widthSegments, 1- iy / widthSegments ) );

            }

        }

        for ( iy = 0; iy < widthSegments; iy++ ) {

            for ( ix = 0; ix < widthSegments; ix++ ) {

				var v1 = ix + ( widthSegments + 1 ) * iy;
				var v2 = ix + ( widthSegments + 1 ) * ( iy + 1 );
				var v3 = ( ix + 1 ) + ( widthSegments + 1 ) * ( iy + 1 );
				var v4 = ( ix + 1 ) + ( widthSegments + 1 ) * iy;

				this.faces.push( new Face4( v1 + offset, v2 + offset, v3 + offset, v4 + offset ) );

            }

        }

    };

    module.exports = CubeGeometry;

} );