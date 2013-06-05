define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Vec3 = require( 'D3.Vec3' );

	function Material( values ){

		this.color = new Vec3( Math.random( ), Math.random( ), Math.random( ) );
		this.vertexColor = false;
		this.static = false;
		this.side = D3.sideTypes.FRONT;
		this.map = null;

		this.values( values );

	}

	Material.prototype.values = function ( values ) {

		if ( values === undefined ){

			return {
				color : [ this.color.r( ), this.color.g( ), this.color.b( ) ],
				vertexColor : this.vertexColor,
				static : this.static,
				side : this.side,
				map : this.map ? this.map.url : null
			}

		} else {

			for ( var key in values ) {

				var newValue = values[ key ];

				if ( key in this ) {

					var currentValue = this[ key ];

					// TODO: 图片路径验证
					// Array( 3 ) to Vec3
					if ( currentValue instanceof Vec3 && Array.isArray( newValue ) && newValue.length === 3 ) {

						currentValue.val( newValue );

					} else {

						this[ key ] = newValue;

					}

				}

			}

		}

	};


	module.exports = Material;

} );