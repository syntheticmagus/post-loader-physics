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
        if (!this._tryAddImpostorToNode(node, scene)) {
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

    private static _tryAddImpostorToNode(node: Node, scene: Scene, reparent: boolean = true): boolean {
        let mesh = node as AbstractMesh;

        if (mesh) {
            const params = this._getImpostorParams(mesh);
            if (mesh.name.startsWith("physics_sphere")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.SphereImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_box")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_plane")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.PlaneImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_mesh")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.MeshImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_capsule")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.CapsuleImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_cylinder")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.CylinderImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_heightmap")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.HeightmapImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_convex_hull")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.ConvexHullImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            } else if (mesh.name.startsWith("physics_compound")) {
                if (reparent) {
                    mesh.setParent(null);
                }
                mesh.getChildren().forEach((node) => {
                    this._tryAddImpostorToNode(node, scene, false);
                });
                mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.NoImpostor, params, scene);
                mesh.isVisible = false;
                return true;
            }
        }

        return false;
    }
}
