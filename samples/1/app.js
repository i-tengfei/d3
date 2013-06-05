define( function( require, exports, module ) {

	var D3 = require( 'D3' );

	var imgWidth = 0, imgHeight = 0, buf1 = [ ], buf2 = [ ], intersects = [];

	var image = new Image( );
	image.src = './1.png';

    image.onload = function( ){
		
		var texels = imageData( this );

		var positions = [ ],
			colors = [ ];

		imgWidth = texels.width;
		imgHeight = texels.height;

		for ( var x = 0; x < texels.width; x ++ )
		for ( var y = 0; y < texels.height; y ++ ) {

			var i = 4 * ( y * texels.width + x );

			var r = texels.data[   i   ] / 255,
				g = texels.data[ i + 1 ] / 255,
				b = texels.data[ i + 2 ] / 255,
				a = texels.data[ i + 3 ] / 255;

			buf1.push( 0 );
			buf2.push( 0 );
			positions.push( x - texels.width / 2, y - texels.height / 2, /* -r * g * b * 100*/ 0 );
			colors.push( r, g, b );

		}

		buf1 = new Float32Array( buf1 );
		buf2 = new Float32Array( buf2 );

		start( positions, colors );

	};


	function start( positions, colors ){

		var vds = [

			'attribute float buf1;'

		].join( '\n' );
		var ves = [

			'finalPosition.z = buf1;'

		].join( '\n' );
		

		var mat = new D3.ParticleMaterial( { vertexColor:true } );
		mat.static = true;
		
		var vertexShader = mat.vertexShader = new D3.VertexShader( )
		vertexShader.define( vds );
		vertexShader.execution( ves );

		mat.attributes = [ ];
		var aBuf1 = new D3.Attribute( 'buf1', 1, buf1 );
		mat.attributes.push( aBuf1 );



		var geo = new D3.Geometry( );

		geo.vertexPosition.value = new Float32Array( positions );
		geo.vertexPosition.dirty = true;

		geo.vertexColor.value = new Float32Array( colors );
		geo.vertexColor.dirty = true;

		var particle = new D3.Particle( geo, mat );
		var mesh = new D3.Mesh( new D3.PlaneGeometry( imgWidth, imgHeight ), new D3.Material( ) );
		mesh.visible = false;

		mesh.rotation( ).y( Math.PI );

		var view = new D3.View( );
		view.camera.position( ).z( -940 );
		view.controller( ).reset( );

		particle.rotation( Math.PI, Math.PI, 0 );

		view.scene.add( particle, mesh );

		view.update( function( ){

			if ( intersects.length ) {

				var point = intersects[ 0 ].point;
				var y = Math.floor( -( point.x( ) - imgWidth / 2 ) );
				var x = Math.floor( -( point.y( ) - imgHeight / 2 )  );

				buf1[ x + y * imgHeight ] = -100;

			}

			RippleSpread( );
			aBuf1.dirty = true;

		} );

		
		var projector = new D3.Projector( );
		document.addEventListener( 'mousemove', function( event ){

			var camera = view.camera;
			var vector = new D3.Vec3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
			projector.unprojectVector( vector, camera );

			var raycaster = new D3.Raycaster( camera.position( ), vector.sub( camera.position( ) ).normalize( ) );

			intersects = raycaster.intersect( mesh );

		} );


	}


	function RippleSpread( ){

		for ( var i = 0, l = imgWidth * imgHeight; i < l; i++ ) {
	        
	        var x1, x2, y1, y2;
	        
	        if ( i % imgWidth == 0 ) {

	            x1 = 0;
	            x2 = buf1[ i + 1 ];
	        
	        } else if ( i % imgWidth == imgWidth - 1 ) {

	            x1 = buf1[ i - 1 ];
	            x2 = 0;
	        
	        } else {
	            
	            x1 = buf1[ i - 1 ];
	            x2 = buf1[ i + 1 ];
	        
	        }
	        
	        if ( i < imgHeight ) {

	            y1 = 0;
	            y2 = buf1[ i + imgHeight ];
	        
	        } else if ( i > l - imgHeight - 1 ) {

	            y1 = buf1[ i - imgHeight ];
	            y2 = 0;
	        
	        } else {
	            
	            y1 = buf1[ i - imgHeight ];
	            y2 = buf1[ i + imgHeight ];
	        
	        }
	        
	        buf2[ i ] = ( x1 + x2 + y1 + y2 ) / 1.9 - buf2[ i ];
	        buf2[ i ] -= buf2[ i ] / 10;
	    
	    }
	    
	    temp = buf1;
	    buf1 = buf2;
	    buf2 = temp;

	}


	function imageData ( image ) {

		var data = [];

		var rate = 1,
			imageCanvas = document.createElement( 'canvas' ),
			w = imageCanvas.width = image.width, h = imageCanvas.height = image.height,
			imageCtx = imageCanvas.getContext( '2d' );

		imageCtx.drawImage( image, 0, 0, w, h, 0, 0, w * rate, h * rate );

		return imageCtx.getImageData( 0, 0, w * rate, h * rate );

	}

} );