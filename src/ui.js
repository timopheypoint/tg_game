export class UI {
    constructor() {
        this.createHUD();
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.style.position = 'absolute';
        hud.style.bottom = '20px';
        hud.style.left = '20px';
        hud.style.width = '200px';
        hud.style.height = '200px';
        hud.style.border = '5px solid #333';
        hud.style.borderRadius = '50%';
        hud.style.backgroundColor = 'rgba(0,0,0,0.5)';
        hud.style.overflow = 'hidden';
        hud.id = 'minimap';

        const playerMarker = document.createElement('div');
        playerMarker.style.position = 'absolute';
        playerMarker.style.top = '50%';
        playerMarker.style.left = '50%';
        playerMarker.style.width = '10px';
        playerMarker.style.height = '10px';
        playerMarker.style.backgroundColor = 'white';
        playerMarker.style.transform = 'translate(-50%, -50%)';
        hud.appendChild(playerMarker);

        document.body.appendChild(hud);

        // Map overlay
        this.mapOverlay = document.createElement('div');
        this.mapOverlay.style.position = 'absolute';
        this.mapOverlay.style.top = '0';
        this.mapOverlay.style.left = '0';
        this.mapOverlay.style.width = '100%';
        this.mapOverlay.style.height = '100%';
        this.mapOverlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        this.mapOverlay.style.display = 'none';
        this.mapOverlay.style.justifyContent = 'center';
        this.mapOverlay.style.alignItems = 'center';
        this.mapOverlay.style.color = 'white';
        this.mapOverlay.innerHTML = '<h1>GTA STYLE MAP (6x6km)</h1><p>Tap to close</p>';

        this.mapOverlay.onclick = () => {
            this.mapOverlay.style.display = 'none';
        };

        hud.onclick = () => {
            this.mapOverlay.style.display = 'flex';
        };

        document.body.appendChild(this.mapOverlay);

        // Stats
        const stats = document.createElement('div');
        stats.style.position = 'absolute';
        stats.style.top = '20px';
        stats.style.right = '20px';
        stats.style.color = 'green';
        stats.style.fontSize = '24px';
        stats.style.fontFamily = 'monospace';
        stats.innerHTML = '<div>$100,000,000</div><div style="color:red">HP: 100</div>';
        document.body.appendChild(stats);
    }
}
