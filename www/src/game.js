import * as THREE from 'three';
import { MissionMarker } from './world.js';

export class StoryManager {
    constructor(game) {
        this.game = game;
        this.currentMission = 0;
        this.marker = null;
        this.missions = [
            {
                name: "The Beginning",
                description: "Meet your girlfriend at the restaurant.",
                location: new THREE.Vector3(0, 0, 0),
                trigger: () => this.game.player.mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 20
            },
            {
                name: "The Tragedy",
                description: "Watch the news. Find out what happened.",
                location: new THREE.Vector3(-300, 0, 100),
                trigger: () => this.game.player.mesh.position.distanceTo(new THREE.Vector3(-300, 0, 100)) < 20
            },
            {
                name: "Vengeance",
                description: "Find the gang headquarters and take revenge.",
                location: new THREE.Vector3(500, 0, 500),
                trigger: () => this.game.player.mesh.position.distanceTo(new THREE.Vector3(500, 0, 500)) < 20
            }
        ];

        this.initMissionUI();
        this.spawnMarker();
    }

    initMissionUI() {
        this.missionEl = document.createElement('div');
        this.missionEl.style.position = 'absolute';
        this.missionEl.style.bottom = '250px';
        this.missionEl.style.left = '20px';
        this.missionEl.style.color = 'yellow';
        this.missionEl.style.fontSize = '20px';
        this.missionEl.style.textShadow = '2px 2px black';
        document.body.appendChild(this.missionEl);
        this.updateUI();
    }

    spawnMarker() {
        if (this.marker) this.marker.remove();
        const m = this.missions[this.currentMission];
        if (m && m.location) {
            this.marker = new MissionMarker(this.game.scene, m.location);
        }
    }

    updateUI() {
        const m = this.missions[this.currentMission];
        if (m) {
            this.missionEl.innerHTML = `MISSION: ${m.name}<br>${m.description}`;
        } else {
            this.missionEl.innerHTML = "FREE ROAM MODE";
        }
    }

    update() {
        const m = this.missions[this.currentMission];
        if (m && m.trigger()) {
            console.log("Mission step complete: " + m.name);
            this.currentMission++;
            this.spawnMarker();
            this.updateUI();
        }
    }
}
