output
Here is your complete tactical checklist and asset kit for **Role 3: Visual Identity & Creative Execution**.

Your goal is to make a "ugly" loop look like a **Final Fantasy 6 Chrono Trigger** fusion. We are aiming for **High Contrast**, **Vibrant Palettes**, and **Cinematic Depth**.

---

### 1. The "Cinematic" CSS Overlay (0 - 15 Minutes)
*Do this immediately to define the style of the entire game. This creates the "TV/Scanner" look instantly.*

Copy this into `style.css`:

```css
/* 
   ROLE 3: VISUAL IDENTITY CORE
   Style: Chrono Trigger / Final Fantasy 6 / Zelda 
   Keywords: CRT, Scanlines, Pixelated, Cinematic 
*/

:root {
    --bg-dark: #1a1c2c;
    --crt-green: #98fb98;
    --highlight: #f4f242;
}

body {
    margin: 0;
    background-color: var(--bg-dark);
    overflow: hidden;
    font-family: 'Courier New', monospace; /* Retro text style */
}

canvas {
    /* 1. PIXEL PERFECTION: Crucial for crisp sprites */
    image-rendering: pixelated; 
    /* 2. ZELDA/CT SHARNESS: Keeps pixels from blurring */
    image-rendering: crisp-edges;
    
    /* 3. CANVAS SIZING: Fixed pixel resolution, scaled via JS */
    display: block;
    margin: auto;
    border: 10px solid #333;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
}

/* 
   4. THE "FF6/CT" CRT FILTER
   This adds the scanlines and slight vignette 
   over the entire game view without touching JS
*/
#game-container {
    position: relative;
    width: 640px;
    height: 480px;
    overflow: hidden;
    background: #000;
}

#game-container::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 2;
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
}
```

---

### 2. The "Encore" Pixel Palette (15 - 25 Minutes)
*Use these specific Hex codes in your art tool (Aseprite/Photoshop). This gives the game color consistency.*

**The Palette:**

| Role | Hex Code | Usage |
| :--- | :--- | :--- |
| **Midnight Blue** | `#2c3e50` | Shadow / Background / Boss Outline |
| **Cyber Green** | `#2ecc71` | Hero Magic / Perfect Hit / Health |
| **Neon Pink** | `#e91e63` | Damage / Boss HP / Critical |
| **Flash White** | `#ecf0f1` | Text / Highlights / Particles |
| **Ethereal Cyan** | `#00ffcc` | **The Ghost Army (Translucent Blue)** |
| **Gold** | `#f1c40f` | Gold items / Level Ups |
| **Void Purple** | `#8e44ad` | Magic Effects / Teleport |

---

### 3. Sprite Sheet Requirements (25 - 45 Minutes)
*You don't have time to make complex 3D models. Use **2D Pixel Art** (Top-down like Zelda, but dynamic like Chrono Trigger).*

**Required Sprites (Minimum viable):**
1.  **Hero (The Living):**
    *   **Idle (8 frames):** Head bobbing, cape swaying.
    *   **Attack (4 frames):** Sword slash lunge.
    *   **Guard (4 frames):** Crouching/Block pose.
    *   **Hit (2 frames):** Flash white, recoil.
2.  **The Boss (The Undying):**
    *   **Idle (2 frames):** Slowly rising up/down (huge size).
    *   **Attack (4 frames):** Wind up -> Strike. Needs *heavy* shading.
    *   **Angry (Loop):** Eyes flashing, mouth open.
3.  **The Environment:**
    *   **Floor:** Dark grey tiles.
    *   **Background:** Deep purple void with some "cloud" particles drifting slowly.

**Visual Trick for the "Encore" Mechanic:**
*   **The Ghost:** Do not make a new sprite. Create a visual filter in your code (or CSS) that turns the Hero sprite **Cyan (`#00ffcc`)** with **20% Opacity**. This unifies the art style—ghosts *are* players, just fading away.

---

### 4. The "Juice" (Action Feedback) Logic (45 - 60 Minutes)
*This is what makes a game feel "Good." Tell Role 2 (Engine) to implement these specific visual shakes on the Canvas context.*

**1. The "Impact" Shake (FF6 Style):**
When a hit lands, the camera must shift 10px instantly, then settle back.
```javascript
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
```

**2. Floating Text (Chrono Trigger Style):**
Damage numbers should appear in **Red** at the hit point, float upwards, and grow slightly as they fade.
*   **Perfect Hit:** Yellow text.
*   **Ghost Hit:** Blue text (Ghost Cyan).
*   **Crit:** Large Red text that flashes.

**3. The Timing Bar (The UI):**
Center of the screen.
*   **Green Zone:** 40% center.
*   **Red Zones:** Edges.
*   **Cursor:** A white vertical bar.
*   **Feedback:** When `Perfect` is hit, the bar should explode into `#f1c40f` (Gold) sparkles.

---

### 5. Task Checklist for Role 3

*   [ ] **0-10m:** Paste the CSS styles above into your project.
*   [ ] **10-20m:** Create the Hero and Boss sprites using the Hex Palette above. Ensure they have transparent backgrounds.
*   [ ] **20-30m:** Build the "Ghost Army" renderer.
    *   *Task:* Make a function `drawGhost(x, y, sprite)` that uses `rgba(r,g,b,0.4)` and a slight "ghostly blur" or offset (trailing tail).
*   [ ] **30-40m:** Create the UI Overlay (HTML/Canvas layers on top of the game).
    *   Health bar (Red for player, Red/Purple for boss).
    *   The Timing Bar (Green/Yellow/Red).
    *   XP / Level Up notification.
*   [ ] **40-50m:** Implement "Flashbacks."
    *   When the player levels up, draw the Ghost sprites one last time, bright white, then fade them out to "black".
*   [ ] **50-60m:** Review. Is the Boss too small? **Make it bigger.** Is the Hero too dark? **Add white highlights.**

**Role 3, go paint the world.**