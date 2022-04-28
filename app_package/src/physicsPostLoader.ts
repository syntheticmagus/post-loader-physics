import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Node } from "@babylonjs/core/node";
import { PhysicsImpostor, PhysicsImpostorParameters } from "@babylonjs/core/Physics/physicsImpostor";
import { Scene } from "@babylonjs/core/scene";

enum PhysicsImpostorParameterNames {
    mass,
    restitution,
    friction,
    _count
}

export class PhysicsPostLoader {
    public static AddPhysicsToHierarchy(node: Node, scene: Scene): void {
        let recurse = true;
        let mesh = node as AbstractMesh;
        if (mesh) {
            const params = this._getImpostorParams(mesh);
            if (mesh.name.startsWith("physics_sphere")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.SphereImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_box")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_plane")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.PlaneImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_mesh")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.MeshImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_capsule")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.CapsuleImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_cylinder")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.CylinderImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_heightmap")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.HeightmapImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_convex_hull")) {
                mesh.setParent(null);
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.ConvexHullImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            } else if (mesh.name.startsWith("physics_compound")) {
                mesh.setParent(null);
                mesh.getChildren().forEach((node) => {
                    this.AddPhysicsToHierarchy(node, scene);
                });
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.NoImpostor, params, scene);
                recurse = false;
                mesh.isVisible = false;
            }
        }

        if (recurse) {
            node.getChildren().forEach((node) => {
                this.AddPhysicsToHierarchy(node, scene);
            });
        }
    }

    private static _getImpostorParams(mesh: AbstractMesh): PhysicsImpostorParameters {
        const params: any = {
            mass: 0
        };
        let nodes;

        for (let idx = 0; idx < PhysicsImpostorParameterNames._count; ++idx) {
            nodes = mesh.getChildren((node) => node.name.startsWith(PhysicsImpostorParameterNames[idx]), true);
            if (nodes.length > 0) {
                params[PhysicsImpostorParameterNames[idx]] = (nodes[0] as TransformNode).position.x;
                nodes[0].dispose();
            }
        }

        return params;
    }
}
