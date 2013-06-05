define( function( require, exports, module ) {

	var Vec2 = require( 'D3.Vec2' );
	var Projector = require( 'D3.Projector' );

	function Renderer( element ){

		element = element || document.createElement( 'canvas' );

		this.__element = element;
		this.__context = this.createContext( element );

		this.__width = element.width || 500;
		this.__height = element.height || 300;
		
		this.projector = new Projector( );

		this.size( new Vec2( this.__width, this.__height ) );

	}



	Renderer.prototype.element = function( ){
		
		return this.__element;

	};
	Renderer.prototype.context = function( ){
		
		return this.__context;

	};



	Renderer.prototype.render = function( scene, camera ){

		this.clear( );
		this.projector.projectScene( scene, camera );

	};



	Renderer.prototype.size = function( w, h ){

		var element = this.element( );

		if( w === undefined ){
			
			return new Vec2( this.__width, this.__height );

		}else if( w instanceof Vec2 && h === undefined ){

			this.__width = w.x( );
			this.__height = w.y( );
			
		}else if( typeof w === 'number' && typeof h === 'number' ){

			this.__width = w;
			this.__height = h;

		}

		element.width = this.__width;
		element.height = this.__height;

	};



	Renderer.prototype.createContext = function( element ){	};
	Renderer.prototype.clear = function( ){	};



	module.exports = Renderer;

} );