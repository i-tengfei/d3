define( function( require, exports, module ) {

	var Camera = require( 'D3.Camera' );
	var Matrix4 = require( 'D3.Matrix4' );

	function OrthographicCamera ( left, right, top, bottom, near, far ) {

		Camera.call( this );

		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;

		this.near = ( near !== undefined ) ? near : 0.1;
		this.far = ( far !== undefined ) ? far : 2000;

		this.updateProjectionMatrix( );

	}

	OrthographicCamera.prototype = Object.create( Camera.prototype );
	
	OrthographicCamera.prototype.updateProjectionMatrix = function( ) {
		this.projectionMatrix.makeOrthographic( this.left, this.right, this.top, this.bottom, this.near, this.far );
	};

	module.exports = Camera;

} );