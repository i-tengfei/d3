define( function( require, exports, module ) {

	var Camera = require( 'D3.Camera' );

	function PerspectiveCamera ( fov, aspect, near, far ) {

		Camera.call( this );

		this.fov = fov || 45;
		this.aspect = aspect || 1;
		this.near = near || 0.1;
		this.far = far || 2000;

		this.updateProjectionMatrix( );

	}

	PerspectiveCamera.prototype = Object.create( Camera.prototype );
	
	PerspectiveCamera.prototype.updateProjectionMatrix = function( ) {
		this.projectionMatrix.perspective( this.fov, this.aspect, this.near, this.far );
	};

	module.exports = PerspectiveCamera;

} );