import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class AssetLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.assets = new Map();
    }

    async loadModel(name, url) {
        return new Promise((resolve, reject) => {
            this.loader.load(url, (gltf) => {
                this.assets.set(name, gltf.scene);
                resolve(gltf.scene);
            }, undefined, reject);
        });
    }

    get(name) {
        const model = this.assets.get(name);
        return model ? model.clone() : null;
    }
}
