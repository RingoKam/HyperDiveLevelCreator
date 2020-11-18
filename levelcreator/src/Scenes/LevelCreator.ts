import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";

const gridSize = 5;

export default (canvas : any, context: any) => {
    // Load the 3D engine
    var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // CreateScene function that creates and return the scene
    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        // Target the camera to scene origin
        camera.position = new BABYLON.Vector3(0.5, 9, -17.8);
        camera.rotation = new BABYLON.Vector3(0.4653956558758062, -0.07168276100777128, 0);

        // Attach the camera to the canvas
        camera.attachControl(canvas, false);
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        
        var mat = new BABYLON.StandardMaterial("no-selected", scene);
        mat.diffuseColor = new BABYLON.Color3(255, 255, 255);
        mat.alpha = 0.5;

        var mat2 = new BABYLON.StandardMaterial("breakable", scene);
        mat2.diffuseColor = new BABYLON.Color3(255, 1, 1);

        const { setObstacles, levelJson} = context;
        let height = 0;
        let heightList = [];
        let currentHeight = 0;
        levelJson.waves.forEach((wave: any, i: number) => {
            console.log("i was called");
            heightList.push(height);
            const defintion = Object.entries(wave.obstacles).reduce((a, [type, obstacle]) => {
                const positionsDef = (<any[]> obstacle).reduce((acc, cur) => {
                    const { x, y } = cur;
                    const key = createKey(x, y);
                    acc[key] = type;
                    return acc;
                }, {});
                return { ...a, ...positionsDef };
            }, {})
            console.log(defintion);
            createGrid(scene, height, defintion);
            height += wave.nextSpawnHeight;
        });

        //Setup camera control GUI
        const guiMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const upButton = createUpOrDownButton(true);
        const downButton = createUpOrDownButton(false);
        
        upButton.onPointerClickObservable.add(() => {
            const next = heightList[currentHeight - 1];
            if(next === undefined || next < 0) {
                return;
            }
            currentHeight -= 1;
            setCameraPosition(camera, next);
        })

        downButton.onPointerClickObservable.add(() => {
            const next = heightList[currentHeight + 1];
            if(next === undefined || next < 0) {
                console.warn("ops...", next)
                return;
            }
            currentHeight += 1;
            setCameraPosition(camera, next);
        })

        guiMenu.addControl(upButton);
        guiMenu.addControl(downButton);

        //Setup Save button
        

        // scene.debugLayer.show()

        // Return the created scene
        return scene;
    }
    // call the createScene function
    var scene = createScene();
    // run the render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
    });
}

function createUpOrDownButton(isUp : Boolean) {
    var name = isUp ? "Up" : "Down";
    const button = GUI.Button.CreateSimpleButton(name, name);
    button.width = 0.2
    button.height = "40px";
    button.color = "white";
    button.background = "black";
    button.thickness = 0;
    button.horizontalAlignment = isUp ? GUI.Container.HORIZONTAL_ALIGNMENT_RIGHT : GUI.Container.HORIZONTAL_ALIGNMENT_LEFT;
    return button;
}

function createGrid(scene : BABYLON.Scene, height : number, definition: Object) {
    let grid :any[] = [];
    for (let x = 0; x < gridSize; ++x) {
		grid[x] = grid[x] || [];
        for (let z = 0; z < gridSize; ++z) {
            let box = BABYLON.Mesh.CreateBox("box", 0.5 , scene);
            box.position.copyFromFloats(x - gridSize / 2, -height, z - gridSize / 2);

            //Set Material
            const key = createKey(x, z);
            const def = definition[key]
            if(def) {
                box.material = scene.getMaterialByName("breakable");
            } else {
                box.material = scene.getMaterialByName("no-selected");
            }

            //Action
            box.actionManager = new BABYLON.ActionManager(scene);
            box.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
                console.log(x,z);
                const isSelected = box.material?.name === "no-selected";
                if(isSelected) {
                    box.material = scene.getMaterialByName("breakable");
                } else {
                    box.material = scene.getMaterialByName("no-selected");
                }
            }));

            grid[x][z] = box;
        }
	}
}

function setCameraPosition(camera, height : number) {
    camera.position = new BABYLON.Vector3(0.5, 9 + -height, -17.8);
    camera.rotation = new BABYLON.Vector3(0.4653956558758062, -0.07168276100777128, 0);
}

function createKey(x,y) {
    const key = `${x},${y}`;
    return key;
}