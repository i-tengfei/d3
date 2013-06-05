define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );
	var Vec3 = require( 'D3.Vec3' );
	var Mat4 = require( 'D3.Mat4' );
	var Ray = require( 'D3.Ray' );
	var Sphere = require( 'D3.Sphere' );
	var Plane = require( 'D3.Plane' );
	var Triangle = require( 'D3.Triangle' );

	function Raycaster ( origin, direction, near, far ) {

		this.ray = new Ray( origin, direction );

		if ( this.ray.direction.lengthSquared( ) > 0 ) {

			this.ray.direction.normalize( );

		}

		this.near = near || 0;
		this.far = far || Infinity;

	};

	Raycaster.prototype.intersectOne = function( object, intersects ){

		if( object.__type__ === D3.objectTypes.MESH ){

			matrixPosition.makePosition( object.matrixWorld );

			sphere.val(
				matrixPosition,
				object.geometry.boundingSphere( ).radius * object.matrixWorld.maxScaleOnAxis( ) );

			if ( ! this.ray.intersectionSphere( sphere ) ) {

				return intersects;

			}

			var geometry = object.geometry;
			var positions = geometry.positions;

			var side = object.material.side;

			var a, b, c, d;
			var precision = this.precision;

			inverseMatrix.invert( object.matrixWorld );

			localRay.val( this.ray ).applyMat4( inverseMatrix );

			for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				var face = geometry.faces[ f ];

				var material = object.material;

				if ( material === undefined ) continue;

				facePlane.setFromNormalAndCoplanarPoint( face.normal, positions[ face.v1( ) ] );

				var planeDistance = localRay.distancePlane( facePlane );
				// 和面平行
				if ( Math.abs( planeDistance ) < precision ) continue;

				// 负距离
				if ( planeDistance < 0 ) continue;

				side = material.side;
				if ( side !== D3.sideTypes.DOUBLE ) {

					var planeSign = localRay.direction.dot( facePlane.normal );

					if ( ! ( side === D3.sideTypes.FRONT ? planeSign < 0 : planeSign > 0 ) ) continue;

				}

				// 距离
				if ( planeDistance < this.near || planeDistance > this.far ) continue;

				intersectPoint = localRay.at( planeDistance, intersectPoint );

				if ( !face.v4 ) {

					a = positions[ face.v1( ) ];
					b = positions[ face.v2( ) ];
					c = positions[ face.v3( ) ];

					if ( ! Triangle.containsPoint( intersectPoint, a, b, c ) ) continue;

				} else {

					a = positions[ face.v1( ) ];
					b = positions[ face.v2( ) ];
					c = positions[ face.v3( ) ];
					d = positions[ face.v4( ) ];

					if ( ( ! Triangle.containsPoint( intersectPoint, a, b, d ) ) &&
						 ( ! Triangle.containsPoint( intersectPoint, b, c, d ) ) ) continue;

				}

				intersects.push( {

					distance: planeDistance,
					point: this.ray.at( planeDistance ),
					face: face,
					faceIndex: f,
					object: object

				} );

			}
		}

	};

	Raycaster.prototype.intersect = function ( objects, recursive ) {

		if( !Array.isArray( objects ) ){

			objects = [ objects ];

		}

		var intersects = [ ];

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			this.intersectOne( objects[ i ], intersects );

			// if ( recursive === true ) {

				// intersectDescendants( objects[ i ], intersects );

			// }
		}

		intersects.sort( descSort );

		return intersects;

	};

	function descSort ( a, b ) {

		return a.distance - b.distance;

	};

	var localRay = new Ray( );
	var matrixPosition = new Vec3( );
	var intersectPoint = new Vec3( );
	var sphere = new Sphere( );
	var facePlane = new Plane( );
	var inverseMatrix = new Mat4( );

	module.exports = Raycaster;

} );