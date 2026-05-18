import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Player {
    constructor(scene, physicsWorld, camera) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.camera = camera;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        this.initPhysics();
        this.initVisuals();
        this.initControls();
    }

    initPhysics() {
        const radius = 1;
        this.shape = new CANNON.Sphere(radius);
        this.body = new CANNON.Body({
            mass: 1,
            shape: this.shape,
            material: new CANNON.Material({ friction: 0 })
        });
        this.body.position.set(-700, 10, 0);
        this.body.fixedRotation = true;
        this.body.updateMassProperties();
        this.physicsWorld.addBody(this.body);
    }

    initVisuals() {
        this.mesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(1, 2, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0xff0000 })
        );
        this.scene.add(this.mesh);
    }

    initControls() {
        // Swipe to rotate camera
        let isMouseDown = false;
        document.addEventListener('mousedown', () => isMouseDown = true);
        document.addEventListener('mouseup', () => isMouseDown = false);
        document.addEventListener('mousemove', (e) => {
            if (isMouseDown || (e.touches && e.touches.length > 0)) {
                const movementX = e.movementX || 0;
                this.rotation.y -= movementX * 0.005;
            }
        });

        // Touch controls for movement
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const dx = touchX - touchStartX;
            const dy = touchY - touchStartY;

            if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
                if (dy < -30) this.moveForward = true;
                else this.moveForward = false;

                if (dy > 30) this.moveBackward = true;
                else this.moveBackward = false;

                if (dx < -30) this.moveLeft = true;
                else this.moveLeft = false;

                if (dx > 30) this.moveRight = true;
                else this.moveRight = false;
            }
        });

        document.addEventListener('touchend', () => {
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
        });

        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': this.moveForward = true; break;
                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = true; break;
                case 'ArrowDown':
                case 'KeyS': this.moveBackward = true; break;
                case 'ArrowRight':
                case 'KeyD': this.moveRight = true; break;
                case 'Space': this.jump(); break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': this.moveForward = false; break;
                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = false; break;
                case 'ArrowDown':
                case 'KeyS': this.moveBackward = false; break;
                case 'ArrowRight':
                case 'KeyD': this.moveRight = false; break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    jump() {
        if (Math.abs(this.body.velocity.y) < 0.1) {
            this.body.velocity.y = 10;
        }
    }

    update() {
        const speed = 20;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
        this.direction.normalize();

        // Rotate movement direction based on camera rotation
        const moveVector = new THREE.Vector3(-this.direction.x, 0, -this.direction.z);
        moveVector.applyEuler(this.rotation);

        this.body.velocity.x = moveVector.x * speed;
        this.body.velocity.z = moveVector.z * speed;

        this.mesh.position.copy(this.body.position);
        this.mesh.rotation.y = this.rotation.y;

        // Camera logic
        const relativeCameraOffset = new THREE.Vector3(0, 5, 15);
        const cameraOffset = relativeCameraOffset.applyEuler(this.rotation);
        this.camera.position.x = this.mesh.position.x + cameraOffset.x;
        this.camera.position.y = this.mesh.position.y + cameraOffset.y;
        this.camera.position.z = this.mesh.position.z + cameraOffset.z;
        this.camera.lookAt(this.mesh.position);
    }
}
