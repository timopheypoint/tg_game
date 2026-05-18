import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Vehicle {
    constructor(scene, physicsWorld, camera, position) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.camera = camera;
        this.position = position;

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
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(this.chassisWidth, this.chassisHeight, this.chassisLength),
            new THREE.MeshStandardMaterial({ color: 0x0000ff })
        );
        this.scene.add(this.mesh);
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
            const relativeCameraOffset = new THREE.Vector3(0, 5, 12);
            const cameraOffset = relativeCameraOffset.applyQuaternion(this.mesh.quaternion);
            this.camera.position.x = this.mesh.position.x + cameraOffset.x;
            this.camera.position.y = this.mesh.position.y + cameraOffset.y;
            this.camera.position.z = this.mesh.position.z + cameraOffset.z;
            this.camera.lookAt(this.mesh.position);
        }
    }
}
