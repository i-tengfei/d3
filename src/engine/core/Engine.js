define( function( require, exports, module ) {

	var Events = require( 'D3.Events' );
	var Engine = new Events( );

	Engine.BEFORE_RENDER = 'beforeRender';
	Engine.AFTER_RENDER = 'afterRender';

	Engine.views = [];

	Engine.addView = function( view ){
		this.views.push( view );
	};

	Engine.update = function( func ){
		this.on( this.BEFORE_RENDER, func );
	};

	( function ( ){

		requestAnimationFrame( arguments.callee );

		Engine.trigger( Engine.BEFORE_RENDER );
		Engine.views.forEach( function( x ){
			x.render( );
		} );
		Engine.trigger( Engine.AFTER_RENDER );

	} )( );

	module.exports = Engine;

} );