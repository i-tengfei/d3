define( function( require, exports, module ) {

	var D3 = require( 'D3.Global' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						    Core
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Scene = require( 'D3.Scene' );
	D3.Face4 = require( 'D3.Face4' );
	D3.Projector = require( 'D3.Projector' );
	D3.Raycaster = require( 'D3.Raycaster' );
	D3.Object3D = require( 'D3.Object3D' );
	D3.Map 	= require( 'D3.Map' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						  Renderer
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Renderer 		= require( 'D3.Renderer' );
	D3.WebGLRenderer	= require( 'D3.WebGLRenderer' );
	D3.CSS3DRenderer	= require( 'D3.CSS3DRenderer' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						   Display
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Display	= require( 'D3.Display' );
	D3.Mesh		= require( 'D3.Mesh' );
	D3.Particle	= require( 'D3.Particle' );
	D3.CSS3D	= require( 'D3.CSS3D' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						  Geometry
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Geometry			= require( 'D3.Geometry' );
	D3.CubeGeometry		= require( 'D3.CubeGeometry' );
	D3.PlaneGeometry	= require( 'D3.PlaneGeometry' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						  Material
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Material 		= require( 'D3.Material' );
	D3.ParticleMaterial = require( 'D3.ParticleMaterial' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						   Camera
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Camera 				= require( 'D3.Camera' );
	D3.PerspectiveCamera 	= require( 'D3.PerspectiveCamera' );


	// ---------- ---------- ---------- ---------- ---------- //
	//						   Shader
	// ---------- ---------- ---------- ---------- ---------- //
	D3.VertexShader 	= require( 'D3.VertexShader' );
	D3.FragmentShader 	= require( 'D3.FragmentShader' );
	D3.Uniform	= require( 'D3.Uniform' );
	D3.Attribute	= require( 'D3.Attribute' );


	// ---------- ---------- ---------- ---------- ---------- //
	//							Math
	// ---------- ---------- ---------- ---------- ---------- //
	D3.Vec2 = require( 'D3.Vec2' );
	D3.Vec3 = require( 'D3.Vec3' );
	D3.Vec4 = require( 'D3.Vec4' );
	D3.Mat3 = require( 'D3.Mat3' );
	D3.Mat4 = require( 'D3.Mat4' );


	D3.View = require( 'D3.View' );
	D3.OrbitController = require( 'D3.OrbitController' );


	module.exports = D3;

} );