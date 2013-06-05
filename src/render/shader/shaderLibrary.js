define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );

	var shaderLibrary = {};

	shaderLibrary.vertex = {
		defines : {},
		executions : {}
	};

	shaderLibrary.fragment = {
		defines : {},
		executions : {}
	};

	var vd = shaderLibrary.vertex.defines;
	var ve = shaderLibrary.vertex.executions;
	var fd = shaderLibrary.fragment.defines;
	var fe = shaderLibrary.fragment.executions;



	// ---------- ---------- VertexColor ---------- ---------- //
	vd.VERTEX_COLOR = [
		'attribute vec4 aVertexColor;',
		'varying vec4 vColor;'
	].join( '\n' );
	ve.VERTEX_COLOR = [
		'vColor = aVertexColor;'
	].join( '\n' );



	fd.VERTEX_COLOR = [
		'varying vec4 vColor;'
	].join( '\n' );
	fe.VERTEX_COLOR = [
		'finalColor = vColor;'
	].join( '\n' );



	// ---------- ---------- Map ---------- ---------- //
	vd.MAP = [
		'attribute vec2 aVertexTuv;',
		'varying vec2 vTextureCoord;'
	].join( '\n' );
	ve.MAP = [
		'vTextureCoord = aVertexTuv;'
	].join( '\n' );



	fd.MAP = [
		'uniform sampler2D uMap;',
		'varying vec2 vTextureCoord;'
	].join( '\n' );
	fe.MAP = [
		'finalColor = texture2D( uMap, vec2( vTextureCoord.s, vTextureCoord.t ) );'
	].join( '\n' );



	// ---------- ---------- Light ---------- ---------- //
	vd.LIGHT = [
		'uniform mat4 uNormalMatrix;',
		'attribute vec3 aVertexNormal;',
		'varying vec3 vTransformedNormal;'
	].join( '\n' );
	ve.LIGHT = [
		'vTransformedNormal = ( uNormalMatrix * aVertexNormal ).xyz;'
	].join( '\n' );



	fd.LIGHT = [
		'varying vec3 vTransformedNormal;',
		'struct sLight',
		'{',
			'int type;',
			'vec3 color;',
			'vec3 direction;',
		'};',
		'uniform sLight uLights[' + D3.MAX_LIGHTS + '];',
		'vec3 addLight( sLight light ){',
			'vec3 lightColor;',
			// None
			'if( light.type == 0 ) {',
				'lightColor = vec3( 0.0, 0.0, 0.0 );',
			// Am
			'}else if( light.type == 1 ){',
				'lightColor = light.color;',
			// Else
			'}else if( light.type >= 2 ){',

				'vec3 normal = normalize( vTransformedNormal );',
			
				'float diffusePower = max( dot( normal, light.direction ), 0.0 );',

				'vec3 eyeDirection = normalize( -vViewPosition.xyz );',
				'vec3 reflectionDirection = reflect( -light.direction, normal );',
				'float specularPower = pow( max( dot( reflectionDirection, eyeDirection ), 0.0 ), 32.0 );',

				'lightColor = light.color * diffusePower + light.color * specularPower;',
				
			'}',
			'return lightColor;',
		'}'
	].join( '\n' );
	fe.LIGHT = [
		'vec3 lightPower;',
		( function( l ){
			var calls = 'lightPower = vec3( 0.0, 0.0, 0.0 )';
			for( i = 0; i < l; i++ ) {
				calls += ' + addLight( uLights[' + i + '] )'
			}
			return calls + ';';
		} )( D3.MAX_LIGHTS ),
		'finalColor = vec4( finalColor.rgb * lightPower, finalColor.a );'
	].join( '\n' );



	// ---------- ---------- Particle ---------- ---------- //
	vd.PARTICLE = [
		'uniform float uPointSize;'
	].join( '\n' );
	ve.PARTICLE = [
		'gl_PointSize = uPointSize;',
	].join( '\n' );



	// ---------- ---------- Particle Map ---------- ---------- //
	fd.PARTICLE_MAP = [
		'uniform sampler2D uMap;'
	].join( '\n' );
	fe.PARTICLE_MAP = [
		'finalColor = finalColor * texture2D( uMap, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );'
	].join( '\n' );


	module.exports = shaderLibrary;

} );