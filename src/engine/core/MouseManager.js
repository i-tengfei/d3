define( function( require, exports, module ) {

	var Events = require( 'D3.Events' );
	var KeyManager = require( 'D3.KeyManager' );
	var listenEvents = require( 'D3.listenEvents' );

	function MouseManager( element ){

		var keyManager = new KeyManager( element );
		keyManager.bindKey( 0, KeyManager.LEFT );
		keyManager.bindKey( 1, KeyManager.MIDDLE );
		keyManager.bindKey( 2, KeyManager.RIGHT );
			
		var domEvents = keyManager.domEvents;

		var __this__ = this;

		keyManager.on( KeyManager.KEY_DOWN, function( name, event ) {

			if ( keyManager.isContainedOne( KeyManager.LEFT ) ) {
				__this__.trigger( MouseManager.LEFT_DOWN, event );
			}
		
			if ( keyManager.isContainedOne( KeyManager.MIDDLE ) ) {
				__this__.trigger( MouseManager.MIDDLE_DOWN, event );
			}
		
			if ( keyManager.isContainedOne( KeyManager.RIGHT ) ) {
				__this__.trigger( MouseManager.RIGHT_DOWN, event );
			}
		
		} );

		keyManager.on( KeyManager.KEY_UP, function( name, event ) {

			if ( name === KeyManager.LEFT ) {
				__this__.trigger( MouseManager.LEFT_UP, event );
			}
			if ( name === KeyManager.RIGHT ) {
				__this__.trigger( MouseManager.RIGHT_UP, event );
			}
		
		} );

		domEvents.on( listenEvents.MOUSE_MOVE, function( event ) {
			
			__this__.trigger( MouseManager.MOVE, event );
			if ( keyManager.isContainedOne( KeyManager.LEFT ) ) {
				__this__.trigger( MouseManager.DRAG, event );
			}
			if ( keyManager.isContainedOne( KeyManager.RIGHT ) ) {
				__this__.trigger( MouseManager.RIGHT_DRAG, event );
			}

		} );

		domEvents.on( listenEvents.MOUSE_WHEEL, function( delta, event ) {

			__this__.trigger( MouseManager.WHEEL, delta, event );
		
		} );
		
	}

	Events.mixTo( MouseManager );

	MouseManager.LEFT_DOWN		= 'mouseLeftDown';
	MouseManager.MIDDLE_DOWN	= 'mouseMiddleDown';
	MouseManager.RIGHT_DOWN		= 'mouseRightDown';
	MouseManager.LEFT_UP		= 'mouseLeftUp';
	MouseManager.RIGHT_UP		= 'mouseRightUp';
	MouseManager.CLICK			= 'mouseClick';
	MouseManager.DRAG			= 'mouseDrag';
	MouseManager.RIGHT_DRAG		= 'mouseRightDrag';
	MouseManager.WHEEL			= 'mouseWheel';
	MouseManager.MOVE			= 'mouseMove';


	module.exports = MouseManager;

} );