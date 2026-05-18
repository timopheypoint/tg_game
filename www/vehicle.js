import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Vehicle {
    constructor(scene, physicsWorld, camera, position, ui) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.camera = camera;
        this.position = position;
        this.ui = ui;

        this.chassisWidth = 2;
        this.chassisHeight = 1;
        this.chassisLength = 4;

        this.active = false;

        this.initPhysics();
        this.initVisuals();
        this.initControls();
    }

    initPhysics() {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(this.chassisWidth / 2, this.chassisHeight / 2, this.chassisLength / 2));
        this.chassisBody = new CANNON.Body({ mass: 150 });
        this.chassisBody.addShape(chassisShape);
        this.chassisBody.position.set(this.position.x, this.position.y, this.position.z);
        this.chassisBody.angularVelocity.set(0, 0, 0);

        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
        });

        const wheelOptions = {
            radius: 0.5,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
        };

        wheelOptions.chassisConnectionPointLocal.set(1, 0, 2);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, 2);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(1, 0, -2);
        this.vehicle.addWheel(wheelOptions);

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, -2);
        this.vehicle.addWheel(wheelOptions);

        this.vehicle.addToWorld(this.physicsWorld);
    }

    initVisuals() {
        this.mesh = new THREE.Group();
        this.scene.add(this.mesh);

        const loader = new GLTFLoader();
        loader.load('assets/Car.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            model.position.y = -0.5;
            this.mesh.add(model);
        });
    }

    initControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.active) return;
            switch (event.code) {
                case 'KeyW': this.vehicle.applyEngineForce(-1000, 2); this.vehicle.applyEngineForce(-1000, 3); break;
                case 'KeyS': this.vehicle.applyEngineForce(1000, 2); this.vehicle.applyEngineForce(1000, 3); break;
                case 'KeyA': this.vehicle.setSteeringValue(0.5, 0); this.vehicle.setSteeringValue(0.5, 1); break;
                case 'KeyD': this.vehicle.setSteeringValue(-0.5, 0); this.vehicle.setSteeringValue(-0.5, 1); break;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (!this.active) return;
            switch (event.code) {
                case 'KeyW':
                case 'KeyS': this.vehicle.applyEngineForce(0, 2); this.vehicle.applyEngineForce(0, 3); break;
                case 'KeyA':
                case 'KeyD': this.vehicle.setSteeringValue(0, 0); this.vehicle.setSteeringValue(0, 1); break;
            }
        });
    }

    update() {
        this.mesh.position.copy(this.chassisBody.position);
        this.mesh.quaternion.copy(this.chassisBody.quaternion);

        if (this.active) {
            // Mobile Controls
            const engineForce = 1500;
            const steeringValue = 0.5;

            if (this.ui.controls.gas.pressed) {
                this.vehicle.applyEngineForce(-engineForce, 2);
                this.vehicle.applyEngineForce(-engineForce, 3);
            } else if (this.ui.controls.brake.pressed) {
                this.vehicle.applyEngineForce(engineForce, 2);
                this.vehicle.applyEngineForce(engineForce, 3);
            } else {
                this.vehicle.applyEngineForce(0, 2);
                this.vehicle.applyEngineForce(0, 3);
            }

            if (this.ui.controls.left.pressed) {
                this.vehicle.setSteeringValue(steeringValue, 0);
                this.vehicle.setSteeringValue(steeringValue, 1);
            } else if (this.ui.controls.right.pressed) {
                this.vehicle.setSteeringValue(-steeringValue, 0);
                this.vehicle.setSteeringValue(-steeringValue, 1);
            } else {
                this.vehicle.setSteeringValue(0, 0);
                this.vehicle.setSteeringValue(0, 1);
            }

            const relativeCameraOffset = new THREE.Vector3(0, 5, 12);
            const cameraOffset = relativeCameraOffset.applyQuaternion(this.mesh.quaternion);
            this.camera.position.x = this.mesh.position.x + cameraOffset.x;
            this.camera.position.y = this.mesh.position.y + cameraOffset.y;
            this.camera.position.z = this.mesh.position.z + cameraOffset.z;
            this.camera.lookAt(this.mesh.position);
        }
    }
}
