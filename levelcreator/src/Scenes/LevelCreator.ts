import * as BABYLON from "babylonjs";

const gridSize = 5;

export default (canvas : any) => {
    // Load the 3D engine
    var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // CreateScene function that creates and return the scene
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        // Target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // Attach the camera to the canvas
        camera.attachControl(canvas, false);
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        
        createGrid(scene, 0);

        // Return the created scene
        return scene;
    }
    // call the createScene function
    var scene = createScene();
    // run the render loop
    engine.runRenderLoop(function () {
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
    });
}

function createGrid(scene : BABYLON.Scene, height : number) {
    let grid :any[] = [];
    for (let x = 0; x < gridSize; ++x) {
		grid[x] = grid[x] || [];
        for (let z = 0; z < gridSize; ++z) {
            var box = BABYLON.Mesh.CreateBox("box", 0.5 , scene);
            box.position.copyFromFloats(x - gridSize / 2, 0.1 , z - gridSize / 2);
            var mat = new BABYLON.StandardMaterial("mat", scene);
            // mat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
            box.material = mat;

            box.actionManager = new BABYLON.ActionManager(scene);
            box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                console.log(x,z);
                
            }));

            grid[x][z] = box;
        }
	}

}