# GAME_SPEC.md

## Game Overview

**Title:** Puchi & Pao’s Sparkling Adventure  
**MVP Level:** Level 1: Sunlit Shores  
**Genre:** 2D side-scrolling platformer  
**Engine:** Phaser.js  
**Visual Style:** 16-bit pixel-art-inspired, using placeholder assets at first  
**Target Platform:** Local browser game, later deployable to Vercel  
**Tone:** Classic platformer challenge with a soft, cute, family-adventure tone

---

## Creative Premise

The Light of the Sea has gone missing. **Puchi** and **Pao** arrive at **Sandbanks from Barrhaven** to collect magical shells, restore the giant clam shrine, and bring the glow back to Ontario.

The first level, **Sunlit Shores**, introduces the world, the movement system, the collectible loop, character powers, shallow water, underwater movement, simple enemies, checkpointing, and the goal shrine.

---

## Player Characters

The player chooses one character before starting Level 1.

### Puchi

**Role:** Magical, curious, expressive explorer  
**Visual identity:** Purple/pink, sparkles, magical jacket-inspired palette  
**Movement:** Slightly higher jump, slightly slower run speed  
**Power:** Sparkle Burst

#### Sparkle Burst

Input: `E`

Behavior:

- Emits a short-range sparkle pulse around Puchi.
- Stuns nearby crab enemies for a short duration.
- Can reveal or activate nearby hidden shell collectibles.
- Has a cooldown to avoid spamming.

Recommended initial values:

```text
Run speed: 190
Run speed with Shift: 230
Jump velocity: -420
Power radius: 72 px
Power cooldown: 2 seconds
Stun duration: 1.5 seconds
```

### Pao

**Role:** Bold, capable, protective adventurer  
**Visual identity:** Green top, denim/blue, shell charm, braids-inspired silhouette  
**Movement:** Slightly faster run speed, slightly lower jump  
**Power:** Shell Shield

#### Shell Shield

Input: `E`

Behavior:

- Activates a temporary protective shell shield.
- Blocks one enemy hit during shield duration.
- Can stun or bump a crab enemy if active during contact.
- Has a cooldown.

Recommended initial values:

```text
Run speed: 210
Run speed with Shift: 255
Jump velocity: -390
Shield duration: 1.5 seconds
Power cooldown: 3 seconds
```

---

## Controls

```text
Left Arrow / A: Move left
Right Arrow / D: Move right
Space: Jump
Shift: Run / dash modifier
E: Character power
Enter: Start / confirm
Esc: Pause
```

Gamepad support is not required for the MVP.

---

## Health System

Use a three-heart system.

Rules:

- Player starts with 3 hearts.
- Taking damage removes 1 heart.
- Player gets brief invulnerability after damage.
- If hearts reach 0, show Game Over.
- Player can restart from Game Over.
- Checkpoint updates the respawn location.
- Falling into a pit or invalid area respawns the player at the last checkpoint and removes 1 heart.

Recommended values:

```text
Starting hearts: 3
Post-hit invulnerability: 1.25 seconds
Respawn delay: 0.75 seconds
```

---

## Collectibles

### Stars

Common collectible.

Purpose:

- Score / reward trail
- Guides the player through the intended path
- Teaches jumps and exploration

### Shells

Special optional collectible.

Purpose:

- Optional challenge reward
- Hidden secrets
- Encourage exploration
- Some can require harder jumps, underwater exploration, or using character powers

### Giant Pearl / Light of the Sea

Goal objective found at the Giant Clam Shrine.

Purpose:

- Ends the level
- Restores the Light of the Sea
- Triggers level-clear screen

---

## Level 1: Sunlit Shores

### Difficulty Target

Level 1 should feel similar in difficulty to **Super Mario Bros. 1-1 and 1-2**:

- Easy start
- Gradual introduction of enemies and gaps
- Safe early jumps
- Optional harder secrets
- A short underground/underwater-style section
- Clear finish line
- Forgiving enough for family play

### Structure

Level 1 has two connected sections:

1. **Beach / Overworld Section**
2. **Underwater Path Section**

The underwater section should be short and simple, acting as the MVP’s version of a 1-2-inspired sub-area.

---

## Level Flow

### Section A: Beach Start

Purpose:

- Establish movement
- Show the beach setting
- Introduce stars

Elements:

- Start sign
- Flat sandy platform
- Palm silhouettes
- First easy star trail
- First beach dog with speech cloud: “I am gafo”

Player lesson:

- Move right
- Jump
- Collect stars

### Section B: First Enemy and Tide Pools

Purpose:

- Introduce crab enemy
- Introduce shallow water slow zone

Elements:

- One crab walking on a flat platform
- Shallow tide pool that slows movement
- Shell collectible placed near but not inside danger
- Low-risk gap after enemy

Player lesson:

- Avoid or stun enemies
- Shallow water changes movement

### Section C: Floating Isles

Purpose:

- Introduce platforming challenge
- Add optional shell route

Elements:

- Floating grassy rock platforms
- Star trail over platforms
- Optional higher shell collectible
- Safe recovery area beneath first floating platform

Player lesson:

- Time jumps
- Use Puchi’s higher jump or Pao’s faster movement differently

### Section D: Checkpoint

Purpose:

- Reduce frustration before underwater section

Elements:

- Checkpoint flag
- Second beach dog with speech cloud: “I am gafo”
- Small safe rest area

Player lesson:

- Touch checkpoint to save progress

### Section E: Underwater Path

Purpose:

- Add a short 1-2-inspired alternate movement section

Elements:

- Deep water transition
- Slower underwater movement
- Fish/coral background decoration
- Star trail underwater
- One optional hidden shell
- No harsh enemy swarm

Player lesson:

- Movement feels different underwater
- Explore for secrets

### Section F: Final Beach Return

Purpose:

- Return to bright overworld
- Build toward goal

Elements:

- Final crab enemy
- Third beach dog with speech cloud: “I am gafo”
- Final shell or star arc
- Small final platforming challenge

Player lesson:

- Use all learned skills

### Section G: Giant Clam Shrine Goal

Purpose:

- End level with a visual reward

Elements:

- Glowing giant clam
- Giant Pearl / Light of the Sea
- Sparkling particles
- Goal trigger zone
- Level clear screen

Player lesson:

- Reach the goal and complete the level

---

## Enemies and NPCs

### Crab Enemy

Behavior:

- Walks left and right on a platform.
- Turns around at walls or platform edges if edge detection is implemented.
- Damages player on touch.
- Can be stunned by Puchi’s Sparkle Burst.
- Can be stunned/bumped by Pao’s Shell Shield.

MVP behavior can be simple patrol between two x-values.

### Beach Dogs

There must be exactly **three beach dogs** in Level 1 for the MVP.

Each dog:

- Is non-hostile.
- Has a cloud/speech bubble.
- Says: **“I am gafo”**
- Adds humor and personality to the level.

Placement:

1. Early safe area near start
2. Checkpoint area
3. Near final beach return before goal

---

## Water Rules

### Shallow Water

- Slows horizontal movement.
- Does not damage the player.
- Should be visually clear with lighter blue water overlay.

Recommended effect:

```text
Movement speed multiplier: 0.65
Jump velocity multiplier: 0.9
```

### Deep Water / Underwater Section

- Triggers underwater movement feel.
- Slower horizontal movement.
- Reduced gravity or altered jump/swim movement.
- Should not be too difficult in MVP.

Recommended behavior:

```text
Gravity: reduced
Movement speed multiplier: 0.75
Jump/swim impulse: gentler and repeatable
```

---

## UI

The gameplay UI should show:

```text
Character: Puchi or Pao
Hearts: 3 max
Stars: number collected
Shells: number collected / total optional shells
Power cooldown: simple icon or text indicator
```

For the MVP, text UI is acceptable.

---

## Screens

### Title Screen

Must show:

- Game title: **Puchi & Pao’s Sparkling Adventure**
- Prompt: “Press Enter to Start”
- 8-bit-style music begins or fades in

### Story Screen

Must show:

> The Light of the Sea has gone missing. Puchi and Pao arrive at Sandbanks from Barrhaven to collect magical shells, restore the giant clam shrine, and bring the glow back to Ontario.

Prompt:

```text
Press Enter to continue
```

### Character Select Screen

Must show:

- Puchi option
- Pao option
- Short gameplay summary for each

Example:

```text
Puchi
Higher jump + Sparkle Burst

Pao
Faster run + Shell Shield
```

### Level Complete Screen

Must show:

- Level complete message
- Stars collected
- Shells collected
- Prompt to restart or return to title

### Game Over Screen

Must show:

- Game over message
- Prompt to retry

---

## Audio

Use original 8-bit-style audio.

Recommended MVP approach:

- Generate sound effects using Web Audio.
- Generate a simple chiptune music loop using Web Audio or small tone sequences.
- Later replace with final audio files if needed.

Required FX:

- Jump
- Land
- Collect star
- Collect shell
- Power use
- Enemy bump/stun
- Damage
- Checkpoint
- Goal clear
- Menu select

---

## MVP Acceptance Criteria

The MVP is successful if:

- The game runs locally.
- Player can start the game from a title screen.
- Player sees story intro.
- Player selects Puchi or Pao.
- The selected character has correct movement/power differences.
- Level 1 is playable from start to goal.
- Beach and underwater sections are both present.
- Stars and shells can be collected.
- Three beach dogs say “I am gafo”.
- Crab enemies exist and interact with powers.
- Shallow water slows the player.
- Underwater path changes movement.
- Checkpoint works.
- Three-heart health works.
- Goal shrine ends the level.
- Music and sound effects are present, even if generated by code.
