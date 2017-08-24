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
    scene.enablePhysics(new BABYLON.Vector3(0,-9,0), new BABYLON.OimoJSPlugin());
    scene.clearColor = new BABYLON.Color4(0,0,0,0);
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 20, -5), scene);
    //var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 3, 0), scene);
    camera.rotation = new BABYLON.Vector3(Math.PI/3.5, 0, 0);
    camera.attachControl(engine.getRenderingCanvas());
    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());



    var lightD = new BABYLON.DirectionalLight("lightD", new BABYLON.Vector3(1,-2,1), scene);
    lightD.position = new BABYLON.Vector3(-20,40,-20);
    lightD.intensity = 0.5;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var lightH = new BABYLON.HemisphericLight("lightH", new BABYLON.Vector3(0, 1, 0), scene);
    lightH.diffuse = new BABYLON.Color3(1, 1, 1);
    lightH.specular = new BABYLON.Color3(1, 1, 1);
    lightH.groundColor = new BABYLON.Color3(0, 0, 0);
    lightH.intensity = 0.3;

    var materialDice = new BABYLON.StandardMaterial("materialDice", scene);
    materialDice.diffuseColor = new BABYLON.Color3.FromHexString("#d8c4eb");
    //materialDice.ambientColor = new BABYLON.Color3(0, 1, 0);
    materialDice.specularColor = new BABYLON.Color3(1, 1, 1);
    materialDice.specularPower = 15;
    //materialDice.ambientColor = new BABYLON.Color3(0.5, 0, 0.8);

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    //var sphere = new BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    //sphere.material = materialDice;
    //sphere.position.y = 1;






   /* var cube = new BABYLON.Mesh.CreateBox("myBox", 1, scene);
    cube.position.y = 0.5;
    cube.position.x  = 2;*/










    /*var cube = new BABYLON.Mesh.CreateBox("myBox", 1, scene);
    cube.material = materialDice;
    cube.position.y = 0.5;
    cube.position.x  = 2;

    var text = new BABYLON.DynamicTexture("texture", 512, scene, true);
    cube.material.diffuseTexture = text;
    text.drawText("1", 100, 400, "bold 400px Segoe UI", "#000000", "#ffffff");*/





    var ground = new BABYLON.Mesh.CreatePlane("ground", 1000, scene);
    ground.rotation.x = Math.PI / 2;
    ground.material = new BABYLON.ShadowOnlyMaterial('mat', scene);
    ground.receiveShadows = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.05, friction:0.8});


    this.shadows = new BABYLON.ShadowGenerator(1024, lightD);
    this.shadows.useBlurExponentialShadowMap = true;
    this.shadows.blurScale = 2;
    this.shadows.setDarkness(0.2);
    this.shadows.setTransparencyShadow(true);

    //this.shadows.getShadowMap().renderList.push(sphere);
    //this.shadows.getShadowMap().renderList.push(cube);
    //console.log("cube total vertices: " + cube.getTotalVertices() + " total indices: " + cube.getTotalIndices() + " data: " + cube.getVerticesData(BABYLON.VertexBuffer.PositionKind));

    return scene;

};

Simulator.prototype.throwDice = function(parserResult) {

    this.diceRoll = DiceRoll.createDiceRoll(parserResult, simulator);

};

//DiceObject
var DiceObject = function(name, simulator) {
    BABYLON.Mesh.call(this, name, simulator.scene);

    this.simulator = simulator;
    this.scene = simulator.scene;
};

DiceObject.prototype = Object.create(BABYLON.Mesh.prototype);
DiceObject.prototype.constructor = DiceObject;

//Dice6
var Dice6 = function(value, simulator) {
    DiceObject.call(this, "dice6", simulator);
    var vertexData = BABYLON.VertexData.CreateBox(1, BABYLON.Mesh.DEFAULTSIDE);
    vertexData.applyToMesh(this);

    var scene = simulator.scene;

    var texture1 = new BABYLON.DynamicTexture("texture1", 512, scene, true);
    texture1.drawText("1", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material1 = new BABYLON.StandardMaterial("material1");
    material1.diffuseTexture = texture1;

    var texture2 = new BABYLON.DynamicTexture("texture2", 512, scene, true);
    texture2.drawText("2", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material2 = new BABYLON.StandardMaterial("material2");
    material2.diffuseTexture = texture2;

    var texture3 = new BABYLON.DynamicTexture("texture3", 512, scene, true);
    texture3.drawText("3", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material3 = new BABYLON.StandardMaterial("material3");
    material3.diffuseTexture = texture3;

    var texture4 = new BABYLON.DynamicTexture("texture4", 512, scene, true);
    texture4.drawText("4", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material4 = new BABYLON.StandardMaterial("material4");
    material4.diffuseTexture = texture4;

    var texture5 = new BABYLON.DynamicTexture("texture5", 512, scene, true);
    texture5.drawText("5", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material5 = new BABYLON.StandardMaterial("material5");
    material5.diffuseTexture = texture5;

    var texture6 = new BABYLON.DynamicTexture("texture6", 512, scene, true);
    texture6.drawText("6", 125, 400, "bold 400px Segoe UI", "#000000", "#ffffff");
    var material6 = new BABYLON.StandardMaterial("material6");
    material6.diffuseTexture = texture6;

    var multiMaterial6 = new BABYLON.MultiMaterial("dice6texture", scene);
    multiMaterial6.subMaterials.push(material1);
    multiMaterial6.subMaterials.push(material6);
    multiMaterial6.subMaterials.push(material4);
    multiMaterial6.subMaterials.push(material3);
    multiMaterial6.subMaterials.push(material5);
    multiMaterial6.subMaterials.push(material2);

    this.subMeshes = [];
    var verticesCount = this.getTotalVertices();
    this.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, this));
    this.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, this));
    this.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, this));
    this.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, this));
    this.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, this));
    this.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, this));

    this.material = multiMaterial6;

    this.value = value;
    this.position.x = 20;
    this.position.y = 3;
    this.position.z = 0;

    //this.receiveShadows = true;
    simulator.shadows.getShadowMap().renderList.push(this);
    this.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, Math.PI/8, Math.PI/4);
    this.physicsImpostor = new BABYLON.PhysicsImpostor(this, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 100, restitution: 0.1, friction:1});
    this.physicsImpostor.applyImpulse(new BABYLON.Vector3(-12, 0, 0), this.getAbsolutePosition());
};

Dice6.prototype = Object.create(DiceObject.prototype);
Dice6.prototype.constructor = Dice6;

Dice6.prototype.delete = function() {
    this.dispose();
};

//DiceRoll
var DiceRoll = function(simulator) {

    this.scene = simulator.scene;
    this.simulator = simulator;

    this.dice6s = [];
};

DiceRoll.prototype.dispose = function() {
    this.dice6s.forEach(function(d6) {
        d6.delete();
    })
};

DiceRoll.createDiceRoll = function(parserResult, simulator) {
    var diceRoll = new DiceRoll(simulator);

    if (parserResult != null && parserResult.content != null) {
        for (var i = 0; i < parserResult.content.length; i++) {
            var dice6 = null;

            if (parserResult.content[i].type === 'dice') {
                if (parserResult.content[i].sides === 6) {
                    dice6 = new Dice6(parserResult.content[i].value, simulator);
                    diceRoll.dice6s.push(dice6);
                }
            }
        }
    }
    return diceRoll;
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



