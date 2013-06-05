define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );

	var Renderer = require( 'D3.Renderer' );

	var VertexShader = require( 'D3.VertexShader' );
	var FragmentShader = require( 'D3.FragmentShader' );
	var Uniform = require( 'D3.Uniform' );
	var Attribute = require( 'D3.Attribute' );
	
	var Vec2 = require( 'D3.Vec2' );
	var Vec3 = require( 'D3.Vec3' );
	var Mat4 = require( 'D3.Mat4' );



	function WebGLRenderer( element ){

		Renderer.call( this, element );

		this.GL = this.context( );

	}
	WebGLRenderer.prototype = Object.create( Renderer.prototype );



	WebGLRenderer.prototype.render = function( scene, camera ){

		Renderer.prototype.render.call( this, scene, camera );

		this.renderDisplayArray( this.projector.opaqueObjects );
		this.renderDisplayArray( this.projector.transparentObjects );

	};	



	WebGLRenderer.prototype.renderDisplayArray = function( renderArray ){

		var len = renderArray.length,
			renderable  = null;

		while( len-- ) {

			renderable = renderArray[ len ];
			this.renderDisplay( renderable );

		}

	};
	WebGLRenderer.prototype.renderDisplay = function( display ) {
		
		var GL = this.GL;

		var material	= display.material,
			geometry	= display.geometry;

		GL.enable( GL.CULL_FACE );

		this.prepareData( geometry, material )



		// ---------- ---------- | Shader | ---------- ---------- //
		var shaderProgram = material.shaderProgram;

		if( shaderProgram !== this.lastShaderProgram ) {

			this.disableAttribArrays( );
			GL.useProgram( shaderProgram );
			this.lastShaderProgram = shaderProgram;
			this.enableAttribArrays( );

		}



		// ---------- ---------- | Uniforms | ---------- ---------- //
		var uniforms = shaderProgram.uniforms
		
		// -- 基础 -- //
		uniforms.projectionMatrix.makeValue( this.projector.projectionMatrix.array, GL, shaderProgram );
		uniforms.cameraViewMatrix.makeValue( this.projector.cameraViewMatrix.array, GL, shaderProgram );
		uniforms.modelWorldMatrix.makeValue( display.matrixWorld.array, 			GL, shaderProgram );
		uniforms.viewport.makeValue( 		 this.size( ).val( ), 					GL, shaderProgram );
		uniforms.color.makeValue( 			 material.color.val( ), 				GL, shaderProgram );
		
		var uCustoms = uniforms.uCustoms;
		for( var u = 0, ul = uCustoms.length; u < ul; u++ ){
			uCustoms[ u ].makeValue( uCustoms[ u ].value, GL, shaderProgram );
		}

		// -- 粒子 -- //
		if( !! material.size ){
			uniforms.pointSize.makeValue( material.size, GL, shaderProgram );
		}

		// -- 贴图 -- //
		var map = material.map;
		if( !!map && map.ready ) {

			if( !map.data ) {
				this.processTexture( map );
			}

			GL.activeTexture( GL.TEXTURE0 + map.index );
			GL.bindTexture( GL.TEXTURE_2D, map.data );
			uniforms.map.makeValue( map.index, GL, shaderProgram );

		}



		// ---------- ---------- | Attributes | ---------- ---------- //
		var attributes = shaderProgram.attributes;

		// -- 基础 -- //
		attributes.vertexPosition.makeValue( GL, shaderProgram );

		var aCustoms = attributes.aCustoms;
		for( var a = 0, al = aCustoms.length; a < al; a++ ){
			aCustoms[ a ].makeValue( GL, shaderProgram );
		}

		// -- 顶点颜色 -- //
		if( !! material.vertexColor ){
			attributes.vertexColor.makeValue( GL, shaderProgram );
		}
			// vertexNormalAttribute	= attributes.aVertexNormal,
			// vertexTuvAttribute		= attributes.aVertexTuv,
			// aCustoms 				= attributes.aCustoms;

		// var uCustoms				= uniforms.uCustoms;
			// textureUniform			= uniforms.uTexture,
			// normalMatrixUniform		= uniforms.uNormalMatrix,




		// GL.uniformMatrix4fv( normalMatrixUniform, false, __m4.val( display.matrixWorld ).invert( ).transpose( ).array );


		// // Lights
		// for( var i = 0; i < D3.MAX_LIGHTS; i++ ){

		// 	light = this.projector.lights[ i ];
		// 	lightUniform = uniforms.uLights[ i ];

		// 	if( !!light ) {
				
		// 		var direction = __v3.sub( light.position, light.target ).normalize( );
		// 		var color = light.color.rgb.multiply( light.color.a );
		// 		GL.uniform1i( lightUniform.type, light.type );
		// 		GL.uniform3fv( lightUniform.direction, direction.array );
		// 		GL.uniform3fv( lightUniform.color, color.array );

		// 	}else{

		// 		GL.uniform1i( lightUniform.type, D3.lightTypes.NONE );
			
		// 	}
		
		// }

		// Customs
		// for( var u = uCustoms.length-1; u >= 0; u-- ){

		// 	var custom = uCustoms[ u ];
		// 	this.uniformData( custom.type, custom.location, custom.value );

		// }

		// Textures
		// var texture = material.texture;
		// if( !!texture && texture.ready && ~vertexTuvAttribute ) {

		// 	if( !texture.data ) {
		// 		this.processTexture( texture );
		// 	}

		// 	// set the texture
		// 	GL.activeTexture( GL.TEXTURE0 + texture.index );
		// 	GL.bindTexture( GL.TEXTURE_2D, texture.data );
		// 	GL.uniform1i( textureUniform, texture.index );

		// }


		// // Normal
		// if( ~vertexNormalAttribute ) {
		// 	GL.bindBuffer( GL.ARRAY_BUFFER, geometry.vertexNormal.buffer );
		// 	GL.vertexAttribPointer( vertexNormalAttribute, geometry.vertexNormal.size, GL.FLOAT, false, 0, 0 );
		// }

		// // Tuv
		// if( ~vertexTuvAttribute ){
		// 	GL.bindBuffer( GL.ARRAY_BUFFER, geometry.vertexTuv.buffer );
		// 	GL.vertexAttribPointer( vertexTuvAttribute, geometry.vertexTuv.size, GL.FLOAT, false, 0, 0);
		// }

		// ---------- ---------- | Draw | ---------- ---------- //
		if( material.static ){

			GL.drawArrays( this.d3ToGL( 'draw', display.drawType ), 0, geometry.vertexPosition.value.length / geometry.vertexPosition.size );

		}else{

			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, geometry.faceIndex.buffer );
			GL.drawElements( this.d3ToGL( 'draw', display.drawType ), geometry.faceIndex.array.length, GL.UNSIGNED_SHORT, 0 );

		}

	};



	WebGLRenderer.prototype.prepareData = function( geometry, material ){

		var GL = this.GL;


		// ========== ========== ============ ========== ========== //
		// ---------- ---------- | Geometry | ---------- ---------- //
		// ========== ========== ============ ========== ========== //
		var hint = GL.STATIC_DRAW;

		geometry.update( );

		var index = geometry.faceIndex;
		if( index.dirty ) {

			if( !index.buffer ) {
				
				index.buffer = GL.createBuffer( );
			
			}

			GL.bindBuffer( GL.ELEMENT_ARRAY_BUFFER, index.buffer );
			GL.bufferData( GL.ELEMENT_ARRAY_BUFFER, index.array, hint );
			index.dirty = false;

		}



		// ========== ========== ============ ========== ========== //
		// ---------- ---------- | Material | ---------- ---------- //
		// ========== ========== ============ ========== ========== //


		// ---------- ---------- | Init Shader Program | ---------- ---------- //
		if( !material.shaderProgram ){

			var vertexShader 	= material.vertexShader 	|| new VertexShader( ),
				fragmentShader 	= material.fragmentShader 	|| new FragmentShader( ),
				customUniforms 		= material.uniforms 	|| [ ],
				customAttributes 	= material.attributes 	|| [ ];

			var useMap 			= !! material.map,
				useVertexColor 	= !! material.vertexColor,
				useParticle 	= !! material.size;

			// 贴图
			if( useMap && !useParticle ){
				vertexShader.hook( 'MAP' );
				fragmentShader.hook( 'MAP' );
			}

			// 顶点颜色
			if( useVertexColor ){
				vertexShader.hook( 'VERTEX_COLOR' );
				fragmentShader.hook( 'VERTEX_COLOR' );
			}

			// 粒子
			if( useParticle ){
				vertexShader.hook( 'PARTICLE' );
				fragmentShader.hook( 'PARTICLE' );
			}

			// 粒子图片
			if( useMap && useParticle ){
				vertexShader.hook( 'PARTICLE_MAP' );
				fragmentShader.hook( 'PARTICLE_MAP' );
			}



			// ---------- Shader ---------- //
			var shaderProgram = material.shaderProgram = GL.createProgram( );

			GL.attachShader( shaderProgram, vertexShader.create( GL ) );
			GL.attachShader( shaderProgram, fragmentShader.create( GL ) );
			
			GL.linkProgram( shaderProgram );

			if ( !GL.getProgramParameter( shaderProgram, GL.LINK_STATUS ) ) {
				console.error( '不能初始化Shader!' );
			}



			// ---------- Uniforms ---------- //
			var uniforms = shaderProgram.uniforms = { };

			uniforms.projectionMatrix 	= new Uniform( 'uProjectionMatrix', 'Matrix4fv' );
			uniforms.cameraViewMatrix 	= new Uniform( 'uCameraViewMatrix', 'Matrix4fv' );
			uniforms.modelWorldMatrix 	= new Uniform( 'uModelWorldMatrix', 'Matrix4fv' );
			uniforms.viewport 			= new Uniform( 'uViewport', '2fv' );
			uniforms.color 				= new Uniform( 'uColor', '3fv' );

			uCustoms = shaderProgram.uniforms.uCustoms = customUniforms;

			if( useMap ){
				uniforms.map = new Uniform( 'uMap', '1i' );
			}

			if( useParticle ){
				uniforms.pointSize = new Uniform( 'uPointSize', '1f' );
			}



			// ---------- Attributes ---------- //
			var attributes = shaderProgram.attributes = { };
			
			aCustoms = shaderProgram.attributes.aCustoms = customAttributes;

			attributes.vertexPosition = geometry.vertexPosition;


			attributes.vertexPosition.makeLocation( GL, shaderProgram );

			// Customs
			for( var i = 0, il = aCustoms.length; i < il; i++ ){

				var attribute = aCustoms[ i ];
				attribute.makeLocation( GL, shaderProgram );

			}

			if( useVertexColor ){
				attributes.vertexColor = geometry.vertexColor;
				attributes.vertexColor.makeLocation( GL, shaderProgram );
			}


		}

		return material.shaderProgram;

	};



	// WebGLRenderer.prototype.compileMaterial = function( material ){

		// var GL = this.GL;




			// shaderProgram.attributes = {

				// 'aVertexPosition'	: GL.getAttribLocation( shaderProgram, 'aVertexPosition'	),
				// 'aVertexNormal'		: GL.getAttribLocation( shaderProgram, 'aVertexNormal'		),
				// 'aCustoms'			: {}

			// };

			// shaderProgram.uniforms = {
			// 	'uCustoms'			: [ ]
			// 	// 'uNormalMatrix'		: GL.getUniformLocation( shaderProgram, 'uNormalMatrix'		),
			// 	// 'uLights'			: [],
			
			// };

			// if( useTexture ){
				// uniforms.uTexture	= GL.getUniformLocation( shaderProgram, 'uTexture' );
			// }


			// for( var i = 0; i < D3.MAX_LIGHTS; i++ ) {

			// 	shaderProgram.uniforms.uLights.push( {

			// 		type: GL.getUniformLocation( shaderProgram, 'uLights[' + i + '].type'),
			// 		color: GL.getUniformLocation( shaderProgram, 'uLights[' + i + '].color'),
			// 		direction: GL.getUniformLocation( shaderProgram, 'uLights[' + i + '].direction')
				
			// 	} );

			// }
			
			// for( var u = customUniforms.length-1; u >= 0; u-- ){

			// 	var cu = customUniforms[ u ];
			// 	cu.location = GL.getUniformLocation( shaderProgram, cu.name );

			// }
			// shaderProgram.uniforms.uCustoms = customUniforms;


			// if( useTexture ){
			// 	shaderProgram.attributes.aVertexTuv	= GL.getAttribLocation( shaderProgram, 'aVertexTuv' );
			// }


			// for( var a = customAttributes.length; a >= 0; a-- ){

			// 	var ca = customAttributes[ a ];

			// 	if( ca instanceof MergerAttribute ){

			// 	}else{

			// 	}

			// }

			// for( var name in customAttributes ){

			// 	if( name !== 'mergers' ){

			// 		var customAttribute = customAttributes[ name ],
			// 			attributeData = this.attributeData( shaderProgram, name, customAttribute[ 0 ] );
					
			// 		attributeData.buffer = GL.createBuffer( ),
			// 		attributeData.value = customAttribute[ 1 ];

			// 		shaderProgram.attributes.aCustoms[ name ] = attributeData;

			// 	}else{

			// 		var aCustomsMergers = shaderProgram.attributes.aCustoms.mergers = {};
			// 		var mergers = customAttributes[ name ];
			// 		for( var m in mergers ){

			// 			var acmm = aCustomsMergers[ m ] = {},
			// 				merger = mergers[ m ].items;
						
			// 			acmm.buffer = GL.createBuffer( ),
			// 			acmm.value = mergers[ m ].data,
			// 				items = acmm.items = [];
			// 			for( var mname in merger ){

			// 				var customAttribute = merger[ mname ];
			// 				items.push( this.attributeData( shaderProgram, customAttribute[0], customAttribute[1], customAttribute[2], customAttribute[3] ) );
						
			// 			}

			// 		}

			// 	}
			// }

		// }

		// return material.shaderProgram;

	// };
	// WebGLRenderer.prototype.compileGeometry = function( geometry ){

		// var position = geometry.vertexPosition;
		// if( position.dirty ) {

		// 	if( !position.buffer ) {

		// 		position.buffer = GL.createBuffer( );
			
		// 	}

		// 	GL.bindBuffer( GL.ARRAY_BUFFER, position.buffer );
		// 	GL.bufferData( GL.ARRAY_BUFFER, position.array, hint );
		// 	position.dirty = false;

		// }

		// // Vertex Normals
		// var normal = geometry.vertexNormal;
		// if( normal.dirty ) {

		// 	if( !normal.buffer ) {
				
		// 		normal.buffer = GL.createBuffer( );
			
		// 	}

		// 	GL.bindBuffer( GL.ARRAY_BUFFER, normal.buffer );
		// 	GL.bufferData( GL.ARRAY_BUFFER, normal.array, hint );
		// 	normal.dirty = false;

		// }

		// // Vertex Colors
		// var color = geometry.vertexColor;
		// if( color.dirty ) {

		// 	if( !color.buffer ) {
				
		// 		color.buffer = GL.createBuffer( );
			
		// 	}

		// 	GL.bindBuffer( GL.ARRAY_BUFFER, color.buffer );
		// 	GL.bufferData( GL.ARRAY_BUFFER, color.array, hint );
		// 	color.dirty = false;

		// }

		// // Vertex Tuv
		// var tuv = geometry.vertexTuv;
		// if( tuv.dirty ) {

		// 	if( !tuv.buffer ) {
				
		// 		tuv.buffer = GL.createBuffer( );
			
		// 	}

		// 	GL.bindBuffer( GL.ARRAY_BUFFER, tuv.buffer );
		// 	GL.bufferData( GL.ARRAY_BUFFER, tuv.array, hint );
		// 	tuv.dirty = false;

		// }

		// vertex Index

	// };

	WebGLRenderer.prototype.enableAttribArrays = function( ) {

		if( this.lastShaderProgram ) {
			this.setAttribArrays( 'enableVertexAttribArray' );
		}

	};
	WebGLRenderer.prototype.disableAttribArrays = function( ) {

		if( this.lastShaderProgram ) {
			this.setAttribArrays( 'disableVertexAttribArray' );
		}

	};



	WebGLRenderer.prototype.setAttribArrays = function( which ) {

		var GL = this.GL,
			program = this.lastShaderProgram,
			attributes = Object.keys( program.attributes ),
			attCount = attributes.length,
			aCustoms = this.lastShaderProgram.attributes.aCustoms,
			location = -1;

		while( attCount-- ) {

			var name = attributes[ attCount ];
			
			if( name !== 'aCustoms' ) {

				location = this.lastShaderProgram.attributes[ name ].location;

				if( location !== -1 ) {
					GL[ which ]( location );
				}

			}
		
		}

		for( var i = 0, il = aCustoms.length; i < il; i++ ){

			location = aCustoms[ i ].location;

			if( location !== -1 ) {
				GL[ which ]( location );
			}

		}
		// for( var aCustom in aCustoms ){

		// 	if( aCustom !== 'mergers' ) {

		// 		location = aCustoms[ aCustom ].location;

		// 		if( location !== -1 ) {
		// 			GL[ which ]( location );
		// 		}

		// 	}else{

		// 		var mergers = aCustoms[ aCustom ];
		// 		for( var merger in mergers ){

		// 			var items = mergers[ merger ].items;
		// 			for( var item in items ){

		// 				location = items[ item ].location;

		// 				if( location !== -1 ) {
		// 					GL[ which ]( location );
		// 				}

		// 			}

		// 		}

		// 	}

		// }

	};



	WebGLRenderer.prototype.processTexture = function( map ) {

		var GL = this.GL;

		map.data = GL.createTexture( );

		GL.bindTexture( GL.TEXTURE_2D, map.data ); // 绑定
		GL.pixelStorei( GL.UNPACK_FLIP_Y_WEBGL, true ); // 垂直翻转
		GL.texImage2D( GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, map.image ); // 上传到显卡端的纹理空间
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR ); // 特殊缩放参数
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR ); 
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, this.d3ToGL( 'wrap', map.wrapS ) );
		GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, this.d3ToGL( 'wrap', map.wrapT ) );
		// now unbind
		GL.bindTexture( GL.TEXTURE_2D, null );

	};



	WebGLRenderer.prototype.d3ToGL = function( g, p ){

		var GL = this.GL;
		// wrap
		if( p === D3[ g + 'Types' ].CLAMP_TO_EDGE ) 	return GL.CLAMP_TO_EDGE;
		if( p === D3[ g + 'Types' ].REPEAT ) 			return GL.REPEAT;
		if( p === D3[ g + 'Types' ].MIRRORED_REPEAT ) 	return GL.MIRRORED_REPEAT;
		// draw
		if( p === D3[ g + 'Types' ].TRIANGLE_STRIP )	return GL.TRIANGLE_STRIP;
		if( p === D3[ g + 'Types' ].TRIANGLES )			return GL.TRIANGLES;
		if( p === D3[ g + 'Types' ].POINTS )			return GL.POINTS;
		// shader
		if( p === D3[ g + 'Types' ].VERTEX )	return GL.VERTEX_SHADER;
		if( p === D3[ g + 'Types' ].FRAGMENT )	return GL.FRAGMENT_SHADER;

	};



	WebGLRenderer.prototype.size = function( w, h ) {

		var v = Renderer.prototype.size.call( this, w, h );
		
		if( w !== undefined ){

			var GL = this.context( );

			if( !!GL ) {

				var size = this.size( );

				GL.viewportWidth = size.x( );
				GL.viewportHeight = size.y( );

				GL.viewport( 0, 0, GL.viewportWidth, GL.viewportHeight );

				this.clear( );

			}

		}

		return v;

	};



	WebGLRenderer.prototype.createContext = function( element ){

		try {

			var GL = element.getContext( 'webgl' ) || element.getContext( 'experimental-webgl' );
			// 添加扩展
			GL.getExtension( 'OES_standard_derivatives' );

			GL.clearColor( 0, 0, 0, 0 );

			this.__context = GL;
			return GL;

		} catch ( exception ) {

			console.error( 'WebGL Context Creation Failed!' );

		}

	};
	WebGLRenderer.prototype.clear = function( ){

		var GL = this.context( );
		GL.clear( GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT );
	
	};



	var __v2 = new Vec2( );
	var __v3 = new Vec3( );
	var __m4 = new Mat4( );



	module.exports = WebGLRenderer;

} );