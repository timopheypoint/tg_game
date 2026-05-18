import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class MissionMarker {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;

        const geometry = new THREE.CylinderGeometry(2, 2, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.position.y += 10;
        this.scene.add(this.mesh);
    }

    remove() {
        this.scene.remove(this.mesh);
    }
}

export class World {
    constructor(scene, physicsWorld, assets) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.assets = assets;
        this.islandSize = 3000; // 3km x 3km
        this.bridgeLength = 1000;

        this.createEnvironment();
    }

    createEnvironment() {
        // Sea
        const seaGeometry = new THREE.PlaneGeometry(10000, 10000);
        const seaMaterial = new THREE.MeshStandardMaterial({
            color: 0x0077ff,
            roughness: 0.1,
            metalness: 0.2
        });
        const sea = new THREE.Mesh(seaGeometry, seaMaterial);
        sea.rotation.x = -Math.PI / 2;
        sea.position.y = -0.1;
        this.scene.add(sea);

        // Island 1 (Main)
        this.createIsland(new THREE.Vector3(-this.islandSize / 2 - this.bridgeLength / 2, 0, 0), "Main Island");

        // Island 2 (Small)
        this.createIsland(new THREE.Vector3(this.islandSize / 2 + this.bridgeLength / 2, 0, 0), "Second Island");

        // Bridge
        this.createBridge();

        // Roads
        this.createRoads();
    }

    createRoads() {
        const roadWidth = 20;
        const roadTexture = this.assets.get('road');
        const roadMaterial = new THREE.MeshStandardMaterial({
            map: roadTexture,
            color: 0x444444
        });
        if (roadTexture) {
            roadTexture.repeat.set(1, 10);
        }

        // Main highway across islands and bridge
        const highwayLength = this.islandSize * 2 + this.bridgeLength;
        const highwayGeo = new THREE.PlaneGeometry(roadWidth, highwayLength);
        const highway = new THREE.Mesh(highwayGeo, roadMaterial);
        highway.rotation.x = -Math.PI / 2;
        highway.rotation.z = Math.PI / 2;
        highway.position.y = 1.1;
        this.scene.add(highway);

        // Physics for highway
        const shape = new CANNON.Box(new CANNON.Vec3(highwayLength / 2, 0.1, roadWidth / 2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(0, 1.1, 0);
        this.physicsWorld.addBody(body);
    }

    createIsland(position, name) {
        const geometry = new THREE.BoxGeometry(this.islandSize, 2, this.islandSize);

        const grassTexture = this.assets.get('grass');
        const material = new THREE.MeshStandardMaterial({
            map: grassTexture,
            color: 0x33aa33
        });
        if (grassTexture) {
            grassTexture.repeat.set(50, 50);
        }

        const island = new THREE.Mesh(geometry, material);
        island.position.copy(position);
        island.receiveShadow = true;
        this.scene.add(island);

        // Physics
        const shape = new CANNON.Box(new CANNON.Vec3(this.islandSize / 2, 1, this.islandSize / 2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(position.x, position.y, position.z);
        this.physicsWorld.addBody(body);

        // Add some random buildings
        for (let i = 0; i < 50; i++) {
            this.createBuilding(
                position.x + (Math.random() - 0.5) * (this.islandSize - 100),
                position.z + (Math.random() - 0.5) * (this.islandSize - 100)
            );
        }
    }

    createBuilding(x, z) {
        const w = 15 + Math.random() * 25;
        const h = 30 + Math.random() * 100;
        const d = 15 + Math.random() * 25;

        const geometry = new THREE.BoxGeometry(w, h, d);

        const brickTexture = this.assets.get('brick');
        const material = new THREE.MeshStandardMaterial({
            map: brickTexture,
            color: 0x888888
        });
        if (brickTexture) {
            brickTexture.repeat.set(w/5, h/5);
        }
        const building = new THREE.Mesh(geometry, material);
        building.position.set(x, h / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        this.scene.add(building);

        const shape = new CANNON.Box(new CANNON.Vec3(w / 2, h / 2, d / 2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, h / 2, z);
        this.physicsWorld.addBody(body);
    }

    createBridge() {
        const width = 40;
        const geometry = new THREE.BoxGeometry(this.bridgeLength, 2, width);
        const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const bridge = new THREE.Mesh(geometry, material);
        bridge.position.set(0, 1, 0);
        this.scene.add(bridge);

        const shape = new CANNON.Box(new CANNON.Vec3(this.bridgeLength / 2, 1, width / 2));
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(0, 1, 0);
        this.physicsWorld.addBody(body);
    }
}
