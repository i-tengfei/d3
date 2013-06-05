define( function( require, exports, module ) {

	var Object3D = require( 'D3.Object3D' );
	var Mat4 = require( 'D3.Mat4' );

	function Camera ( ) {

		Object3D.call( this );

		this.projectionMatrix = new Mat4( );

	}

	Camera.prototype = Object.create( Object3D.prototype );

	Camera.prototype.lookAt = function ( vector ) {

		vector = vector || this.target;
		var tmp = this.matrix.clone( );
		tmp.lookAt( this.position( ), vector, this.up );

		this.rotation( ).makeRotation( tmp );

	};

	module.exports = Camera;

} );