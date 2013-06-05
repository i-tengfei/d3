define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Display = require( 'D3.Display' );

	function Particle( geometry, material ){

		Display.call( this );

		this.geometry = geometry;
		this.material = material;

	}

	Particle.prototype = Object.create( Display.prototype );
	
	Particle.prototype.__type__ = D3.objectTypes.PARTICLE;
	Particle.prototype.drawType = D3.drawTypes.POINTS;

	module.exports = Particle;

} );