import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";
import { Engine } from "@babylonjs/core/Engines/engine";
import { FilesInput } from "@babylonjs/core/Misc/filesInput";
import "@babylonjs/core/Debug/debugLayer";
import { PhysicsPostLoader } from "./physicsPostLoader";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import { Button, StackPanel } from "@babylonjs/gui";

import { FirstPersonPlayer } from "@syntheticmagus/first-person-player";


async function createSceneAsync(engine: Engine, canvas: HTMLCanvasElement, assetsHostUrl: string): Promise<Scene> {
    const scene = new Scene(engine);
    const physicsPlugin = new AmmoJSPlugin();
    scene.enablePhysics(undefined, physicsPlugin);

    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
    scene.createDefaultCamera(true, true, true);
    let recreateCamera = true;

    const filesInput = new FilesInput(engine, null, 
        () => { /*console.log("Scene loaded callback");*/ },
        () => { /*console.log("Progress callback");*/ },
        () => { /*console.log("Additional render loop logic callback");*/ },
        () => { /*console.log("Texture loading callback");*/ },
        (files) => {
            if (files) {
                for (let idx = 0; idx < files.length; ++idx) {
                    if (files[idx].name.endsWith(".gltf") || files[idx].name.endsWith(".glb")) {
                        SceneLoader.ImportMeshAsync("", "file:", files[idx], scene).then((result) => {
                            PhysicsPostLoader.AddPhysicsToHierarchy(result.meshes[0], scene);
                            if (recreateCamera) {
                                scene.activeCamera?.dispose();

                                const playerSpawn = scene.getTransformNodeByName("player_spawn");
                                if (playerSpawn) {
                                    const player = new FirstPersonPlayer(scene, playerSpawn.absolutePosition);
                                    player.camera.maxZ = 1000;

                                    const playerFocus = scene.getTransformNodeByName("player_focus");
                                    if (playerFocus) {
                                        player.camera.setTarget(playerFocus.position);
                                    }

                                    scene.onPointerDown = () => {
                                        canvas.requestPointerLock();
                                        canvas.requestFullscreen();
                                    };
                                } else {
                                    scene.createDefaultCamera(true, true, true);
                                }

                                recreateCamera = false;
                            }
                        });
                    }
                }
            }
        },
        () => { /*console.log("On reload callback");*/ },
        () => { /*console.log("Error callback");*/ });
    filesInput.monitorElementForDragNDrop(canvas);

    const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("guiTexture", true, scene);

    const stackPanel = new StackPanel("topLeftStack");
    stackPanel.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_LEFT;
    stackPanel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_TOP;
    stackPanel.widthInPixels = 140;
    guiTexture.addControl(stackPanel);
    
    const showInspectorButton = Button.CreateSimpleButton("showInspector", "Show Inspector");
    showInspectorButton.background = "white";
    showInspectorButton.paddingLeftInPixels = 10;
    showInspectorButton.paddingTopInPixels = 10;
    showInspectorButton.heightInPixels = 40;
    showInspectorButton.fontSizeInPixels = 14;
    showInspectorButton.onPointerClickObservable.add(() => {
        scene.debugLayer.show();
    });
    stackPanel.addControl(showInspectorButton);

    return scene;
}

export function runDemoScene(canvas: HTMLCanvasElement, assetsHostUrl: string) {
    const engine = new Engine(canvas);

    createSceneAsync(engine, canvas, assetsHostUrl).then((scene) => {
        engine.runRenderLoop(() => {
            scene.render();
        });
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}

