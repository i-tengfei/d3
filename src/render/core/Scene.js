define( function( require, exports, module ) {

	var Object3D = require( 'D3.Object3D' );

	function Scene( ){

		Object3D.call( this );
	
	}

	Scene.prototype = Object.create( Object3D.prototype );

	module.exports = Scene;

} );