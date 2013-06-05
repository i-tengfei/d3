define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Display = require( 'D3.Display' );

	function CSS3D( element ){

		Display.call( this );

		this.element = element;
		this.element.style.position = "absolute";
		this.element.style.WebkitTransformStyle = 'preserve-3d';
		this.element.style.MozTransformStyle = 'preserve-3d';
		this.element.style.oTransformStyle = 'preserve-3d';
		this.element.style.transformStyle = 'preserve-3d';

	}

	CSS3D.prototype = Object.create( Display.prototype );
	CSS3D.prototype.__type__ = D3.objectTypes.CSS3D;

	module.exports = CSS3D;

} );