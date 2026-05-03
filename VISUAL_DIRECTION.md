# VISUAL_DIRECTION.md

## Level 1 Visual Direction — Sunlit Shores

This document translates the reference images into production guidance for Codex while the MVP still uses placeholder art.

---

## 1) Overall Visual Goal

The game should feel like a warm, inviting, 16-bit-inspired beach adventure platformer with dramatic golden-hour lighting, saturated ocean blues, and a magical storybook tone. The visual target is not realism. It is a stylized, readable, cheerful platformer world inspired by classic Mario readability, but with a softer, more luminous seaside identity.

Core principles:
- Bright, readable silhouettes
- Warm sunset / sunrise glow
- Rich ocean blues balanced with peach-gold highlights
- Chunky, friendly platform shapes
- Magical shell-and-star fantasy accents
- A family-friendly, adventurous atmosphere

---

## 2) Beach / Ocean Color Palette

Use these as direction, not strict limitations.

### Primary environment colors
- Deep ocean blue: `#1F5E8F`
- Mid ocean blue: `#2E8BC0`
- Tropical aqua: `#4FC3D9`
- Shallow water cyan: `#7ED6E8`
- Seafoam highlight: `#C8F1F4`
- Sunset gold: `#F6C35B`
- Warm sun glow: `#FFDD87`
- Peach sky light: `#F5B37A`
- Coral pink accent: `#F48C8C`
- Sandy beige: `#D9B77A`
- Warm rock brown: `#8F6A46`
- Palm leaf green: `#4E8B57`
- Deep foliage green: `#2F5E3C`

### Character-linked accent colors
For Puchi areas or pickups:
- Purple: `#7A4BC2`
- Pink-magenta accent: `#E77ACB`
- Lavender light: `#C8A7F2`

For Pao areas or pickups:
- Teal-green: `#2F8F7F`
- Adventure green: `#3C7A53`
- Shell cream: `#F4E4C8`

### Collectible / magic colors
- Star gold: `#FFD84D`
- Shell pearl glow: `#F8E7FF`
- Magical glow: `#FFF3B0`

---

## 3) Lighting Direction

### Time of day
Golden hour: late sunset or early sunrise.

### Lighting goals
- Strong sun near the horizon
- Bright reflective streak across the water
- Warm rim light on platforms, props, and characters
- Soft atmospheric haze in the far background
- Slightly cooler shadows than the sunlight
- Underwater areas should shift to cooler cyan-blue light

### Practical lighting rules for MVP
Even with placeholder art, simulate the look by:
- Using warm highlight colors on the top edges of platforms
- Using slightly darker cooler blues in shadows
- Applying a subtle gradient sky: warm near horizon, cooler blue above
- Adding sparkle or glow effects around shells, stars, and the goal clam
- Making the checkpoint and goal slightly brighter than the rest of the scene

---

## 4) Texture Direction

### Terrain
The terrain should look layered and readable:
- Top surfaces: sandy or grassy edges with warm highlights
- Mid layers: rocky cliff faces with chunky, cartoony cracks
- Bottom edges: darker rock shadow for depth

### Water
Water should feel lively and clean:
- Surface reflections from the sun
- Clear edge separation between shallow and deep water
- Gentle animated wave motion if feasible
- Underwater section should show fish, coral, sea plants, bubbles, and filtered light beams

### Decorative props
Use repeated beach props for identity:
- Shells
- Starfish
- Small tide pool plants
- Palm trees
- Sea grass
- Rock arches or small outcrops
- Clam shrine / giant pearl goal

### Texture style
Do not aim for noisy realism. Use:
- Large readable shapes
- Soft pixel-art texture
- Minimal detail clutter on collision-critical surfaces
- Higher detail reserved for backgrounds and decorative props

---

## 5) Atmosphere

The level should feel:
- Adventurous
- Sunny
- Coastal
- Slightly magical
- Safe but exciting
- Nostalgic in the way Mario 1-1 and 1-2 are memorable, but warmer and more inviting

The player should feel like they are exploring a glowing Ontario beach fantasy inspired by Sandbanks, not a dangerous grim world.

Mood words:
- Sparkling
- Breezy
- Playful
- Glowing
- Cheerful
- Wonder-filled

---

## 6) Background Composition Guidance

### Beach section
Include:
- Ocean horizon with visible sun
- Large cloud formations
- Palm trees or stylized coastal vegetation
- Floating rocky isles
- A readable start area on the left
- A checkpoint roughly 60–70% through the level
- Goal clam shrine at far right end of the section or after underwater exit

### Underwater section
Include:
- Cooler palette shift
- Gentle parallax fish or sea plants if practical
- Bubble accents
- Coral silhouettes
- Hidden shell collectible path
- Slight mystery tone, but still readable and friendly

---

## 7) FX Direction

### Recommended effects
- Small sparkle burst for Puchi power
- Soft shell shield shimmer for Pao power
- Star pickup twinkle
- Shell pickup glow
- Checkpoint shimmer
- Goal shrine radiant glow
- Dust puffs on jump / run / land
- Small water splash when entering deep water
- Bubbles in underwater section

Keep effects small, readable, and bright.

---

## 8) Readability Rules for Gameplay

Because this is a platformer, readability is more important than decoration.

Rules:
- Foreground collision platforms must be clearly separated from background art
- Hazard enemies (crabs, beach dogs) must stand out from terrain
- Collectibles should glow and contrast strongly
- Water zones should clearly signal whether they slow movement or allow swimming
- Secret shell locations can be decorative but should still be discoverable by observant players

---

## 9) Notes for Placeholder MVP Art

Even if using rectangles and simple drawn shapes, keep these cues:
- Warm sunset sky gradient
- Blue ocean band with reflective gold streak
- Sandy platform tops with darker rocky undersides
- Yellow stars for common collectibles
- Pink or cream shells for special collectibles
- Red-orange crabs for enemies
- Beach dogs in a readable silhouette with a speech cloud reading: “I am gafo”
- Large glowing clam with pearl as final goal

---

## 10) Audio Mood Pairing

Visuals should pair with:
- upbeat 8-bit melody
- light wave ambience
- short bubbly pickup sounds
- soft magical chime on powers

This should reinforce a cheerful, beachy, classic-platformer identity.
