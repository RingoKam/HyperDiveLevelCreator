import { LevelProvider } from '@/Providers/LevelProvider';
import * as BABYLON from "babylonjs";
import { BabylonFileLoaderConfiguration, ClampBlock } from 'babylonjs';
import * as GUI from "babylonjs-gui";

export class Main {

    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;

    private context: any;
    private camera: BABYLON.FreeCamera;
    private grid: any[] = [];
    private height: number;
    private heightList: number[];
    private currentHeight = 0;

    constructor(canvas, context: LevelProvider) {
        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = this.setupScene(this.engine, canvas);
    }

    //redner scene
    public render() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    public setCameraPosition(height: number) {
        this.camera.position = new BABYLON.Vector3(0.5, 9 + -height, -17.8);
        this.camera.rotation = new BABYLON.Vector3(0.4653956558758062, -0.07168276100777128, 0);
    }

    private setupScene(engine: BABYLON.Engine, canvas) {
        const scene = new BABYLON.Scene(engine);

        //setup camera
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        this.camera.position = new BABYLON.Vector3(0.5, 9, -17.8);
        this.camera.rotation = new BABYLON.Vector3(0.4653956558758062, -0.07168276100777128, 0);
        this.camera.attachControl(canvas, false);

        //set light
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        //define materials 
        var mat = new BABYLON.StandardMaterial("no-selected", scene);
        mat.diffuseColor = new BABYLON.Color3(255, 255, 255);
        mat.alpha = 0.5;
        var mat2 = new BABYLON.StandardMaterial("breakable", scene);
        mat2.diffuseColor = new BABYLON.Color3(255, 1, 1);

        this.setupUI();

        return scene;
    }

    private setupUI() {
        //Setup camera control GUI
        const guiMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const upButton = this.createUpOrDownButton(true);
        const downButton = this.createUpOrDownButton(false);

        upButton.onPointerClickObservable.add(() => {
            const next = this.heightList[this.currentHeight - 1];
            if (next === undefined || next < 0) {
                return;
            }
            this.currentHeight -= 1;
            this.setCameraPosition(next);
        })

        downButton.onPointerClickObservable.add(() => {
            const next = this.heightList[this.currentHeight + 1];
            if (next === undefined || next < 0) {
                console.warn("ops...", next)
                return;
            }
            this.currentHeight += 1;
            this.setCameraPosition(next);
        })

        guiMenu.addControl(upButton);
        guiMenu.addControl(downButton);

        //Setup Save button
        const saveButton = GUI.Button.CreateSimpleButton("Save", "Save");
        saveButton.width = 0.2
        saveButton.height = "40px";
        saveButton.color = "white";
        saveButton.background = "green";
        saveButton.thickness = 0;
        saveButton.top = -50;
        saveButton.horizontalAlignment = GUI.Container.HORIZONTAL_ALIGNMENT_CENTER;
        saveButton.verticalAlignment = GUI.Container.VERTICAL_ALIGNMENT_BOTTOM;
        saveButton.onPointerClickObservable.add(() => {
            console.log("save clicked!");
            // localLevel.forEach((wave, i) => {
            //     const result = Object.entries(wave).reduce((a, c) => {
            //         const [pos, type] = <[string, any]> c; 
            //         const [x, y] = pos.split(",");
            //         if(a[type] === undefined) {
            //             a[type] = [];
            //         }
            //         a[type].push({ x, y});
            //         return a;
            //     }, {})
            //     context.setObstacles(i, result);
            // });
        })

        guiMenu.addControl(saveButton);
    }

    private createUpOrDownButton(isUp: Boolean) {
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
}
