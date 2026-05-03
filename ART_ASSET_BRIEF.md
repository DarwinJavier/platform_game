# ART_ASSET_BRIEF.md

## Project
**Puchi & Pao’s Sparkling Adventure**

## Purpose
This document translates the visual references and game design into concrete art tasks for Codex and future asset creation.

For the MVP, the game should use **placeholder sprites and shapes drawn in code**. This brief exists so those placeholders still feel visually coherent and so later production art can be created with a clear target.

This file should be used alongside:
- `AGENTS.md`
- `PLAN.md`
- `GAME_SPEC.md`
- `/assets/references/VISUAL_DIRECTION.md`
- `/assets/references/puchi-reference.jpg`
- `/assets/references/pao-reference.jpg`
- `/assets/references/sunlit-shores-reference.jpg`

---

## 1. Art Direction Summary

### Core style
- 16-bit-inspired pixel-art platformer
- Bright, readable, family-friendly presentation
- Classic platformer clarity similar to Mario, but with a warmer beach-fantasy tone
- Golden-hour lighting with ocean sparkle and magical shell/star accents

### Core visual pillars
1. **Readability first** — gameplay surfaces, enemies, collectibles, and hazards must be instantly readable
2. **Warm beach fantasy** — sunset glow, bright water, soft magic, playful shapes
3. **Character identity** — Puchi and Pao should feel distinct even in placeholder form
4. **Production-aware MVP** — all art starts simple and can be upgraded later without redesigning systems

---

## 2. MVP Art Production Rules

For MVP implementation, Codex should:
- Use placeholder art rendered in code or from tiny generated sprite blocks
- Prefer simple rectangles, circles, and small pixel patterns over large art pipelines
- Establish a **consistent palette** and **shape language**
- Separate art into clear categories: player, enemy, collectibles, environment, UI, FX
- Make sure each placeholder is easy to swap later

### Naming convention
If files are created later, prefer names like:
- `player_puchi_idle`
- `player_pao_idle`
- `enemy_crab_walk`
- `npc_beachdog_idle`
- `pickup_star`
- `pickup_shell`
- `goal_giant_clam`
- `tile_sand_ground`
- `tile_rock_ground`
- `ui_heart`
- `fx_sparkle`
- `fx_shell_shield`

---

## 3. Character Asset Briefs

## 3.1 Puchi
### Identity
- Younger sister
- Cheerful, magical, curious
- Slightly higher jump
- Signature power: sparkle burst

### Visual cues
- Purple / pink identity
- Warm brown or auburn hair
- Energetic silhouette
- Cute, adventurous, expressive

### Placeholder MVP visual spec
- Small pixel character, readable at a glance
- Main body color: purple/pink
- Hair color: medium brown / auburn
- Accent color: pink or lavender
- Silhouette cue: slightly rounder / more playful proportions than Pao
- Optional tiny pink earring pixel or bright accent near head area

### Required states for MVP
- Idle
- Run
- Jump
- Hurt
- Power use
- Win / goal clear

### Future production cues
- Keep the magical jacket identity in later art
- Sparkle power should visually relate to stars and shimmering shell magic

---

## 3.2 Pao
### Identity
- Older sister
- Confident, athletic, upbeat
- Slightly faster run
- Signature power: shell shield

### Visual cues
- Green / teal identity
- Long brown hair in braids
- More grounded, confident stance
- Slightly stronger / more stable silhouette than Puchi

### Placeholder MVP visual spec
- Main body color: green / teal
- Hair color: brown
- Accent color: cream or shell tone
- Silhouette cue: slightly taller / more upright feel than Puchi
- Optional braid suggestion through longer head/back shape or darker hair pixels

### Required states for MVP
- Idle
- Run
- Jump
- Hurt
- Power use
- Win / goal clear

### Future production cues
- Shell necklace and braid identity should remain in later art
- Shield power should read as sea-magic protection, not aggression

---

## 4. Enemy and NPC Asset Briefs

## 4.1 Crab Enemy
### Role
Basic early-game enemy. Equivalent to a beginner platformer walking hazard.

### Visual direction
- Red-orange crab
- Cute rather than threatening
- Side-walking silhouette with raised claws
- Must contrast strongly against sand and rocks

### MVP placeholder spec
- Simple rounded red-orange body
- Two small claws
- Two eye stalks or bright eyes
- Small left/right patrol animation if possible

### Required states
- Walk
- Stunned / defeated

---

## 4.2 Beach Dogs
### Role
Ambient humorous NPC/hazard flavor element

### Requirement from spec
There are **3 beach dogs** with a cloud/speech bubble that says:
**“I am gafo”**

### Design guidance
- Friendly, comedic beach dogs
- They should not feel like realistic dogs; they should feel like charming stylized NPCs
- Keep the speech cloud highly readable

### MVP placeholder spec
- Three small dog silhouettes placed in the level
- Use light brown, cream, or sandy fur colors
- Bubble above or near each dog with the text: `I am gafo`
- If implementing only one sprite, clone it three times with slight position differences

### Behavior recommendation
For MVP, they can be static or have tiny idle movement only

---

## 5. Collectible Asset Briefs

## 5.1 Star Pickup
### Role
Common collectible / score item

### Visual direction
- Bright golden-yellow star
- Glowing and attractive
- Easy to see from distance

### MVP placeholder spec
- 5-point star shape or simplified star icon
- Yellow fill with lighter highlight
- Optional twinkle animation or scale pulse

---

## 5.2 Shell Pickup
### Role
Special collectible / optional challenge item

### Visual direction
- Pink, cream, coral, or pearly shell
- Slight magical glow
- Feels more special than stars

### MVP placeholder spec
- Small shell icon with rounded top ridges
- Cream / pink / pearl palette
- Optional glow or bobbing motion

---

## 5.3 Giant Pearl / Light of the Sea
### Role
Level goal

### Visual direction
- Luminous magical pearl
- Sits within giant clam shrine
- Must feel important and rewarding

### MVP placeholder spec
- Bright circular pearl or orb
- Cream-white core with pale yellow glow
- Surrounded by a giant clam or shrine frame
- Use stronger glow than standard collectibles

---

## 6. Environment Asset Briefs

## 6.1 Terrain Tiles
### Terrain layers needed
- Sand top tile
- Rock body tile
- Grass / foliage accent tile (optional)
- Edge / corner tiles for simple platform shaping

### MVP placeholder spec
- Sandy top with warm beige highlight
- Rocky underside with darker brown shading
- Clear collision surface line
- Chunky, readable platform edges

### Visual rule
Gameplay surfaces must be more visually solid than decorative background elements

---

## 6.2 Water Zones
### Types
- Shallow water: slows player
- Deep water: transitions movement into underwater mode / section

### MVP placeholder spec
- Shallow water: light cyan strip with visible sandy bottom
- Deep water: deeper blue with stronger transparency effect or darker fill
- Add small wave line at top
- Optional sparkle or ripple animation

### Visual distinction rule
Player must immediately understand whether water is shallow or deep

---

## 6.3 Underwater Section
### Visual identity
- Cooler palette
- Bubbles, coral, sea plants, fish silhouettes
- Still friendly and readable

### MVP placeholder spec
- Blue overlay or palette shift
- Simple coral and seaweed decorations
- Bubble particles or floating circles
- Hidden shell placement path

---

## 6.4 Checkpoint
### Role
Mid-level progress marker

### Visual direction
- Small flag or glowing marker
- Friendly and obvious
- Slight magical shimmer

### MVP placeholder spec
- Pole + flag icon
- Teal or blue flag with star or shell symbol
- Small glow or pulse when activated

---

## 6.5 Goal Shrine / Giant Clam
### Role
Final level destination

### Visual direction
- Giant open clam
- Magical shrine presence
- Surrounded by glow, shells, or stone frame
- Signals completion and restoration of the Light of the Sea

### MVP placeholder spec
- Oversized clam shape
- Pearl/orb in center
- Light yellow/cream glow
- Slight decorative plants or stone base if easy

---

## 7. FX Asset Briefs

## 7.1 Puchi Power FX
- Sparkle burst
- Star-like particles
- Light purple / pink / gold palette
- Brief, readable, not screen-filling

## 7.2 Pao Power FX
- Shell shield shimmer
- Circular or arcing shield effect
- Teal / aqua / cream palette
- Suggest defense and confidence

## 7.3 General FX
Required small effects:
- Jump dust puff
- Landing puff
- Star pickup twinkle
- Shell pickup glow
- Enemy stun bump
- Damage flash
- Checkpoint shimmer
- Goal clear burst
- Water splash
- Underwater bubbles

For MVP, these can be simple circles, particles, flashes, or tiny pixel bursts.

---

## 8. UI Asset Briefs

## 8.1 Title Screen
### Required elements
- Game title: **Puchi & Pao’s Sparkling Adventure**
- Start button / prompt
- Character select entry point
- Cozy, bright beach-platformer tone

### MVP placeholder spec
- Large title text rendered in code
- Background gradient inspired by Sunlit Shores
- Optional simple icon of star + shell + ocean line

---

## 8.2 Character Select Screen
### Required elements
- Select Puchi or Pao
- Brief description of each character power
- Clear input prompt

### MVP placeholder spec
- Two side-by-side panels
- Purple-accent card for Puchi
- Green-accent card for Pao
- Small placeholder figure for each
- Labels:
  - `Puchi — Higher Jump / Sparkle Burst`
  - `Pao — Faster Run / Shell Shield`

---

## 8.3 HUD
### Required elements
- 3-heart health display
- Star counter
- Shell counter
- Selected character indicator (optional)

### MVP placeholder spec
- Heart icon or red pixel hearts
- Numeric counters for stars and shells
- Clean top-of-screen alignment

---

## 9. Palette Recommendations
Use these as implementation anchors.

### Environment
- Deep ocean blue: `#1F5E8F`
- Mid ocean blue: `#2E8BC0`
- Tropical aqua: `#4FC3D9`
- Seafoam: `#C8F1F4`
- Sunset gold: `#F6C35B`
- Warm sun glow: `#FFDD87`
- Peach sky: `#F5B37A`
- Sandy beige: `#D9B77A`
- Warm rock brown: `#8F6A46`
- Palm green: `#4E8B57`

### Puchi
- Purple: `#7A4BC2`
- Pink: `#E77ACB`
- Lavender: `#C8A7F2`

### Pao
- Teal-green: `#2F8F7F`
- Adventure green: `#3C7A53`
- Shell cream: `#F4E4C8`

### Collectibles / magic
- Star gold: `#FFD84D`
- Shell pearl glow: `#F8E7FF`
- Magic glow: `#FFF3B0`
- Crab red-orange: `#D9653B`

---

## 10. Minimum Asset List for MVP

### Player
- Puchi placeholder sprite/state set
- Pao placeholder sprite/state set

### Enemies / NPCs
- Crab enemy
- Beach dog NPC x3
- Speech cloud: `I am gafo`

### Collectibles
- Star
- Shell
- Giant pearl goal object

### Level / props
- Sand tile
- Rock tile
- Water zone visuals
- Underwater decoration set
- Checkpoint flag
- Giant clam shrine
- Palm tree or beach plant prop
- Optional shell/starfish prop

### UI
- Title screen layout
- Character select layout
- HUD hearts
- HUD counters

### FX
- Sparkle burst
- Shield shimmer
- Dust puffs
- Pickup effects
- Splash / bubbles

---

## 11. Codex Execution Guidance
When implementing art-related work, Codex should:
1. Start with simple code-drawn placeholders
2. Keep all visuals modular and swappable
3. Match the palette and atmosphere from the reference docs
4. Avoid spending early cycles on detailed sprite polish
5. Prioritize gameplay readability over visual complexity
6. Use comments and naming that make later art replacement easy

Recommended instruction for Codex:
> Use placeholder sprites and drawn shapes for MVP art, but make them consistent with the visual direction docs. Build a clean art structure so the game can later be upgraded with full pixel-art assets without reworking gameplay systems.

---

## 12. Future Upgrade Path
After the MVP is playable, later art passes can upgrade:
- Character animation frames
- Real tilemap art
- Background parallax layers
- Improved collectible icons
- Animated water
- Better clam shrine art
- Better dogs and speech bubbles
- Menu polish and typography
- Particle FX polish

The MVP should be built so this upgrade path is straightforward.
