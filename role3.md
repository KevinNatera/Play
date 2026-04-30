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

Here is the blueprint for constructing your characters for **"Encore"**. We are building this inside the `Canvas` context. You need two things: **The Data Structure** (how code reads the character) and **The Design Specs** (how you draw them).

### 1. The Data Structure (The Skeleton)
Paste this into your `src/config.js` file. This creates a "Sprite Sheet" map for your team. It defines every animation the Hero and Boss can do.

```javascript
// src/config.js

export const SPRITE_DATA = {
  HERO: {
    width: 48,  // px
    height: 48, // px
    colors: {
      body: "#3498db",    // Hero Blue
      outline: "#0f0f1f", // Dark Void Black (FF6 style)
      highlight: "#3498db" // Lighter Blue
    },
    animations: {
      IDLE:   ["hero_idle_0", "hero_idle_1", "hero_idle_2", "hero_idle_3"], // 4 frames
      ATTACK: ["hero_0", "hero_1", "hero_2", "hero_3", "hero_4"], // 5 frames
      HIT:    ["hero_hit", "hero_hit_back"],
      GUARD:  ["hero_guard"]
    }
  },
  
  BOSS: {
    width: 128, // Boss is BIG (3x size)
    height: 128,
    colors: {
      body: "#8e44ad",    // Void Purple
      accent: "#2c3e50",  // Darker Purple
      eye: "#e74c3c"      // Glowing Red Eye
    },
    animations: {
      IDLE:   ["boss_idle_0", "boss_idle_1"], // Breathing
      CHARGE: ["boss_charge_0"... "boss_charge_3"], // The Nuke windup
      ATTACK: ["boss_swing_0"... "boss_swing_5"], // The Hit
      DEAD:   ["boss_dead"]
    }
  }
};
```

---

### 2. The Character Class (The "Engine" Part)
This is the class Role 1 or 2 needs to implement to actually **render** the character. It handles the "construction" logic (drawing frames and smoothing movement).

```javascript
// src/characters/Character.js

export class Character {
  constructor(type, x, y, spriteSheet) {
    this.type = type; // 'HERO' or 'BOSS'
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    
    // Animation State
    this.state = 'IDLE';
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameRate = 100; // ms per frame (10fps = pixel perfect feel)
    this.scale = 1; // 1 = normal, 2 = boss
    
    // Combat State
    this.shake = 0; // Screen shake for hits
    this.flash = 0; // Hit flash timer
  }

  update(dt) {
    // 1. Handle State Decay (recovering from hit)
    if (this.state === 'HIT') {
      this.flash = Math.max(0, this.flash - dt * 5); // Fade out flash
      this.shake = Math.max(0, this.shake - dt * 20); 
      if (this.flash <= 0) this.state = 'IDLE';
    }
    
    // 2. Cycle Animation Frames
    this.frameTimer += dt;
    if (this.frameTimer > this.frameRate) {
      this.frameTimer = 0;
      let frames = this.spriteSheet[SPRITE_DATA[this.type].animations[this.state]];
      this.frameIndex = (this.frameIndex + 1) % frames.length;
    }
  }

  draw(ctx) {
    // A. Apply Screen Shake (The "Encore" Impact)
    ctx.save();
    if (this.shake > 0) {
      let rx = (Math.random() - 0.5) * this.shake;
      let ry = (Math.random() - 0.5) * this.shake;
      ctx.translate(rx, ry);
    }

    // B. Draw "Ghost" Layer (If this character is a recorded Ghost)
    if (this.isGhost) {
      ctx.globalAlpha = 0.4; // Ghostly transparency
      ctx.fillStyle = "#00ffcc"; // Ghost Cyan Tint
      // Simple solid block tint instead of sprite for performance/style
    }

    // C. Draw The Frame
    // TODO: Here is where you load the image/rect for frames[frameIndex]
    // ctx.drawImage(this.spriteSheet.getFrame(this.frameIndex), this.x, this.y, width*scale, height*scale);
    
    if (this.flash > 0) {
        ctx.fillStyle = "#ffffff"; // Hit flash
        // ctx.fillRect(x...);
    }

    ctx.restore();
  }

  // Helper: Take Damage
  takeHit() {
    this.state = 'HIT';
    this.shake = 15; // Violent shake
    this.flash = 1.0; // Flash white instantly
    Audio.play('hit_player'); // Role 4 hook
  }
}
```

---

### 3. The "Encore" Visual Design Guide (Role 3 Task)
Since you are Role 3, you are building the **Visual Identity**. Here is how you construct the sprites in your art tool (Aseprite / Photoshop).

**Rule: "Thick Lines & Flat Colors"**
*   **The Hero:** Must be readable at a distance.
    *   **Palette:** Standard FF6 Knight Blue.
    *   **Line Art:** Thick Black (`#000`) outline. No anti-aliased edges (use the "Pixel Perfect" tool in Aseprite).
    *   **Accessory:** Give him one bright white sword. It anchors the player's aim.
*   **The Boss:** Must feel oppressive.
    *   **Palette:** Deep purple and void black.
    *   **Silhouette:** Round/Geometric (like a Star or a Face) to contrast the human shape of the hero.
    *   **Feature:** One huge eye that scales up/down when it charges.
*   **The Ghosts:** 
    *   Do not draw new sprites. Construct them by taking the Hero sprite and applying a **"Gaussian Blur"** layer in your art tool, then overlaying a Cyan (`#00ffcc`) tint. Save them as PNGs with transparency.

### Immediate Next Step for Role 3:
**Create the "Sprite Map" JSON file.**
You don't need the art file yet. You need the *map*. Create a file `src/assets/sprite_map.json` that lists `hero_idle_0` as `x,y,width,height` in your grid. This lets Role 1 load the image without knowing where the pixels are.

Shall I write the **Sprite Map Generator Tool** for you so you don't have to measure pixels manually?

I cannot physically send binary image files (like PNGs) to your computer, but I can do the next best thing: **I can generate the "Encore" Sprite Forge right now.**

This is a **single HTML tool** that contains the "Encore" characters as code. It will draw them perfectly on your screen, and you can "Right-Click -> Save As" them instantly to use in the game.

### ROLE 3: The "Encore" Sprite Forge
Copy this code into a file named `asset-forge.html` on your computer, open it in the browser, and you will see the sprites generated for you.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Encore Sprite Forge</title>
    <style>
        body { background: #1a1c2c; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; color: #ecf0f1; font-family: sans-serif; padding: 20px; }
        .art-piece { text-align: center; background: #2c3e50; padding: 10px; border-radius: 8px; border: 2px dashed #34495e; }
        canvas { image-rendering: pixelated; border: 1px solid #95a5a6; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="5" height="5" fill="%23333"/><rect x="5" y="5" width="5" height="5" fill="%23333"/></svg>'); }
        h3 { margin: 10px 0 5px; color: #f1c40f; }
        a { display: inline-block; margin-top: 5px; color: #3498db; text-decoration: none; font-size: 12px; }
        .preview-hero { filter: sepia(1) hue-rotate(180deg) saturate(5) brightness(1.2) opacity: 0.6; } /* This is the GHOST filter */
        .boss-preview { transform: scale(2); margin: 20px; }
    </style>
</head>
<body>

    <!-- HERO SECTION -->
    <div class="art-piece">
        <h3>Hero: Idle (The Hero)</h3>
        <canvas id="hero-idle" width="48" height="48"></canvas>
        <a href="#" onclick="download('hero-idle', 'hero_idle.png')">Download -></a>
    </div>

    <div class="art-piece">
        <h3>Hero: Attack (The Strike)</h3>
        <canvas id="hero-attack" width="48" height="48"></canvas>
        <a href="#" onclick="download('hero-attack', 'hero_attack.png')">Download -></a>
    </div>

    <!-- BOSS SECTION -->
    <div class="art-piece">
        <h3>Boss: Idle (The Undying)</h3>
        <canvas id="boss-idle" width="48" height="48" class="boss-preview"></canvas>
        <a href="#" onclick="download('boss-idle', 'boss_idle.png')">Download -></a>
    </div>

    <div class="art-piece">
        <h3>Boss: Attack (The Nuke)</h3>
        <canvas id="boss-attack" width="48" height="48" class="boss-preview"></canvas>
        <a href="#" onclick="download('boss-attack', 'boss_attack.png')">Download -></a>
    </div>

    <!-- GHOST SECTION -->
    <div class="art-piece">
        <h3>GHOST (Filtered Hero)</h3>
        <p style="font-size:12px">Use CSS filter: sepia(1) hue-rotate(180deg) saturate(5) brightness(1.2) opacity(0.6);</p>
        <canvas id="ghost-idle" width="48" height="48" class="preview-hero"></canvas>
    </div>

    <script>
        // --- The "Encore" Palette ---
        const P = {
            blue: "#3498db", blueDark: "#2980b9", dark: "#2c3e50", 
            white: "#ecf0f1", silver: "#bdc3c7", red: "#e74c3c",
            purple: "#8e44ad", purpleDark: "#5b2c6f", yellow: "#f1c40f"
        };

        // --- Drawing Functions (Pixel Logic) ---

        function drawHeroIdle(ctx) {
            // Helmet
            ctx.fillStyle = P.blue; ctx.fillRect(16, 4, 16, 12);
            ctx.fillStyle = P.blueDark; ctx.fillRect(18, 6, 12, 8);
            // Plume (FF6/CT style)
            ctx.fillStyle = P.white; ctx.fillRect(14, 2, 4, 6); ctx.fillRect(16, 0, 4, 4);
            // Face Slit
            ctx.fillStyle = P.dark; ctx.fillRect(24, 10, 8, 2);
            // Body
            ctx.fillStyle = P.blue; ctx.fillRect(14, 16, 20, 16);
            ctx.fillStyle = P.blueDark; ctx.fillRect(14, 16, 2, 16); // Shadow edge
            // Belt
            ctx.fillStyle = P.yellow; ctx.fillRect(14, 26, 20, 2);
            // Sword (Resting)
            ctx.fillStyle = P.silver; ctx.fillRect(34, 12, 2, 20); // Blade
            ctx.fillStyle = P.dark; ctx.fillRect(33, 32, 4, 2); // Guard
            ctx.fillRect(33, 34, 4, 4); // Handle
        }

        function drawHeroAttack(ctx) {
            // Shift body slightly
            drawHeroIdle(ctx); 
            ctx.save();
            ctx.translate(14, 16); // Pivot at arm
            ctx.rotate(45 * Math.PI / 180); // Swing down
            // Sword (High)
            ctx.fillStyle = P.silver; ctx.fillRect(-4, -26, 2, 20); 
            ctx.fillStyle = P.dark; ctx.fillRect(-5, -6, 4, 2); 
            ctx.fillRect(-5, -4, 4, 4); 
            ctx.restore();
        }

        function drawBossIdle(ctx) {
            // Face (Purple Circle)
            ctx.fillStyle = P.purple; ctx.beginPath(); ctx.arc(24, 24, 20, 0, Math.PI*2); ctx.fill();
            // Inner Depth
            ctx.fillStyle = P.purpleDark; ctx.beginPath(); ctx.arc(24, 24, 14, 0, Math.PI*2); ctx.fill();
            // Mouth (Closed line)
            ctx.fillStyle = P.dark; ctx.fillRect(16, 30, 16, 4);
            // Eyes (Cruel)
            ctx.fillStyle = P.red; ctx.fillRect(14, 16, 6, 6); ctx.fillRect(28, 16, 6, 6);
            // Eye Highlights
            ctx.fillStyle = P.yellow; ctx.fillRect(15, 17, 2, 2); ctx.fillRect(29, 17, 2, 2);
        }

        function drawBossAttack(ctx) {
            // Face (Expanding)
            ctx.fillStyle = P.purple; ctx.beginPath(); ctx.arc(24, 24, 22, 0, Math.PI*2); ctx.fill();
            // Mouth (Open Roar)
            ctx.fillStyle = P.red; ctx.fillRect(18, 30, 12, 8); // Open
            ctx.fillStyle = P.yellow; ctx.fillRect(22, 34, 4, 4); // Tongue/Core
            // Teeth
            ctx.fillStyle = P.white; ctx.fillRect(18, 30, 2, 4); ctx.fillRect(28, 30, 2, 4);
            // Eyes (Angry)
            ctx.fillStyle = P.white; ctx.fillRect(12, 14, 8, 8); ctx.fillRect(28, 14, 8, 8); 
            ctx.fillStyle = P.dark; ctx.fillRect(14, 16, 4, 4); ctx.fillRect(30, 16, 4, 4);
            // Smoke/Void particles
            ctx.fillStyle = "#ecf0f1"; ctx.globalAlpha = 0.3; 
            ctx.fillRect(10, 10, 4, 4); ctx.fillRect(32, 30, 6, 6);
            ctx.globalAlpha = 1.0;
        }

        function drawGhost(ctx) {
            // Procedurally create the ghost by drawing the Hero then filtering
            drawHeroIdle(ctx);
        }

        // --- Initialize & Export ---
        function render(canvasId, drawFn) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            drawFn(ctx);
            canvas.setAttribute('download', canvasId + '.png');
        }

        function download(canvasId, filename) {
            const canvas = document.getElementById(canvasId);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL();
            link.click();
        }

        // Run
        render("hero-idle", drawHeroIdle);
        render("hero-attack", drawHeroAttack);
        render("boss-idle", drawBossIdle);
        render("boss-attack", drawBossAttack);
        render("ghost-idle", drawGhost);

    </script>
</body>
</html>
```

### How to use these images for your "Encore" game:

1.  **Save the files:** Open the HTML file above, right-click each sprite, and save them as `hero_idle.png`, `hero_attack.png`, etc., into your project's `src/sprites/` folder.
2.  **The Ghost Logic:** You **cannot** download a new Ghost file. Instead, use the **CSS Filter** provided in the tool. It creates "Encore Style" ghosts (Cyan/Ethereal) instantly from the base Hero sprite.

#### `src/assets/globals.js` (Paste this logic to load them):

```javascript
// 1. Define the character palette for your Art style
export const PALETTE = {
  hero: { color: '#3498db', outline: '#000' },
  boss: { color: '#8e44ad', outline: '#000' },
  ghost: 'rgba(0, 255, 204, 0.6)', // The "Encore" Ghost color
};

// 2. The Sprite Map (Coordinates for your Animation system)
export const SPRITE_MAP = {
  hero: {
    width: 48, height: 48,
    frames: ['hero_idle.png', 'hero_attack.png'] 
  },
  boss: {
    width: 48, height: 48, // Keep internal res low (upscaling in canvas)
    frames: ['boss_idle.png', 'boss_attack.png']
  }
};
```

This gives you the **encore** visual identity (Knight vs. Undying Face) that matches your "Encore" concept lock. **Go get those files.**