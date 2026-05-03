# PLAN.md

## Goal

Build the first playable MVP of **Puchi & Pao’s Sparkling Adventure** using Phaser.js.

The MVP should deliver a complete first level, **Level 1: Sunlit Shores**, with the difficulty and teaching curve of classic early Mario levels, especially 1-1 and 1-2, while keeping a soft, magical, family-friendly tone.

---

## Recommended Implementation Strategy

Build in thin vertical slices. Do not try to create all systems at once.

Each milestone should leave the game runnable.

---

## Phase 0: Project Setup

### Objective

Create a clean local Phaser project that runs in the browser.

### Tasks

1. Create Vite project.
2. Add Phaser.
3. Add TypeScript if practical.
4. Create base folder structure.
5. Add simple `README.md` with local run commands.
6. Confirm `npm run dev` launches the game.

### Expected commands

```bash
npm create vite@latest puchi-pao-sparkling-adventure -- --template vanilla-ts
cd puchi-pao-sparkling-adventure
npm install
npm install phaser
npm run dev
```

### Acceptance criteria

- Browser opens local game page.
- Phaser canvas renders.
- No console errors.

---

## Phase 1: Scene Skeleton

### Objective

Create the core screen flow.

### Scenes

- `BootScene`
- `TitleScene`
- `StoryScene`
- `CharacterSelectScene`
- `Level1Scene`
- `UIScene`
- `GameOverScene`
- `LevelCompleteScene`

### Flow

```text
BootScene
  -> TitleScene
  -> StoryScene
  -> CharacterSelectScene
  -> Level1Scene + UIScene
  -> GameOverScene or LevelCompleteScene
```

### Acceptance criteria

- Pressing Enter advances through Title, Story, and Character Select.
- Player can choose Puchi or Pao.
- Selected character is passed into Level1Scene.

---

## Phase 2: Placeholder Visual System

### Objective

Create simple but readable placeholder visuals in a 16-bit-inspired style.

### Tasks

1. Set a fixed game resolution.
2. Add pixel-art-friendly rendering settings.
3. Use simple generated textures or Phaser graphics for:
   - Puchi
   - Pao
   - Platforms
   - Stars
   - Shells
   - Crab
   - Dog
   - Speech bubble
   - Checkpoint flag
   - Giant clam shrine
   - Water zones
4. Use a consistent palette:
   - Ocean blue
   - Turquoise
   - Sunset gold
   - Purple/pink for Puchi
   - Green/teal/denim for Pao
   - Sandy tan
   - Shell pink

### Acceptance criteria

- Placeholder objects are visually distinguishable.
- Puchi and Pao are clearly different.
- Level has a beach/sunset mood, even with simple art.

---

## Phase 3: Player Controller

### Objective

Implement the basic platformer controller.

### Tasks

1. Add arcade physics.
2. Add left/right movement.
3. Add jumping.
4. Add Shift run modifier.
5. Add collision with platforms.
6. Add camera follow.
7. Add character-specific movement values.

### Character movement values

Puchi:

```text
Base speed: 190
Run speed: 230
Jump velocity: -420
```

Pao:

```text
Base speed: 210
Run speed: 255
Jump velocity: -390
```

### Acceptance criteria

- Puchi jumps slightly higher.
- Pao runs slightly faster.
- Movement feels responsive.
- Player cannot fall through platforms.

---

## Phase 4: Level 1 Blockout

### Objective

Build the full Level 1 layout using placeholder platforms.

### Level sections

1. Beach start
2. First enemy / tide pool
3. Floating isles
4. Checkpoint
5. Underwater path
6. Final beach return
7. Giant Clam Shrine goal

### Tasks

1. Create long horizontal level.
2. Add safe starting flat area.
3. Add basic platform progression.
4. Add shallow water zone.
5. Add floating platforms.
6. Add underwater section.
7. Add final goal platform.
8. Add camera bounds and world bounds.

### Acceptance criteria

- Player can traverse from start to goal.
- Jumps are fair.
- The level is not too hard for a first stage.
- Optional paths exist for shells.

---

## Phase 5: Collectibles

### Objective

Add stars and shells.

### Tasks

1. Add star collectibles along main path.
2. Add shell collectibles on optional challenge paths.
3. Add collection logic.
4. Add counters in UI.
5. Add sound triggers for collection.

### Placement guidance

Stars:

- Use stars to guide the main path.
- Place stars in gentle arcs over jumps.
- Use stars to signal safe direction.

Shells:

- Hide or place shells in optional routes.
- Put one shell near tide pools.
- Put one shell in floating platform section.
- Put one shell in underwater path.
- Put one shell near final challenge.

### Acceptance criteria

- Stars disappear when collected.
- Shells disappear when collected.
- UI updates correctly.
- Collection feels rewarding.

---

## Phase 6: Enemies and NPCs

### Objective

Add crab enemies and beach dogs.

### Crab tasks

1. Create crab placeholder sprite.
2. Add simple left/right patrol.
3. Add player damage on contact.
4. Add stun state.
5. Allow Puchi’s Sparkle Burst to stun crab.
6. Allow Pao’s Shell Shield to block/stun crab.

### Dog tasks

1. Add three non-hostile beach dogs.
2. Add cloud/speech bubble above each dog.
3. Each speech bubble must say: **“I am gafo”**.
4. Place dogs at:
   - Start area
   - Checkpoint area
   - Final beach return

### Acceptance criteria

- Crab patrols.
- Crab can damage player.
- Crab can be stunned.
- Three dogs appear.
- All dog speech bubbles are readable.

---

## Phase 7: Character Powers

### Objective

Implement each character’s special ability.

### Puchi: Sparkle Burst

Input: `E`

Tasks:

1. Add power cooldown.
2. Render sparkle pulse effect.
3. Detect nearby crab enemies.
4. Stun crab enemies inside radius.
5. Optionally reveal a hidden shell if nearby.
6. Play power sound.

### Pao: Shell Shield

Input: `E`

Tasks:

1. Add power cooldown.
2. Render shield effect around Pao.
3. Block one enemy hit while shield is active.
4. Stun crab on shield contact.
5. Play power sound.

### Acceptance criteria

- Each character has a unique, useful power.
- Powers cannot be spammed.
- Powers are visible and understandable.
- Powers affect enemy interaction.

---

## Phase 8: Health, Damage, Respawn, and Checkpoint

### Objective

Make the level feel like a real game with consequences.

### Tasks

1. Add three-heart health system.
2. Add UI hearts.
3. Add damage invulnerability window.
4. Add respawn behavior.
5. Add checkpoint flag.
6. Save respawn location after checkpoint.
7. Add Game Over state at 0 hearts.

### Acceptance criteria

- Player starts with 3 hearts.
- Damage removes 1 heart.
- Invulnerability prevents instant repeated damage.
- Checkpoint updates respawn location.
- Game Over appears at 0 hearts.
- Retry works.

---

## Phase 9: Water and Underwater Section

### Objective

Implement shallow water and underwater movement.

### Shallow water tasks

1. Create shallow water zone.
2. Detect player overlap.
3. Reduce movement speed while inside zone.
4. Add light blue visual overlay or tile area.

### Underwater tasks

1. Create deep water transition zone.
2. Change movement feel underwater.
3. Reduce gravity or allow gentle swim impulse.
4. Add underwater decorations.
5. Add underwater stars and one optional shell.
6. Return player to normal physics when exiting.

### Acceptance criteria

- Shallow water slows movement.
- Underwater section feels different but simple.
- Player can complete underwater path without frustration.

---

## Phase 10: Goal and Level Complete

### Objective

Add satisfying level completion.

### Tasks

1. Create Giant Clam Shrine placeholder.
2. Add glowing pearl / Light of the Sea object.
3. Add overlap trigger.
4. Play goal clear sound.
5. Transition to LevelCompleteScene.
6. Show stars and shells collected.

### Acceptance criteria

- Reaching the Giant Clam Shrine ends the level.
- Level Complete screen appears.
- Collection stats are shown.
- Player can restart or return to title.

---

## Phase 11: Audio

### Objective

Add simple original 8-bit-style audio.

### Recommendation

Use **Web Audio for MVP**.

Use generated tones for:

- Jump
- Land
- Collect star
- Collect shell
- Power use
- Enemy stun
- Damage
- Checkpoint
- Goal clear
- Menu select

Use a small code-generated chiptune loop for music.

Later, replace generated audio with external `.ogg` or `.wav` files if desired.

### Why Web Audio first

- No copyright risk.
- No asset dependencies.
- Very small repo.
- Easy to prototype.
- Easy to replace later.

### Acceptance criteria

- Music plays on title or after user input.
- FX play for major interactions.
- Audio can be muted or at least does not spam loudly.

---

## Phase 12: Polish Pass

### Objective

Make the MVP charming and playable.

### Tasks

1. Tune movement values.
2. Tune jump distances.
3. Improve platform spacing.
4. Add simple particles for collectibles and powers.
5. Add sunset gradient background.
6. Add parallax clouds and ocean if simple.
7. Improve title screen layout.
8. Improve character select readability.
9. Add pause behavior if time allows.
10. Fix bugs.

### Acceptance criteria

- The game feels pleasant to play.
- Level can be completed consistently.
- Main mechanics are clear.
- Nothing feels obviously broken.

---

## Suggested Implementation Order for Codex

Use this order strictly unless there is a strong reason to change it:

1. Project setup
2. Scene skeleton
3. Placeholder visual generation
4. Player movement
5. Level blockout
6. Stars and shells
7. UI counters
8. Crab enemy
9. Health system
10. Beach dogs with “I am gafo” bubbles
11. Character powers
12. Checkpoint
13. Water zones
14. Goal shrine
15. Game over and level complete
16. Audio
17. Polish

---

## MVP Testing Checklist

Manual test each item:

```text
[ ] Game starts locally with npm run dev
[ ] Title screen appears
[ ] Enter advances to story screen
[ ] Story screen text is readable
[ ] Enter advances to character select
[ ] Puchi can be selected
[ ] Pao can be selected
[ ] Puchi jumps higher than Pao
[ ] Pao runs faster than Puchi
[ ] Player can complete beach section
[ ] Player can collect stars
[ ] Player can collect shells
[ ] Shells are optional
[ ] First crab damages player
[ ] Puchi can stun crab with Sparkle Burst
[ ] Pao can block/stun crab with Shell Shield
[ ] Three hearts display correctly
[ ] Damage removes one heart
[ ] Invulnerability works after damage
[ ] Shallow water slows player
[ ] Underwater section changes movement
[ ] Checkpoint updates respawn point
[ ] All three dogs appear
[ ] All three dogs say “I am gafo”
[ ] Giant Clam Shrine triggers completion
[ ] Level complete screen shows stats
[ ] Game over screen appears at 0 hearts
[ ] Retry works
[ ] Sound effects play
[ ] Music loop plays after user interaction
```

---

## Notes for Future Iterations

After the MVP works, consider:

- Replacing placeholder sprites with real pixel art.
- Adding sprite animations.
- Adding proper tilemaps.
- Adding mobile controls.
- Adding gamepad support.
- Adding a second level.
- Adding local co-op.
- Adding character switching during levels.
- Adding more dog jokes.
- Adding a world map.
- Adding final composed music and mastered FX.
