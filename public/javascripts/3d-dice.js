var simulator,
    isWebGLSupported,
    diceRoll;

// Execute the WebGL application only if Babylon.js is available
if (typeof(BABYLON) != 'undefined') {

    if ('addEventListener' in window) {
        // Execute WebGL only when the DOM is loaded
        window.addEventListener("DOMContentLoaded", function () {

            // WebGL Detection
            // see https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
            // Create canvas element. The canvas is not added to the
            // document itself, so it is never displayed in the
            // browser window.
            var canvas = document.createElement("canvas");
            // Get WebGLRenderingContext from canvas element.
            var gl = canvas.getContext("webgl")
                || canvas.getContext("experimental-webgl");
            // Report the result.
            if (gl && gl instanceof WebGLRenderingContext) {
                isWebGLSupported = true;
                simulator = new Simulator('renderCanvas');
            }
        }, false);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            if (isWebGLSupported)
                simulator.engine.resize();
        });
    }

}

var Simulator = function(canvasId) {
    // BABYLON Engine creation
    var canvas = document.getElementById(canvasId);
    this.engine = new BABYLON.Engine(canvas, true);

    this.scene = this._initScene(this.engine, canvas.width, canvas.height);

    this.hideShadows = false;

    var _this = this;
    // The render loop
    this.engine.runRenderLoop(function () {
        _this.scene.render();
    });

};

Simulator.prototype._initScene = function (engine, canvasWidth, canvasHeight) {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81,0), new BABYLON.OimoJSPlugin());
    scene.clearColor = new BABYLON.Color4(0,0,0,0);


    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 20, 0), scene);
    //var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-3, 1, -10), scene);
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

    this.dice6 = new BABYLON.Mesh.CreateBox("dice6", 1, scene);
    this.dice6.isVisible = false;
    this.dice6.pickable = false;

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

    this.dice6.subMeshes = [];
    var verticesCount = this.dice6.getTotalVertices();
    this.dice6.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, this.dice6));
    this.dice6.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, this.dice6));
    this.dice6.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, this.dice6));
    this.dice6.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, this.dice6));
    this.dice6.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, this.dice6));
    this.dice6.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, this.dice6));

    this.dice6.material = multiMaterial6;

    this.diceCounter = 0;


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


    var shadowOnlyMaterial =  new BABYLON.ShadowOnlyMaterial('mat', scene);


    this.ground = new BABYLON.Mesh.CreatePlane("ground", 100, scene);
    this.ground.rotation.x = Math.PI / 2;
    this.ground.material = shadowOnlyMaterial;
    this.ground.receiveShadows = true;
    this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(this.ground, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.05, friction:0.8});

    this.antiGround = new BABYLON.Mesh.CreatePlane("ground", 100, scene);
    this.antiGround.isVisible = false;
    this.antiGround.rotation.x = Math.PI / 2;
    this.antiGround.position.y = 3;
    this.antiGround.material = shadowOnlyMaterial;
    this.antiGround.physicsImpostor = new BABYLON.PhysicsImpostor(this.antiGround, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.05, friction:0.8});
    var _this = this;
    //Pick screen point (0,0)
    var canvas3dPoint1 = scene.pick(0, 0, function (mesh) { return mesh == _this.ground; });
    console.log(canvas3dPoint1);

    var canvas3dPoint2 = scene.pick(canvasWidth, canvasHeight, function (mesh) { return mesh == _this.ground; });
    console.log(canvas3dPoint2);





    var blm = new BABYLON.StandardMaterial("blm", scene);
    blm.diffuseColor = new BABYLON.Color3(1,0.5,1);

    var borderPadding = 1;
    this.borderLeft = new BABYLON.Mesh.CreatePlane("borderLeft", 100, scene);
    this.borderLeft.material = shadowOnlyMaterial;
    this.borderLeft.rotation.y = Math.PI / 2;
    //this.borderLeft.rotation.z = Math.PI / 3;
    //this.borderLeft.rotation.x = Math.PI / 8;
    if (canvas3dPoint1.hit) {
        this.borderLeft.position.x = canvas3dPoint1.pickedPoint.x + borderPadding;
        console.log("x: " + canvas3dPoint1.pickedPoint.x + " " + this.borderLeft.position.x);
    } else {
        this.borderLeft.position.x = -15;
    }
    //this.borderLeft.position.z = 5;
    this.borderLeft.physicsImpostor = new BABYLON.PhysicsImpostor(this.borderLeft, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.3, friction:0.8});

    this.borderUp = new BABYLON.Mesh.CreatePlane("borderUp", 100, scene);
    this.borderUp.material = shadowOnlyMaterial;
    if (canvas3dPoint1.hit) {
        this.borderUp.position = new BABYLON.Vector3(0, 0, canvas3dPoint1.pickedPoint.z - borderPadding);
    }
    this.borderUp.physicsImpostor = new BABYLON.PhysicsImpostor(this.borderUp, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.3, friction:0.8});

    this.borderDown = new BABYLON.Mesh.CreatePlane("borderDown", 100, scene);
    this.borderDown.material = shadowOnlyMaterial;
    if (canvas3dPoint2.hit) {
        this.borderDown.position = new BABYLON.Vector3(0, 0, canvas3dPoint2.pickedPoint.z + borderPadding);
    }
    this.borderDown.physicsImpostor = new BABYLON.PhysicsImpostor(this.borderDown, BABYLON.PhysicsImpostor.PlaneImpostor, {mass: 0, restitution: 0.3, friction:0.8});



    this.shadows = new BABYLON.ShadowGenerator(1024, lightD);
    this.shadows.useBlurExponentialShadowMap = true;
    this.shadows.blurScale = 2;
    this.shadows.setDarkness(0.2);
    this.shadows.setTransparencyShadow(true);

    //this.shadows.getShadowMap().renderList.push(sphere);
    //this.shadows.getShadowMap().renderList.push(cube);
    //console.log("cube total vertices: " + cube.getTotalVertices() + " total indices: " + cube.getTotalIndices() + " data: " + cube.getVerticesData(BABYLON.VertexBuffer.PositionKind));
    this.lowestValue = 60;
    var _this = this;
    scene.registerBeforeRender(function() {
        //if (engine.getFps() < 24) {
        if (engine.getFps() < _this.lowestValue) {
            _this.lowestValue = engine.getFps();
            console.log(_this.lowestValue);
        }
            simulator.hideShadows = true;
            //console.log(engine.getFps());
        //}
    });

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
    simulator.diceCounter++;
    var name = "dice6_" + simulator.diceCounter;
    DiceObject.call(this, name, simulator);
    this.value = value;
    //var vertexData = BABYLON.VertexData.CreateBox(1, BABYLON.Mesh.DEFAULTSIDE);
    //vertexData.applyToMesh(this);

    var dice6 = simulator.dice6.createInstance(name);
    //dice6.parent = this;
    dice6.isVisible = true;
    var scene = simulator.scene;



    dice6.position.x = 20;
    dice6.position.y = 0.5;
    dice6.position.z = -5;

    //this.receiveShadows = true;
    if (!simulator.hideShadows) {
        simulator.shadows.getShadowMap().renderList.push(dice6);
    }

    dice6.rotationQuaternion = new BABYLON.Quaternion.RotationYawPitchRoll(0, Math.PI/6, Math.PI/4);
    dice6.physicsImpostor = new BABYLON.PhysicsImpostor(dice6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0.1, friction:1});
    dice6.physicsImpostor.applyImpulse(new BABYLON.Vector3(-25, 0, 7), dice6.getAbsolutePosition());

    this.dice6 = dice6;
    this.rays = [];
    var allDone = false;

    var directions =
        [
            BABYLON.Vector3(  0,  0,  1),   //front
            BABYLON.Vector3(  0,  0, -1),   //back
            BABYLON.Vector3( -1,  0,  0),   //left
            BABYLON.Vector3(  1,  0,  0),   //right
            BABYLON.Vector3(  0,  1,  0),   //up
            BABYLON.Vector3(  0, -1,  0)    //down
        ];

    /*var origin = this.position;
    var length = 10;
    for (var i = 0; i < 6; i++) {
        var d = vecToLocal(directions[i], this);

        var direction = d.subtract(origin);
        direction = BABYLON.Vector3.Normalize(direction);



        this.rays[i] = new BABYLON.Ray(origin, direction, length);
    }*/



    //_this.rays[0] = new BABYLON.Ray(_this.position, BABYLON.Vector3(0, 0, 1));
    //var rayHelper = new BABYLON.RayHelper(_this.rays[0]);



    /*var localMeshDirection = new BABYLON.Vector3(0, -1,0);
    var localMeshOrigin = new BABYLON.Vector3(0, 0, 0);
    var length = 20;

    var ray = new BABYLON.Ray(localMeshOrigin, localMeshDirection, length);
    var rayHelper = new BABYLON.RayHelper(ray);

    rayHelper.attachToMesh(_this, localMeshDirection, localMeshOrigin, length);
    rayHelper.show(scene, BABYLON.Color3(1, 1, 0));*/

    var _this = this;

    function vecToLocal(vector, mesh){
        var m = mesh.getWorldMatrix();
        var v = BABYLON.Vector3.TransformCoordinates(vector, m);
        return v;
    }

    var sleepcheck = function () {

        if (_this.physicsImpostor.physicsBody.sleeping && !allDone) {
            console.log("it's asleep!");
            console.log(_this.position);
            // do lots more stuff
            /*for (var i = 0; i < 6; i++) {
                _this.rays[i] = new BABYLON.Ray(_this.position, BABYLON.Vector3(0, 0, 1));
                BABYLON.RayHelper.CreateAndShow(_this.rays[i], scene, new BABYLON.Color3(1, 1, 0.1));
                //var rayHelper = new BABYLON.RayHelper(_this.rays[i]);

                var ray = new BABYLON.Ray();
                var rayHelper = new BABYLON.RayHelper(ray);

                var localMeshDirection = new BABYLON.Vector3(0, -1,0);
                var localMeshOrigin = new BABYLON.Vector3(0, -.4, 0);
                var length = 20;

                rayHelper.attachToMesh(_this, localMeshDirection, localMeshOrigin, length);
                rayHelper.show(scene);
            }
            */
            /*for (var i = 0; i < 6; i++) {
                var hit = scene.pickWithRay(_this.rays[i], function(mesh) {
                    return mesh == simulator.ground;
                });
                if (hit.pickedMesh) {
                    console.log("picked: " + i);
                }
            }*/
            allDone = true;
        }
    }

    //scene.registerBeforeRender(sleepcheck);
};

Dice6.prototype = Object.create(DiceObject.prototype);
Dice6.prototype.constructor = Dice6;

Dice6.prototype.delete = function() {
    this.dice6.dispose();
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

    if (isWebGLSupported) {
        if (diceRoll != null) {
            diceRoll.dispose();
        }
        diceRoll = new DiceRoll(simulator);

        if (parserResult != null && parserResult.content != null) {
            var diceCount = 0;
            //simulator.hideShadows = false;
            for (var i = 0; i < parserResult.content.length; i++) {
                if (parserResult.content[i].type === 'dice') {
                    diceCount++;
                }
            }
            //if (diceCount > 10) {
            //    simulator.hideShadows = true;
            //}
            simulator.lowestValue = 60;
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



