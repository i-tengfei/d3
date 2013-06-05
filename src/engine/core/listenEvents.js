define( function( require, exports, module ) {

	var Events = require( 'D3.Events' );

	var elements = {};
	var eid = 0;

	function listenEvents( element ){

		element.id || ( element.id = 'listenEvents' + eid );
		var basis = element.id;
		var el = elements[ basis ];
		if( !el ){
			el = elements[ basis ] = new DomEvents( element );
			eid++;
		}
		return el;
		
	}

	listenEvents.CONTEXT_MENU	= 'contextMenu';
	listenEvents.MOUSE_WHEEL	= 'mouseWheel';

	listenEvents.MOUSE_MOVE	= 'mouseMove';
	listenEvents.MOUSE_DOWN	= 'mouseDown';
	listenEvents.MOUSE_UP	= 'mouseUp';
	listenEvents.MOUSE_OUT	= 'mouseOut';

	listenEvents.KEY_DOWN	= 'keyDown';
	listenEvents.KEY_UP		= 'keyUp';

	// --------------- Key Down --------------- //
	document.addEventListener( 'keydown', function( event ) {

		for( dom in elements ){
			var __this__ = elements[ dom ];
			__this__.__event.elementEvent = event;
			__this__.trigger( listenEvents.KEY_DOWN, __this__.__event );
		}
	
	} );

	// --------------- Key Up --------------- //
	document.addEventListener( 'keyup', function( event ) {

		for( dom in elements ){
			var __this__ = elements[ dom ];
			__this__.__event.elementEvent = event;
			__this__.trigger( listenEvents.KEY_UP, __this__.__event );
		}
		
	} );

	function DomEvents( element ) {
	
		this.element = element;
		this.__event = {};

		var __this__ = this;
		
		// --------------- Context Menu --------------- //
		element.addEventListener( 'contextmenu', function( event ) {

			__this__.__event.elementEvent = event;
			__this__.trigger( listenEvents.CONTEXT_MENU, __this__.__event );
	
		} );

		// --------------- MouseMove --------------- //
		element.addEventListener( 'mousemove', function( event ) {
			
			__this__.__event.elementEvent = event;
			var e = __this__.__event;
			var nx = e.pageX = event.pageX, ny = e.pageY = event.pageY;
			
			e.screenX = event.screenX; e.screenY = event.screenY;
			e.offsetX = event.offsetX; e.offsetY = event.offsetY;

			e.dx = nx - e.ox;	e.dy = ny - e.oy;

			__this__.trigger( listenEvents.MOUSE_MOVE, e );
			
			e.ox = nx;	e.oy = ny;
		
		} );

		// --------------- MouseWheel --------------- //
		// Chrome
		element.addEventListener( 'mousewheel', function( event ) {

			__this__.trigger( listenEvents.MOUSE_WHEEL, event.wheelDelta > 0 ? 1 : -1 );
		
		} );
		// FF
		element.addEventListener( 'DOMMouseScroll', function( event ) {

			__this__.trigger( listenEvents.MOUSE_WHEEL, -event.detail > 0 ? 1 : -1 );
		
		} );

		// --------------- Mouse Out --------------- //
		element.addEventListener( 'mouseout', function( event ) {

			if( __this__.checkFather( event ) ){
				__this__.__event.elementEvent = event;
				__this__.trigger( listenEvents.MOUSE_OUT, __this__.__event );
			}
		
		} );

		// --------------- Mouse Down --------------- //
		element.addEventListener( 'mousedown', function( event ) {

			__this__.__event.elementEvent = event;
			__this__.trigger( listenEvents.MOUSE_DOWN, __this__.__event );

		} );

		// --------------- Mouse Up --------------- //
		element.addEventListener( 'mouseup', function( event ) {

			__this__.__event.elementEvent = event;
			__this__.trigger( listenEvents.MOUSE_UP, __this__.__event );
		
		} );

	}

	Events.mixTo( DomEvents );

	DomEvents.prototype.getEvent = function( ){
		return this.__event;
	};

	DomEvents.prototype.checkFather = function( e ){

		var parent = e.relatedTarget,
		element = this.element;
		
		try {
			while ( parent && parent !== element ) {
				parent = parent.parentNode; 
			}
			return (parent !== element);
		} catch( e ) { }

	};

	module.exports = listenEvents;

} );