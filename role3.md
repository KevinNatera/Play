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