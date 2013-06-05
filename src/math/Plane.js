define( function( require, exports, module ) {

	var Vec3 = require( 'D3.Vec3' );

	function Plane( normal, constant ){

		this.normal = ( normal !== undefined ) ? normal : new Vec3( 1, 0, 0 );
		this.constant = ( constant !== undefined ) ? constant : 0;

	}

	Plane.prototype.val = function( normal, constant ) {
		
		this.normal.val( normal );
		this.constant = constant;

		return this;

	};
	Plane.prototype.setFromNormalAndCoplanarPoint = function ( normal, point ) {

		this.normal.val( normal );
		this.constant = - point.dot( this.normal );

		return this;

	};

	module.exports = Plane;

} );