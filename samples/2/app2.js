define( function( require, exports, module ) {

	var D3 = require( 'D3' );

	var view = new D3.View( new D3.CSS3DRenderer( ) );

	var num = 7;

	var haf = num / 2;

	view.camera.position( ).z( 940 );

	for( i = 0; i < num; i++ ){
		var o = new D3.CSS3D( document.createElement( 'div' ) ),
			ele = o.element;
		ele.className = 'samples';
		ele.style.left = ( i - haf + 0.5 ) * 220 + 'px';
		view.scene.add( o );
	}

} );