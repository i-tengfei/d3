define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Mat4 = require( 'D3.Mat4' );
	var Display = require( 'D3.Display' );
	
	function Projector( ){

		this.projectionMatrix = new Mat4( );
		this.cameraViewMatrix = new Mat4( );

		this.objects 			= [ ];
		this.transparentObjects = [ ];
		this.opaqueObjects 		= [ ];
		this.lights 			= [ ];

	}

	Projector.prototype.projectVector = function( vector, camera ){

		__m4_1.val( camera.matrixWorld ).invert( );
		__m4_2.multiply( camera.projectionMatrix, __m4_1 );
		return vector.applyProjection( __m4_2 );

	};

	Projector.prototype.unprojectVector = function( vector, camera ){

		__m4_1.invert( camera.projectionMatrix );
		__m4_2.multiply( camera.matrixWorld, __m4_1 );
		return vector.applyProjection( __m4_2 );

	};

	Projector.prototype.projectScene = function( scene, camera ){

		camera.parent === undefined && scene.add( camera );

		this.projectionMatrix = camera.projectionMatrix;
		this.cameraViewMatrix = this.cameraViewMatrix.val( camera.matrixWorld ).invert( );
		
		scene.updateMatrixWorld( );

		var objects 			= this.objects 				= [ ];
		var transparentObjects 	= this.transparentObjects 	= [ ];
		var opaqueObjects 		= this.opaqueObjects 		= [ ];
		var lights 				= this.lights 				= [ ];

		( function( object3D ){


			if( object3D instanceof Display ) {

				if( !!object3D.visible ) {

				// if( object3D.material.alpha !== 1 ) {

					// transparentObjects.push( object3D );

				// } else {

					opaqueObjects.push( object3D );
				
				// }
				}

			}

			if( object3D.__type__ === D3.objectTypes.LIGHT ) {

				lights.push( object3D );

			}
			
			objects.push( object3D );

			if( !!object3D.children.length ) {

				var c = object3D.children.length;
				while( c-- ) {
					arguments.callee( object3D.children[ c ] );
				}

			}

		} )( scene );

		return this;
		
	};

	var __m4_1 = new Mat4( );
	var __m4_2 = new Mat4( );

	module.exports = Projector;

} );