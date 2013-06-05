define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Shader = require( 'D3.Shader' );
	var shaderLibrary = require( 'D3.shaderLibrary' );

	function VertexShader( source ){
		
		Shader.call( this, D3.shaderTypes.VERTEX, source );

	}

	VertexShader.prototype = Object.create( Shader.prototype );

	VertexShader.prototype.combine = function( ){

		var hooks = this.hooks( );

		return [

			'uniform mat4 uProjectionMatrix;',
			'uniform mat4 uCameraViewMatrix;',
			'uniform mat4 uModelWorldMatrix;',
			'uniform vec2 uViewport;',

			'attribute vec3 aVertexPosition;',

			'varying vec4 vViewPosition;',

			hooks.vertexDefines,

			'void main(void) {',

				'vec4 finalPosition = vec4( aVertexPosition, 1.0 );',
				hooks.vertexExecutions,
				'vViewPosition = uCameraViewMatrix * uModelWorldMatrix * finalPosition;',
				'gl_Position = uProjectionMatrix * vViewPosition;',

			'}'

		].join( '\n' );

	};

	module.exports = VertexShader;

} );