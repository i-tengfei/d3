define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Renderer = require( 'D3.Renderer' );
	var Mathutils = require( 'D3.Mathutils' );

	function CSS3DRenderer( element ){

		this.cameraElement = document.createElement( 'div' );

		this.cameraElement.style.WebkitTransformStyle = 'preserve-3d';
		this.cameraElement.style.MozTransformStyle = 'preserve-3d';
		this.cameraElement.style.oTransformStyle = 'preserve-3d';
		this.cameraElement.style.transformStyle = 'preserve-3d';


		Renderer.call( this, element || document.createElement( 'div' ) );

		element = this.element( );
		element.style.overflow = 'hidden';

		element.style.WebkitTransformStyle = 'preserve-3d';
		element.style.WebkitPerspectiveOrigin = '50% 50%';

		element.style.MozTransformStyle = 'preserve-3d';
		element.style.MozPerspectiveOrigin = '50% 50%';

		element.style.oTransformStyle = 'preserve-3d';
		element.style.oPerspectiveOrigin = '50% 50%';

		element.style.transformStyle = 'preserve-3d';
		element.style.perspectiveOrigin = '50% 50%';


		element.appendChild( this.cameraElement );

	}

	CSS3DRenderer.prototype = Object.create( Renderer.prototype );
	
	CSS3DRenderer.prototype.render = function( scene, camera ){
		
		var size = this.size( );

		var fov = 0.5 / Math.tan( Mathutils.deg2Rad( camera.fov * 0.5 ) ) * size.y( );

		var element = this.element( );
		element.style.WebkitPerspective = fov + "px";
		element.style.MozPerspective = fov + "px";
		element.style.oPerspective = fov + "px";
		element.style.perspective = fov + "px";

		var projector = this.projector;

		var objects = projector.projectScene( scene, camera ).objects;

		var widthHalf = size.x( ) * 0.5, heightHalf = size.y( ) * 0.5;

		var style = 'translate3d(0,0,' + fov + 'px)' + this.cameraCSSMatrix( projector.cameraViewMatrix ) + ' translate3d(' + widthHalf + 'px,' + heightHalf + 'px, 0)';

		this.cameraElement.style.WebkitTransform = style;
		this.cameraElement.style.MozTransform = style;
		this.cameraElement.style.oTransform = style;
		this.cameraElement.style.transform = style;

		for ( var i = 0, il = objects.length; i < il; i ++ ) {

			var object = objects[ i ];

			if ( object.__type__ === D3.objectTypes.CSS3D ) {

				var element = object.element;
 
				style = this.objectCSSMatrix( object.matrixWorld );

				element.style.WebkitTransform = style;
				element.style.MozTransform = style;
				element.style.oTransform = style;
				element.style.transform = style;

				if ( !element.parentNode ) {

					this.cameraElement.appendChild( element );

				}

			}

		}

	};

	CSS3DRenderer.prototype.size = function( w, h ) {

		var v = Renderer.prototype.size.call( this, w, h );

		if( w !== undefined ){

			var size = this.size( );
			this.cameraElement.style.width = size.x( ) + 'px';
			this.cameraElement.style.height = size.y( ) + 'px';
		
		}

		return v;

	};

	CSS3DRenderer.prototype.epsilon = function ( value ) {
		return Math.abs( value ) < 0.000001 ? 0 : value;
	};

	CSS3DRenderer.prototype.cameraCSSMatrix = function ( matrix ) {

		var elements = matrix.array,
			epsilon = this.epsilon;

		return 'matrix3d(' +
			epsilon(   elements[ 0 ]  ) + ',' +
			epsilon( - elements[ 1 ]  ) + ',' +
			epsilon(   elements[ 2 ]  ) + ',' +
			epsilon(   elements[ 3 ]  ) + ',' +
			epsilon(   elements[ 4 ]  ) + ',' +
			epsilon( - elements[ 5 ]  ) + ',' +
			epsilon(   elements[ 6 ]  ) + ',' +
			epsilon(   elements[ 7 ]  ) + ',' +
			epsilon(   elements[ 8 ]  ) + ',' +
			epsilon( - elements[ 9 ]  ) + ',' +
			epsilon(   elements[ 10 ] ) + ',' +
			epsilon(   elements[ 11 ] ) + ',' +
			epsilon(   elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon(   elements[ 14 ] ) + ',' +
			epsilon(   elements[ 15 ] ) +
		')';

	};

	CSS3DRenderer.prototype.objectCSSMatrix = function ( matrix ) {

		var elements = matrix.array,
			epsilon = this.epsilon;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon(   elements[ 0 ]  ) + ',' +
			epsilon(   elements[ 1 ]  ) + ',' +
			epsilon(   elements[ 2 ]  ) + ',' +
			epsilon(   elements[ 3 ]  ) + ',' +
			epsilon( - elements[ 4 ]  ) + ',' +
			epsilon( - elements[ 5 ]  ) + ',' +
			epsilon( - elements[ 6 ]  ) + ',' +
			epsilon( - elements[ 7 ]  ) + ',' +
			epsilon(   elements[ 8 ]  ) + ',' +
			epsilon(   elements[ 9 ]  ) + ',' +
			epsilon(   elements[ 10 ] ) + ',' +
			epsilon(   elements[ 11 ] ) + ',' +
			epsilon(   elements[ 12 ] ) + ',' +
			epsilon(   elements[ 13 ] ) + ',' +
			epsilon(   elements[ 14 ] ) + ',' +
			epsilon(   elements[ 15 ] ) +
		')';

	};

	module.exports = CSS3DRenderer;

} );