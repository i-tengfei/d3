define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );

	function Map( url, callback ){

		var __this__ = this;

		this.ready = false;
		this.image = new Image( );
		this.wrapS = D3.wrapTypes.CLAMP_TO_EDGE;
		this.wrapT = D3.wrapTypes.CLAMP_TO_EDGE;
		this.url   = url;

		this.image.onload = function( ) {

			__this__.ready = true;
			callback && callback( );

		};

		this.image.src = url;

	}

	module.exports = Map;

} );