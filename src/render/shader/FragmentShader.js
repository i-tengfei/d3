define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Shader = require( 'D3.Shader' );
	var shaderLibrary = require( 'D3.shaderLibrary' );

	function FragmentShader( source ){
		
		Shader.call( this, D3.shaderTypes.FRAGMENT, source );

	}

	FragmentShader.prototype = Object.create( Shader.prototype );

	FragmentShader.prototype.combine = function( ){

		var hooks = this.hooks( );

		return [

			'#ifdef GL_ES',
			'precision highp float;',
			'#endif',

			'uniform vec3 uColor;',
			
			'varying vec4 vViewPosition;',

			hooks.fragmentDefines,

			'void main( void ) {',

				'vec4 finalColor = vec4( uColor, 1.0 );',

				hooks.fragmentExecutions,

				'gl_FragColor = finalColor;',

			'}'

		].join( '\n' );

	};

	module.exports = FragmentShader;

} );