var canvas;
var engine;
var scene;

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0,0,0,0);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 20, -5), scene);
    //camera.rotation = new BABYLON.Vector3(Math.PI/3.5, 0, 0);
    camera.attachControl(engine.getRenderingCanvas());
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    //light.intensity = 0.7;

    var dLight = new BABYLON.DirectionalLight("dLight1", new BABYLON.Vector3(0.5,-1,0.5), scene);
    dLight.position = new BABYLON.Vector3(0,40,0);
    scene.shadows = new BABYLON.ShadowGenerator(4096, dLight);
    scene.shadows.useBlurVariansShadowMap = true;
    //scene.shadows.setTransparencyShadow(true);
    var materialDice = new BABYLON.StandardMaterial("diceTexture", scene);
    materialDice.diffuseColor = new BABYLON.Color3(0.5, 0, 0.8);
    materialDice.ambientColor = new BABYLON.Color3(0, 1, 0);
    materialDice.specularColor = new BABYLON.Color3(1, 1, 1);

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.material = materialDice;
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    sphere.receiveShadows = true;
    var cube = BABYLON.Mesh.CreateBox("myBox", 1, scene);
    cube.material = materialDice;
    cube.position.y = 0.5;
    cube.position.x  = -5;

    cube.receiveShadows = true;

    var materialTransparent = new BABYLON.StandardMaterial("transparentTexture", scene);
    //materialTransparent.alpha = 0;
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
    ground.material = materialTransparent;
    ground.receiveShadows = true;

    scene.shadows.getShadowMap().renderList.push(sphere);
    scene.shadows.getShadowMap().renderList.push(cube);
    scene.shadows.getShadowMap().renderList.push(ground);
    return scene;

};

/*var createScene = function () {

 // BABYLON Scene creation
 var scene = new BABYLON.Scene(engine);

 scene.clearColor = new BABYLON.Color4(0,0,0,0);
 // The camera, necessary see the world
 var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 20, -5), scene);
 camera.setTarget(BABYLON.Vector3.Zero());

 // The ambient light
 var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-5, 20, 0), scene);
 //light.intensity = 1;
 // The cube
 var cube = BABYLON.Mesh.CreateBox("myBox", 1, scene);
 //cube.position.x  = -5;

 return scene;
 };*/

// Execute WebGL only when the DOM is loaded
window.addEventListener("DOMContentLoaded", function () {

    // BABYLON Engine creation
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine);

    // The render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

}, false);

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

