import { Engine } from "@babylonjs/core/Engines/engine";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Helpers/sceneHelpers";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/loaders";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math";
import { SceneLoader } from "@babylonjs/core";

function createRandomMaterial(scene: Scene, name: string) {
    const mat = new PBRMaterial(name, scene);
    mat.albedoColor = new Color3(Math.random(), Math.random(), Math.random());
    mat.metallic = 0.1;
    mat.roughness = 0.7;
    return mat;
}

function createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    const physicsPlugin = new AmmoJSPlugin();
    scene.enablePhysics(undefined, physicsPlugin);

    scene.createDefaultEnvironment({ createGround: false, createSkybox: false });

    const box = MeshBuilder.CreateBox("box", { size: 5 }, scene);
    box.position.set(12, 2.5, 7);
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
    box.material = createRandomMaterial(scene, "box_mat");

    const ramp = MeshBuilder.CreateBox("ramp", { size: 1 }, scene);
    ramp.scaling.set(13, 0.2, 2);
    ramp.rotation.z = Math.PI / 5;
    ramp.position.set(4.3, 1.095, 7)
    ramp.physicsImpostor = new PhysicsImpostor(ramp, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.5 }, scene);
    ramp.material = createRandomMaterial(scene, "ramp_mat");
    
    const ground = MeshBuilder.CreateGround("ground1", { width: 30, height: 30, subdivisions: 2 }, scene);
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.PlaneImpostor, { mass: 0, restitution: 0.5 }, scene);
    ground.material = createRandomMaterial(scene, "ground1_mat");

    for (let idx = 1; idx < 6; ++idx) {
        const block = MeshBuilder.CreateBox("block_" + idx, { size: 0.8 }, scene);
        block.position.set(-5, idx * 0.8, -6);
        block.physicsImpostor = new PhysicsImpostor(block, PhysicsImpostor.BoxImpostor, { mass: 20, restitution: 0.5, friction: 10 }, scene);
        block.material = createRandomMaterial(scene, "block_" + idx + "_mat");
    };

    scene.createDefaultCamera(true, true, true);

    return scene;
}

export function runDemoScene(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    const scene = createScene(engine, canvas);
    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => {
        engine.resize();
    });
}

