define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Object3D = require( 'D3.Object3D' );

	function Display( geometry, material ){

		Object3D.call( this );

		this.geometry = geometry;
		this.material = material;
		this.visible = true;

	}

	Display.prototype = Object.create( Object3D.prototype );

	Display.prototype.__type__ = D3.objectTypes.DISPLAY;
	Display.prototype.drawType = D3.drawTypes.TRIANGLES;

	module.exports = Display;

} );