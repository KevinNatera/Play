let shakeMagnitude = 0;

function applyCameraShake(amount) {
    shakeMagnitude = amount;
}

function renderFrame() {
    // ... standard draw code ...
    
    if (shakeMagnitude > 0) {
        let rx = (Math.random() - 0.5) * shakeMagnitude;
        let ry = (Math.random() - 0.5) * shakeMagnitude;
        ctx.translate(rx, ry); // SHIFT THE WORLD
        shakeMagnitude -= 1;   // DECAY
    }
}
