define( function( require, exports, module ) {

	var shaderLibrary = require( 'D3.shaderLibrary' );

	function Shader( type, source ){

		this.type = type;

		source && this.source( source );
		this.__hooks = [ ];

		this.__defines 		= [ ];
		this.__executions 	= [ ];
	
	}

	Shader.prototype.define = function( v ){
		this.__defines.push( v );
	};

	Shader.prototype.execution = function( v ){
		this.__executions.push( v );
	};

	Shader.prototype.hook = function( part ){
		
		this.__hooks.push( part );

	};

	Shader.prototype.create = function( GL ){

		var shader;

		if( this.type === 'vertex' ){

			shader = GL.createShader( GL.VERTEX_SHADER );

		}else if( this.type === 'fragment' ){

			shader = GL.createShader( GL.FRAGMENT_SHADER );

		}

		this.value = shader;

		var source = this.source( );

		GL.shaderSource( shader, source );
		GL.compileShader( shader );

		if ( !GL.getShaderParameter( shader, GL.COMPILE_STATUS ) ) {
			console.error( GL.getShaderInfoLog( shader ) );
			console.error( source );
		}

		return shader;

	};

	Shader.prototype.source = function( source ){

		if( source === undefined ){
			return this.__source = this.__source || this.combine( );
		}else{
			this.__source = source;
		}

	};

	Shader.prototype.hooks = function( ){

		var hooks = this.__hooks;

		for( var i = 0, il = hooks.length; i < il; i++ ){

			this.define( 	shaderLibrary[ this.type ].defines[ 	hooks[ i ] ] );
			this.execution( shaderLibrary[ this.type ].executions[ 	hooks[ i ] ] );
		
		}

		var out = { };

		out[ this.type + 'Defines' ] 	= this.__defines.join( '\n' );
		out[ this.type + 'Executions' ] = this.__executions.join( '\n' );

		return out;

	};

	module.exports = Shader;

} );