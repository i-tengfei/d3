define( function( require, exports, module ) {

	var Vec3 = require( 'D3.Vec3' );
	var Mat4 = require( 'D3.Mat4' );

	function Object3D( ){

		this.matrix       = new Mat4( );
		this.matrixWorld  = new Mat4( );

		this.__position = new Vec3( );
		this.__rotation = new Vec3( );

		this.parent = undefined;
		this.children = [];

		this.up = new Vec3( 0, 1, 0 );

		this.target = new Vec3( );

		this.matrixNeedUpdate = true;

		this.__resetAccessor( );

	}


	Object3D.prototype.position = function( x, y, z ){

		if( x === undefined ){
			return this.__position;
		}else{
			return this.__position.val( x, y, z );
		}

	};
	Object3D.prototype.rotation = function( x, y, z ){

		if( x === undefined ){
			return this.__rotation;
		}else{
			return this.__rotation.val( x, y, z );
		}

	};


	Object3D.prototype.positionWorld = function( ){
		
		return this.localToWorld( this.__position.clone( ) );

	};


	Object3D.prototype.add = function( child ) {

		if( arguments.length > 1 ){

			for( var i = 0, il = arguments.length; i < il; i++ ){
				this.add( arguments[i] );
			}

		}else if( Array.isArray( child ) ){

			for( var i = 0, il = child.length; i < il; i++ ){
				this.add( child[i] );
			}

		} else if( child instanceof Object3D ) {

			if( !!child.parent ) {
				child.parent.remove( child );
			}

			child.parent = this;
			this.children.push( child );

		} else {

			throw( '子对象必须继承于 Object3D' );

		}

	};
	Object3D.prototype.remove = function( child ) {

		var ind = this.children.indexOf( child );

		if( ~ind ) {

			this.children.splice( ind, 1 );

		}

	};


	Object3D.prototype.updateMatrix = function( ){

		this.matrix.makePosition( this.position( ) );
		this.matrix.makeRotation( this.rotation( ) );

	};
	Object3D.prototype.updateMatrixWorld = function( force ){

		if ( this.matrixNeedUpdate || force ) {

			this.updateMatrix( );

			if ( this.parent === undefined ) {

				this.matrixWorld.val( this.matrix );

			} else {

				this.matrixWorld.multiply( this.parent.matrixWorld, this.matrix );

			}

			this.matrixNeedUpdate = false;
			force = true;

		}

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	};

	Object3D.prototype.__resetAccessor = function( ){

		var __this__ = this;

		var position = this.__position,
			rotation = this.__rotation;

		position._x_ = position.x;
		position.x = function( x ){

			if( x !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return this._x_( x );

		};
		position._y_ = position.y;
		position.y = function( y ){

			if( y !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return this._y_( y );

		};
		position._z_ = position.z;
		position.z = function( z ){

			if( z !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return position._z_( z );

		};


		rotation._x_ = rotation.x;
		rotation.x = function( x ){

			if( x !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return this._x_( x );

		};
		rotation._y_ = rotation.y;
		rotation.y = function( y ){

			if( y !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return this._y_( y );

		};
		rotation._z_ = rotation.z;
		rotation.z = function( z ){

			if( z !== undefined ){
				__this__.matrixNeedUpdate = true;
			}
			return rotation._z_( z );

		};

	};

	module.exports = Object3D;

} );