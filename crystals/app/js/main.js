require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {


var container;

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, lightMesh, geometry, phone;
var spheres = [];


var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = -5000;

    cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();


    // lights

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );





    var geometry = new THREE.SphereGeometry( 800, 4, 4 );

    var path = 'img/';
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
    // var mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    var material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, envMap: textureCube, refractionRatio: 0.99 } );
    // var material = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
    for ( var i = 0; i < 10; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );


        mesh.position.x = Math.random() * 8000 - 5000;
        mesh.position.y = Math.random() * 8000 - 5000;
        mesh.position.z = Math.random() * 12000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 1 + 1;

        scene.add( mesh );

        spheres.push( mesh );

    }

    // Skybox

    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
    sceneCube.add( mesh );

//     //

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    container.appendChild( renderer.domElement );

//     //

    window.addEventListener( 'resize', onWindowResize, false );



    //LOAD THE OBJECT TO THE SCENE
    var loader = new THREE.JSONLoader(); // init the loader util

    // init loading
    loader.load('obj/phone.js', function (geometry) {
        // create a new material

        // this is the same as the other objects
        // var material = new THREE.MeshBasicMaterial( { color: 0x666666, envMap: textureCube, refractionRatio: 0.99 } );
        var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )



        // create a mesh with models geometry and material
        var mesh = new THREE.Mesh(
            geometry,
            material
        );
        phone = mesh;
        console.log(mesh);
        phone.scale.x = phone.scale.y = phone.scale.z = Math.random() * 10 + 1;

        scene.add(phone);
    });

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    cameraCube.aspect = window.innerWidth / window.innerHeight;
    cameraCube.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;

}

// //

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    var timer = 0.001 * Date.now();



    // for ( var i = 0, il = spheres.length; i < il; i ++ ) {

    //     var sphere = spheres[ i ];

    //     sphere.position.x = 1000 * Math.cos( timer + i );
    //     sphere.position.y = 1000 * Math.sin( timer + i );
    //     sphere.position.z = 5000 * Math.sin( timer + i );

    // }

    phone.position.y = 1000 * Math.cos(timer);
    phone.rotation.y += .01;
    phone.rotation.x += .01;

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );
    cameraCube.rotation.copy( camera.rotation );

    renderer.render( sceneCube, cameraCube );
    renderer.render( scene, camera );

}


});


















// /*
//     Three.js "tutorials by example"
//     Author: Lee Stemkoski
//     Date: July 2013 (three.js v59dev)
// */

// // MAIN

// // standard global variables
// var container, scene, camera, renderer, controls, stats;
// var keyboard = new THREEx.KeyboardState();
// var clock = new THREE.Clock();

// // custom global variables
// var mirrorCube, mirrorCubeCamera; // for mirror material
// var mirrorSphere, mirrorSphereCamera; // for mirror material

// init();
// animate();

// // FUNCTIONS        
// function init() 
// {
//     // SCENE
//     scene = new THREE.Scene();
//     // CAMERA
//     var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
//     var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
//     camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
//     scene.add(camera);
//     camera.position.set(0,150,400);
//     camera.lookAt(scene.position);  
//     // RENDERER
//     if ( Detector.webgl )
//         renderer = new THREE.WebGLRenderer( {antialias:true} );
//     else
//         renderer = new THREE.CanvasRenderer(); 
//     renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
//     container = document.getElementById( 'ThreeJS' );
//     container.appendChild( renderer.domElement );
//     // EVENTS
//     THREEx.WindowResize(renderer, camera);
//     THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
//     // CONTROLS
//     controls = new THREE.OrbitControls( camera, renderer.domElement );
//     // STATS
//     stats = new Stats();
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.bottom = '0px';
//     stats.domElement.style.zIndex = 100;
//     container.appendChild( stats.domElement );
//     // LIGHT
//     var light = new THREE.PointLight(0xffffff);
//     light.position.set(0,250,0);
//     scene.add(light);
//     // FLOOR
//     var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
//     floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
//     floorTexture.repeat.set( 10, 10 );
//     var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side:THREE.BackSide } );
//     var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
//     var floor = new THREE.Mesh(floorGeometry, floorMaterial);
//     floor.position.y = -0.5;
//     floor.rotation.x = Math.PI / 2;
//     scene.add(floor);
    
//     // SKYBOX/FOG
//     var materialArray = [];
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-xpos.png' ) }));
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-xneg.png' ) }));
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-ypos.png' ) }));
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-yneg.png' ) }));
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-zpos.png' ) }));
//     materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dawnmountain-zneg.png' ) }));
//     for (var i = 0; i < 6; i++)
//        materialArray[i].side = THREE.BackSide;
//     var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
//     var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
//     var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
//     scene.add( skybox );    
    
//     ////////////
//     // CUSTOM //
//     ////////////
    
//     var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
//     mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
//     // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
//     scene.add( mirrorCubeCamera );
//     var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorCubeCamera.renderTarget } );
//     mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
//     mirrorCube.position.set(-75,50,0);
//     mirrorCubeCamera.position = mirrorCube.position;
//     scene.add(mirrorCube);  
    
//     var sphereGeom =  new THREE.SphereGeometry( 50, 32, 16 ); // radius, segmentsWidth, segmentsHeight
//     mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
//     // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
//     scene.add( mirrorSphereCamera );
//     var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
//     mirrorSphere = new THREE.Mesh( sphereGeom, mirrorSphereMaterial );
//     mirrorSphere.position.set(75,50,0);
//     mirrorSphereCamera.position = mirrorSphere.position;
//     scene.add(mirrorSphere);

// }

// function animate() 
// {
//     requestAnimationFrame( animate );
//     render();       
//     update();
// }

// function update()
// {
//     if ( keyboard.pressed("z") ) 
//     { 
//         // do something
//     }
    
//     controls.update();
//     stats.update();
// }

// function render() 
// {
//     // move the CubeCamera to the position of the object
//     //    that has a reflective surface, "take a picture" in each direction
//     //    and apply it to the surface.
//     // need to hide surface before and after so that it does not
//     //    "get in the way" of the camera
//     mirrorCube.visible = false;
//     mirrorCubeCamera.updateCubeMap( renderer, scene );
//     mirrorCube.visible = true;

//     mirrorSphere.visible = false;
//     mirrorSphereCamera.updateCubeMap( renderer, scene );
//     mirrorSphere.visible = true;
    
//     renderer.render( scene, camera );
// }







