import * as THREE from 'three';

export class Weapon {
    constructor(scene, camera, assets) {
        this.scene = scene;
        this.camera = camera;
        this.assets = assets;
        this.raycaster = new THREE.Raycaster();
        this.mesh = new THREE.Group();

        this.initVisuals();
    }

    initVisuals() {
        const weaponModel = this.assets.get('weapon');
        if (weaponModel) {
            weaponModel.scale.set(0.1, 0.1, 0.1);
            weaponModel.rotation.y = Math.PI;
            this.mesh.add(weaponModel);
        } else {
            // Placeholder gun
            const geo = new THREE.BoxGeometry(0.1, 0.2, 0.5);
            const mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const box = new THREE.Mesh(geo, mat);
            this.mesh.add(box);
        }
        this.scene.add(this.mesh);
    }

    shoot(origin, direction) {
        this.raycaster.set(origin, direction);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // Muzzle flash effect
        const flash = new THREE.PointLight(0xffff00, 5, 10);
        flash.position.copy(origin).add(direction.clone().multiplyScalar(1));
        this.scene.add(flash);
        setTimeout(() => this.scene.remove(flash), 50);

        if (intersects.length > 0) {
            const hit = intersects[0];
            console.log("Hit object:", hit.object.name || "unnamed");

            // Impact effect
            const impactGeo = new THREE.SphereGeometry(0.1);
            const impactMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const impact = new THREE.Mesh(impactGeo, impactMat);
            impact.position.copy(hit.point);
            this.scene.add(impact);
            setTimeout(() => this.scene.remove(impact), 200);

            // Handle damage logic (to be linked with AI/Vehicles)
            if (hit.object.onHit) {
                hit.object.onHit(25); // 25 damage per shot
            }
        }
    }

    update(position, rotation) {
        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(rotation);

        // Offset to hold in hand
        const offset = new THREE.Vector3(0.5, -0.5, -1);
        offset.applyQuaternion(rotation);
        this.mesh.position.add(offset);
    }
}
