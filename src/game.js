import * as THREE from 'three';

export class StoryManager {
    constructor(game) {
        this.game = game;
        this.currentMission = 0;
        this.missions = [
            {
                name: "The Beginning",
                description: "Meet your girlfriend at the restaurant.",
                trigger: () => this.game.player.mesh.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 50
            },
            {
                name: "The Tragedy",
                description: "Watch the news. Find out what happened.",
                trigger: () => true // Auto-trigger after mission 0
            },
            {
                name: "Vengeance",
                description: "Steal the medical helicopter and attack the gang headquarters.",
                trigger: () => this.game.vehicle.active && this.game.vehicle.mesh.position.y > 50
            }
        ];

        this.initMissionUI();
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
            this.updateUI();
        }
    }
}
