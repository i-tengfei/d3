define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Display = require( 'D3.Display' );

	function Mesh( geometry, material ){

		Display.call( this );

		this.geometry = geometry;
		this.material = material;

	}

	Mesh.prototype = Object.create( Display.prototype );
	
	Mesh.prototype.__type__ = D3.objectTypes.MESH;
	Mesh.prototype.drawType = D3.drawTypes.TRIANGLES;

	module.exports = Mesh;

} );