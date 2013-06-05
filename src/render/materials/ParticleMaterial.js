define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Vec3 = require( 'D3.Vec3' );
	var Material = require( 'D3.Material' );


	function ParticleMaterial( values ){

		this.size = 1;

		Material.call( this, values );

	}

	ParticleMaterial.prototype = Object.create( Material.prototype );

	ParticleMaterial.prototype.values = function ( values ) {

		var v = Material.prototype.values.call( this, values );

		if ( v !== undefined ){

			v.size = 1;
			return v;

		}

	};


	module.exports = ParticleMaterial;

} );