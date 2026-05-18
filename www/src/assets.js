import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.assets = new Map();
    }

    async loadModel(name, url) {
        return new Promise((resolve, reject) => {
            const fullUrl = `assets/${url}`;
            this.loader.load(fullUrl, (gltf) => {
                this.assets.set(name, gltf.scene);
                resolve(gltf.scene);
            }, undefined, reject);
        });
    }

    async loadTexture(name, url) {
        return new Promise((resolve, reject) => {
            const fullUrl = `assets/textures/${url}`;
            this.textureLoader.load(fullUrl, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                this.assets.set(name, texture);
                resolve(texture);
            }, undefined, reject);
        });
    }

    get(name) {
        const asset = this.assets.get(name);
        if (asset instanceof THREE.Texture) return asset;
        return asset ? asset.clone() : null;
    }
}
