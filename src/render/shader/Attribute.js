define( function( require, exports, module ) {

	function Attribute( n, size, value ){

		this.name = n;
		this.size = size;
		this.value = value;
		this.dirty = true;

		this.location = undefined;

	}

	Attribute.prototype.makeLocation = function( GL, shaderProgram ) {
		
		this.location = GL.getAttribLocation( shaderProgram, this.name );

	};

	Attribute.prototype.makeValue = function( GL, shaderProgram ){

		if( GL && shaderProgram && this.location === undefined ){
			this.makeLocation( GL, shaderProgram );
		}

		if( this.dirty ) {

			if( !this.__buffer ) {

				this.__buffer = GL.createBuffer( );
			
			}

			GL.bindBuffer( GL.ARRAY_BUFFER, this.__buffer );
			GL.bufferData( GL.ARRAY_BUFFER, this.value, GL.STATIC_DRAW );
			this.dirty = false;

		}

		if( ~this.location ){
			GL.bindBuffer( GL.ARRAY_BUFFER, this.__buffer );
			GL.vertexAttribPointer( this.location, this.size, GL.FLOAT, false, 0, 0 );
		}

	};

	module.exports = Attribute;

} );