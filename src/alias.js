seajs.config( {

	// 'base' : '../..',
	'alias' : {

		// ---------- ---------- ---------- ---------- ---------- //
		//							Core
		// ---------- ---------- ---------- ---------- ---------- //
		'D3' 			: 'D3',
		'D3.Global' 	: 'render/core/Global',
		'D3.Scene'		: 'render/core/Scene',
		'D3.Object3D'	: 'render/core/Object3D',
		'D3.Projector'	: 'render/core/Projector',
		'D3.Raycaster'	: 'render/core/Raycaster',
		'D3.Face4'		: 'render/core/Face4',
		'D3.Map'		: 'render/core/Map',


		// ---------- ---------- ---------- ---------- ---------- //
		//						  Renderer
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Renderer'		: 'render/renderers/Renderer',
		'D3.WebGLRenderer'	: 'render/renderers/WebGLRenderer',
		'D3.CSS3DRenderer'	: 'render/renderers/CSS3DRenderer',


		// ---------- ---------- ---------- ---------- ---------- //
		//						  Display
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Display'	: 'render/displays/Display',
		'D3.Mesh'		: 'render/displays/Mesh',
		'D3.Particle'	: 'render/displays/Particle',
		'D3.CSS3D'		: 'render/displays/CSS3D',


		// ---------- ---------- ---------- ---------- ---------- //
		//						  Geometry
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Geometry'		: 'render/geometries/Geometry',
		'D3.CubeGeometry'	: 'render/geometries/CubeGeometry',
		'D3.PlaneGeometry'	: 'render/geometries/PlaneGeometry',


		// ---------- ---------- ---------- ---------- ---------- //
		//						  Material
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Material'			: 'render/materials/Material',
		'D3.ParticleMaterial'	: 'render/materials/ParticleMaterial',


		// ---------- ---------- ---------- ---------- ---------- //
		//						   Camera
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Camera'				: 'render/cameras/Camera',
		'D3.PerspectiveCamera' 	: 'render/cameras/PerspectiveCamera',


		// ---------- ---------- ---------- ---------- ---------- //
		//						   Shader
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Shader' 		: 'render/shader/Shader',
		'D3.VertexShader' 	: 'render/shader/VertexShader',
		'D3.FragmentShader' : 'render/shader/FragmentShader',
		'D3.shaderLibrary' 	: 'render/shader/shaderLibrary',
		'D3.Uniform' 		: 'render/shader/Uniform',
		'D3.Attribute' 		: 'render/shader/Attribute',


		// ---------- ---------- ---------- ---------- ---------- //
		//							Math
		// ---------- ---------- ---------- ---------- ---------- //
		'D3.Mathutils'	: 'math/Mathutils',
		'D3.Ray'		: 'math/Ray',
		'D3.Vec2'		: 'math/Vec2',
		'D3.Vec3'		: 'math/Vec3',
		'D3.Vec4'		: 'math/Vec4',
		'D3.Mat3'		: 'math/Mat3',
		'D3.Mat4'		: 'math/Mat4',
		'D3.Plane'		: 'math/Plane',
		'D3.Sphere'		: 'math/Sphere',
		'D3.Triangle'	: 'math/Triangle',


		'D3.Engine'	: 'engine/core/Engine',

		'D3.View'			: 'engine/core/View',
		'D3.Events'			: 'engine/core/Events',
		'D3.KeyManager'		: 'engine/core/KeyManager',
		'D3.MouseManager'	: 'engine/core/MouseManager',
		'D3.listenEvents'	: 'engine/core/listenEvents',


		'D3.OrbitController'	: 'engine/controllers/OrbitController',


		// ---------- ---------- ---------- ---------- ---------- //
		//							 malu
		// ---------- ---------- ---------- ---------- ---------- //
		'malu' 	: 'malu/malu',

		'malu.Drag'		: 'malu/events/Drag',
		'malu.Dancer'	: 'malu/Dancer',

		// ---------- ---------- ---------- ---------- ---------- //
		//							 Libs
		// ---------- ---------- ---------- ---------- ---------- //
		'libs.zip'			: 'libs/zip',
		'libs.jquery'		: 'libs/jquery',
		'libs.Inflater'		: 'libs/Inflater',
		'libs.Deflater'		: 'libs/Deflater',
		'libs.TWEEN'		: 'libs/TWEEN',
		'libs.markdown'		: 'libs/markdown',
		'libs.codeMirror'	: 'libs/codeMirror',
		'libs.codeMirrorModes.javascript'	: 'libs/codeMirrorModes/javascript',
		'libs.codeMirrorModes.markdown'		: 'libs/codeMirrorModes/markdown',
		'libs.codeMirrorModes.html'			: 'libs/codeMirrorModes/html',
		'libs.codeMirrorModes.css'			: 'libs/codeMirrorModes/css',
		'libs.codeMirrorModes.xml'			: 'libs/codeMirrorModes/xml',
		'libs.jquery.mousewheel'			: 'libs/jquery.mousewheel',
		'libs.jquery.jscrollpane'			: 'libs/jquery.jscrollpane.js',
		'libs.jquery.jscrollpane.css'		: 'libs/jquery.jscrollpane.css',
		'libs.template'						: 'libs/template'
	}

} );