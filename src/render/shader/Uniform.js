define( function( require, exports, module ) {

	function Uniform( n, t, v, GL, shaderProgram ){

		this.name = n;
		this.type = t;
		this.value = v;
		
		this.location = undefined;

		if( v !== undefined && !!GL && !!shaderProgram ){
			this.makeValue( v, GL, shaderProgram );
		}

	}

	Uniform.prototype.makeLocation = function( GL, shaderProgram ) {
		
		this.location = GL.getUniformLocation( shaderProgram, this.name );

	};

	Uniform.prototype.makeValue = function( v, GL, shaderProgram ){

		this.value = v;

		if( GL && shaderProgram && this.location === undefined ){
			this.makeLocation( GL, shaderProgram );
		}

		if( this.type.substr( 0, 6 ) === 'Matrix' ){
			GL[ 'uniform' + this.type ]( this.location, false, v );
		}else{
			GL[ 'uniform' + this.type ]( this.location, v );
		}

	};

	module.exports = Uniform;

} );