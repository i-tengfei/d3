define( function( require, exports, module ) {

	var D3 = require( 'D3' );
	var Material = require( 'D3.Material' );

	function PhongMaterial( values ){

		Material.call( this, values );

		this.ambient = values.ambient || new Vector4( 1,1,1 );		// 环境光色彩
		this.specular = values.specular || new Vector4( .2,.2,.2 );	// 镜面反射色彩

	}

	module.exports = PhongMaterial;

} );