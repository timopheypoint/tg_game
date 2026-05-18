import * as THREE from 'three';
import { PhysicsWorld } from './src/physics.js';
import { World } from './src/world.js';
import { Player } from './src/player.js';
import { Vehicle } from './src/vehicle.js';
import { UI } from './src/ui.js';
import { StoryManager } from './src/game.js';
import { AssetLoader } from './src/assets.js';

class Game {
    constructor() {
        this.assets = new AssetLoader();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
        this.camera.position.set(0, 500, 1000);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.physicsWorld = new PhysicsWorld();
        this.ui = new UI();
        this.world = new World(this.scene, this.physicsWorld.world);
        this.player = new Player(this.scene, this.physicsWorld.world, this.camera, this.ui);
        this.vehicle = new Vehicle(this.scene, this.physicsWorld.world, this.camera, new THREE.Vector3(-650, 5, 0), this.ui);
        this.storyManager = new StoryManager(this);

        // Load specific asset example (The "Girlfriend" placeholder)
        this.assets.loadModel('girlfriend', 'Duck.glb').then(model => {
            model.position.set(0, 2, 0); // At the "restaurant"
            this.scene.add(model);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Interaction logic
        const interact = () => {
            const dist = this.player.mesh.position.distanceTo(this.vehicle.mesh.position);
            if (dist < 10) {
                if (!this.vehicle.active) {
                    this.vehicle.active = true;
                    this.player.mesh.visible = false;
                    this.player.body.collisionFilterMask = 0;
                } else {
                    this.vehicle.active = false;
                    this.player.mesh.visible = true;
                    this.player.body.collisionFilterMask = 1;
                    this.player.body.position.copy(this.vehicle.chassisBody.position);
                    this.player.body.position.x += 5;
                }
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyF') interact();
        });

        // Mobile interaction
        setInterval(() => {
            if (this.ui.controls.enter.pressed) {
                interact();
                this.ui.controls.enter.pressed = false; // Debounce
            }
        }, 200);

        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(100, 200, 100);
        sun.castShadow = true;
        this.scene.add(sun);

        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.physicsWorld.step(1/60);
        if (!this.vehicle.active) {
            this.player.update();
        }
        this.vehicle.update();
        this.storyManager.update();
        this.renderer.render(this.scene, this.camera);
    }
}

new Game();
