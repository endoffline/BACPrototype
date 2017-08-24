var simulator;

// Execute the WebGL application only if Babylon.js is available
if (typeof(BABYLON) != 'undefined') {
    // Execute WebGL only when the DOM is loaded
    window.addEventListener("DOMContentLoaded", function () {
        simulator = new Simulator('renderCanvas');


    }, false);

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        simulator.engine.resize();
    });
}

var Simulator = function(canvasId) {
    // BABYLON Engine creation
    var canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(canvas, true);

    this.scene = this._initScene(this.engine);

    var _this = this;
    // The render loop
    this.engine.runRenderLoop(function () {
        _this.scene.render();
    });

};

Simulator.prototype._initScene = function (engine) {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0,0,0,0);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 15, -5), scene);
    camera.rotation = new BABYLON.Vector3(Math.PI/3.5, 0, 0);
    camera.attachControl(engine.getRenderingCanvas());
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var lightH = new BABYLON.HemisphericLight("lightH", new BABYLON.Vector3(0, 1, 0), scene);
    lightH.diffuse = new BABYLON.Color3(1, 1, 1);
    lightH.specular = new BABYLON.Color3(1, 1, 1);
    lightH.groundColor = new BABYLON.Color3(0, 0, 0);
    lightH.intensity = 0.5;

    var lightD = new BABYLON.DirectionalLight("lightD", new BABYLON.Vector3(1,-1,-0.5), scene);
    lightD.position = new BABYLON.Vector3(0,40,0);
    lightD.intensity = 0.8;

    this.shadows = new BABYLON.ShadowGenerator(1024, lightD);
    this.shadows.useBlurExponentialShadowMap = true;
    //scene.shadows.depthScale = 2500;
    //scene.shadows.bias = 0.001;
    this.shadows.setTransparencyShadow(true);
    var materialDice = new BABYLON.StandardMaterial("materialDice", scene);
    materialDice.diffuseColor = new BABYLON.Color3(0.6, 0, 0.8);
    //materialDice.ambientColor = new BABYLON.Color3(0, 1, 0);
    materialDice.specularColor = new BABYLON.Color3(1, 1, 1);
    materialDice.specularPower = 15;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.material = materialDice;
    sphere.position.y = 1;
    sphere.receiveShadows = true;

    var cube = BABYLON.Mesh.CreateBox("myBox", 1, scene);
    cube.material = materialDice;
    cube.position.y = 0.5;
    cube.position.x  = 2;
    cube.receiveShadows = true;

    var materialTransparent = new BABYLON.StandardMaterial("transparentTexture", scene);
    materialTransparent.alpha = 0;
    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
    //ground.material = materialTransparent;
    ground.receiveShadows = true;

    this.shadows.getShadowMap().renderList.push(sphere);
    this.shadows.getShadowMap().renderList.push(cube);
    this.shadows.getShadowMap().renderList.push(ground);
    return scene;

};

var DiceObject = function(name, simulator) {
    BABYLON.Mesh.call(this, name, simulator.scene);

    this.simulator = simulator;
    this.scene = scene;
}

DiceObject.prototype = Object.create(BABYLON.Mesh.prototype);
DiceObject.prototype.constructor = DiceObject;

var Dice6 = function(simulator) {
    DiceObject.call(this, "dice6", simulator);
    var vertexData = BABYLON.VertexData.CreateBox(1, BABYLON.Mesh.DEFAULTSIDE);
    vertexData.applyToMesh(this);

    this.receiveShadows = true;
}

Dice6.prototype = Object.create(DiceObject.prototype);
Dice6.prototype.constructor = Dice6;

Dice6.prototype.delete = function() {
    this.dispose();
}

var DiceRoll = function(simulator) {
    this.scene = simulator.scene;
    this.simulator = simulator;

    this.dice6 = [];
}

DiceRoll.prototype.dispose = function() {
    this.dice6.forEach(function(d6) {
        d6.dispose();
    })
}

DiceRoll.createDiceRoll = function(parserResult, simulator) {

    var diceRoll = new DiceRoll(simulator);

}
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


