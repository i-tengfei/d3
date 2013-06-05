define( function( require, exports, module ) {

	var Engine = require( 'D3.Engine' );
	var Events = require( 'D3.Events' );
	var OrbitController = require( 'D3.OrbitController' );

	var Scene = require( 'D3.Scene' ),
		Camera = require( 'D3.Camera' ),
		Renderer = require( 'D3.Renderer' );

	var PerspectiveCamera = require( 'D3.PerspectiveCamera' ),
		WebGLRenderer = require( 'D3.WebGLRenderer' );

	var Vec2 = require( 'D3.Vec2' );

	function View( sc, ca, re, ro ){

		var scene, camera, renderer, root;
		for( var i = 0, il = arguments.length; i < il; i++ ){

			var x = arguments[i];

			if( x instanceof Scene ) scene = x
			else if( x instanceof Camera ) camera = x
			else if( x instanceof Renderer ) renderer = x
			else root = x;

		}

		scene = this.scene = scene || new Scene( );
		camera = this.camera = camera || new PerspectiveCamera( );
		renderer = this.renderer = renderer || new WebGLRenderer( );
		root = root || document.body;

		this.eventsElement = renderer.element( );
		
		this.root( root );
		this.size( root.offsetWidth, root.offsetHeight );
		
		this.controller( OrbitController );

		Engine.addView( this );

	}

	Events.mixTo( View );

	View.BEFORE_RENDER = 'beforeRender';


	View.prototype.root = function( root ){
		if( root ){
			this.__root = root;
			this.__root.appendChild( this.renderer.element( ) );
		}else{
			return this.__root;
		}
	};

	View.prototype.size = function( w, h ){

		var element = this.renderer.element( );

		if( w === undefined ){
			
			return new Vec2( this.__width || element.width, this.__height || element.height );

		}else if( w instanceof Vec2 && h === undefined ){

			this.__width = w.x;
			this.__height = w.y;
			
		}else if( typeof w === 'number' && typeof h === 'number' ){

			this.__width = w;
			this.__height = h;

		}

		this.renderer.size( this.__width, this.__height );
		this.camera.aspect = this.__width / this.__height;
		this.camera.updateProjectionMatrix( );

	};

	View.prototype.controller = function( Controller ){

		if( typeof Controller === 'function' ){
			
			this.__controller = new Controller( this );

		}

		return this.__controller;

	};

	View.prototype.render = function( ){

		this.trigger( View.BEFORE_RENDER );
		this.camera.lookAt( );
		this.renderer.render( this.scene, this.camera );

	};

	View.prototype.update = function( func ){

		this.on( View.BEFORE_RENDER, func );

	};
	
	module.exports = View;

} );