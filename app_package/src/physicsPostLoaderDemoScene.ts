import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";
import { MeshBuilder, PhysicsImpostor, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { PhysicsPostLoader } from "./physicsPostLoader";

async function createSceneAsync(engine: Engine, canvas: HTMLCanvasElement, assetsHostUrl: string): Promise<Scene> {
    const scene = new Scene(engine);
    const physicsPlugin = new AmmoJSPlugin();
    scene.enablePhysics(undefined, physicsPlugin);

    const result = await SceneLoader.ImportMeshAsync("", assetsHostUrl, "physics.glb", scene);
    PhysicsPostLoader.AddPhysicsToHierarchy(result.meshes[0], scene);
    scene.createDefaultCameraOrLight(true, true, true);

    scene.debugLayer.show();

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

