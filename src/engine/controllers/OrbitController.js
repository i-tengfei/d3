define( function( require, exports, module ) {

	var MouseManager = require( 'D3.MouseManager' );
	var Vec3 = require( 'D3.Vec3' )

	var PIXELS_PER_ROUND = 1800;

	function OrbitController( view ){

		var mouseManager = this.__mouseManager = new MouseManager( view.eventsElement );

		var camera = this.camera = view.camera;

		var values = this.values = {};
		values.radius = 0;
		values.theta = 0;
		values.phi = 0;
		values.center = new Vec3( );

		this.rotateSpeed = 2;
		this.zoomSpeed = 1;
		this.panSpeed = 2;

		this.center = new Vec3( );

		this.reset( camera );


		var __this__ = this;


		mouseManager.on( MouseManager.DRAG, function( event ){

			__this__.rotate( event.dx, event.dy );
		
		} );

		mouseManager.on( MouseManager.WHEEL, function( delta ){
			
			__this__.zoom( delta );
		
		} );

		mouseManager.on( MouseManager.RIGHT_DRAG, function( event ){

			__this__.pan( event.dx, event.dy );

		} );

		view.update( function( ){

			var values = __this__.values;

			if ( values.radius < 0.0001 ) return false;
			var minPhi = 0.0001, maxPhi = Math.PI, minTheta, maxTheta;
			values.phi = Math.max( minPhi, Math.min( maxPhi, values.phi ) );

			var values = __this__.handle( values );

			__this__.center.val( values.center );

			camera.position( ).val( __this__.center ).add( sph2cart( values.radius, values.theta, values.phi ) );
			
			camera.target.val( __this__.center );

		} );

	}

	OrbitController.prototype.handle = function( values ){
		return values;
	};

	OrbitController.prototype.reset = function( camera ) {

		var camera = camera || this.camera;
		var values = this.values;

		var offset = camera.position( ).clone( ).sub( this.center );
		console.log( camera );

		values.radius = offset.length( );
		values.theta = Math.atan2( offset.x( ), offset.z( ) );
		values.phi = Math.atan2( Math.sqrt( offset.x( ) * offset.x( ) + offset.z( ) * offset.z( ) ), offset.y( ) );

	};

	OrbitController.prototype.rotate = function( x, y ){

		var values = this.values;

		values.theta -= 2 * Math.PI * x / PIXELS_PER_ROUND * this.rotateSpeed;
		values.phi -= 2 * Math.PI * y / PIXELS_PER_ROUND * this.rotateSpeed;

	};

	OrbitController.prototype.zoom = function( delta ){

		var v = Math.pow( 0.95, this.zoomSpeed );
		var values = this.values;

		if( delta < 0 ){
			values.radius /= v;
		}else if( delta > 0 ){
			values.radius *= v;
		}

	};

	OrbitController.prototype.pan = function( x, y ){

		// var camera = this.camera;
		// var distance = new Vec3( - x, y, 0 )

		// distance.transformDirection( camera.matrix );
		// distance.multiply( camera.position( ).length( ) * this.panSpeed * 0.0015 );

		// this.values.center.add( distance );

	};


	function sph2cart( r, theta, phi ) {
		return __v3_1.val( r * Math.sin( phi ) * Math.sin( theta ), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(theta));
	}

	var __v3_1 = new Vec3( );

	module.exports = OrbitController;

} );