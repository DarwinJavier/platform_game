# AGENTS.md

## Project

**Game title:** Puchi & Pao’s Sparkling Adventure  
**Genre:** 2D side-scrolling platformer  
**Engine:** Phaser.js  
**MVP target:** Local browser-playable prototype  
**Primary level:** Level 1: Sunlit Shores  
**Tone:** Classic platformer challenge with a soft, cute, family-adventure feel.

This project is a 16-bit pixel-art-inspired platform game starring two playable characters: **Puchi** and **Pao**. The MVP should focus on creating a polished, playable Level 1 with a title screen, story intro, character selection, basic platforming, collectibles, hazards, powers, checkpoint, and goal sequence.

---

## Agent Role

You are acting as a senior game-prototyping engineer using Phaser.js. Your job is to build a small, playable, maintainable MVP rather than over-engineer a large game system.

Prioritize:

1. Playable feel
2. Clear level progression
3. Simple, readable code
4. Easy local setup
5. Extensible architecture
6. Placeholder assets that can later be replaced with final sprites, music, and sound effects

Do not spend time creating complex asset pipelines, advanced menus, multiplayer, online features, save systems, or procedural generation unless explicitly requested later.

---

## Core Build Requirements

Use **Phaser.js** for the game.

The MVP must include:

- Title screen
- Short story intro
- Character select screen
- Playable Level 1: Sunlit Shores
- Two connected level sections:
  - Beach / overworld section inspired by Mario 1-1
  - Short underwater / cave-like section inspired by Mario 1-2
- Character-specific movement and power differences
- Three-heart health system
- Star collectibles
- Special shell collectibles
- Three beach dogs with speech clouds saying: **“I am gafo”**
- Crab enemy
- Shallow water slow zone
- Deep water underwater section
- Checkpoint flag
- Goal: Giant Clam Shrine / Giant Pearl / Light of the Sea
- Music loop and sound effects
- Win/level-clear state
- Restart behavior after death

---

## Technical Constraints

The MVP should run locally in VS Code using standard Node tooling.

Recommended stack:

- Vite
- TypeScript preferred, JavaScript acceptable if simplicity demands it
- Phaser 3
- Local development with `npm install` and `npm run dev`

Use a simple folder structure:

```text
puchi-pao-sparkling-adventure/
  index.html
  package.json
  vite.config.ts
  src/
    main.ts
    scenes/
      BootScene.ts
      TitleScene.ts
      StoryScene.ts
      CharacterSelectScene.ts
      Level1Scene.ts
      UIScene.ts
      GameOverScene.ts
      LevelCompleteScene.ts
    systems/
      AudioManager.ts
      InputManager.ts
      PlayerController.ts
      LevelBuilder.ts
    data/
      characters.ts
      level1.ts
      constants.ts
    types/
      game.ts
  public/
    assets/
      README.md
```

If using JavaScript instead of TypeScript, keep the same structure but use `.js` files.

---

## Important Development Behavior

Before editing code:

1. Read `GAME_SPEC.md`.
2. Read `PLAN.md`.
3. Inspect the existing file structure.
4. Make the smallest useful change that advances the MVP.

When adding features:

- Keep logic modular.
- Avoid hardcoding everything inside one giant scene file.
- Prefer data-driven configuration for character stats, collectibles, enemy positions, and level sections.
- Keep placeholder art simple but readable.
- Keep the game running after every major change.

When uncertain, choose the simpler implementation that gets the game playable.

---

## Visual Direction

The game should be **16-bit pixel-art-inspired**, but the MVP can use placeholder sprites drawn in code.

Use a palette inspired by the concept boards:

- Ocean blue
- Turquoise
- Sunset gold
- Warm cream
- Coral pink
- Purple / magenta for Puchi
- Teal / green / denim blue for Pao
- Sandy tan
- Shell pink

The level should feel like a magical Ontario beach adventure, loosely inspired by Sandbanks, with dreamy sunset lighting, tide pools, glowing water, floating rocks, shells, stars, and a giant clam shrine.

Placeholder assets may be created using Phaser graphics primitives:

- Rectangles for platforms
- Circles/stars for collectibles
- Simple pixel blocks for characters
- Simple crab shape
- Simple dog shapes with speech bubbles
- Simple flag pole
- Simple clam/pearl goal

Do not block gameplay progress waiting for final art.

---

## Gameplay Feel

Target difficulty: close to **Super Mario Bros. 1-1 and 1-2**.

That means:

- The player learns safely at the start.
- First enemy appears after movement/jump basics are clear.
- Gaps should be fair and readable.
- Platforms should teach timing gradually.
- Secrets should be optional, not required.
- Death should be possible but not punishing.
- The level should be beatable by a new player within a few attempts.

The game should be forgiving enough for family play but still feel like a real platformer.

---

## Player Characters

The player chooses one character before the level starts. Character switching during gameplay is not part of the MVP.

### Puchi

Personality: imaginative, curious, cheerful, magical.  
Visual placeholder direction: purple/pink character with sparkle accents.

Gameplay:

- Slightly higher jump than Pao
- Slightly slower run speed than Pao
- Special power: **Sparkle Burst**

Sparkle Burst behavior for MVP:

- Triggered with `E`
- Creates a short-range sparkle effect around Puchi
- Stuns nearby crab enemies briefly
- Reveals or activates nearby hidden shell collectibles, if implemented
- Has a short cooldown

### Pao

Personality: bold, upbeat, capable, protective.  
Visual placeholder direction: green/teal character with shell/charm accents.

Gameplay:

- Slightly faster run speed than Puchi
- Slightly lower jump than Puchi
- Special power: **Shell Shield**

Shell Shield behavior for MVP:

- Triggered with `E`
- Brief protective shield around Pao
- Blocks one crab/enemy hit during the shield window
- Can bump/stun a crab if active while touching it
- Has a short cooldown

---

## Controls

Default keyboard controls:

```text
Left / Right arrows or A / D: Move
Space: Jump
Shift: Run / dash modifier
E: Character power
Enter: Start / confirm
Esc: Pause
```

Gamepad support is not required for the MVP.

---

## Health and Failure

Use a **three-heart health system**.

Rules:

- Player starts with 3 hearts.
- Touching crab or hazard removes 1 heart unless protected by Pao’s shield.
- Player gets brief invulnerability after taking damage.
- Falling into a pit or dangerous deep area can either remove 1 heart and respawn at last safe point, or trigger death if hearts reach 0.
- At 0 hearts, show Game Over screen with restart option.
- Checkpoint saves respawn location.

---

## Collectibles and Progression

Collectibles:

- **Stars:** common collectible / score
- **Shells:** special optional collectibles
- **Giant Pearl / Light of the Sea:** goal objective at the Giant Clam Shrine

Implement a simple UI showing:

- Hearts
- Stars collected
- Shells collected
- Selected character

Optional challenge:

- Some shells should require slightly harder jumps, exploration, underwater traversal, or using a character power.
- Do not make special shells mandatory to finish Level 1.

---

## Level 1 Content

Level name: **Sunlit Shores**

Story framing:

> The Light of the Sea has gone missing. Puchi and Pao arrive at Sandbanks from Barrhaven to collect magical shells, restore the giant clam shrine, and bring the glow back to Ontario.

Level flow:

1. Start on sunny beach
2. Learn movement and jumping
3. Collect first stars
4. Meet first beach dog saying “I am gafo”
5. Encounter first crab enemy
6. Tide pool zone with shallow water slow effect
7. Floating rock platforms
8. Optional shell challenge route
9. Checkpoint flag
10. Short underwater path / cave-like section
11. Second and third beach dogs saying “I am gafo”
12. Final platforming sequence
13. Giant Clam Shrine goal
14. Level clear

---

## Audio Direction

Use an **original 8-bit-style music loop**. Do not use copyrighted melodies.

Best MVP recommendation:

- Use **Web Audio-generated sound effects** for short FX.
- Use a simple **code-generated chiptune music loop** for the first prototype.
- Later, replace the generated loop with `.wav`, `.ogg`, or `.mp3` assets created separately.

Why:

- Web Audio keeps the repo lightweight.
- No licensing risk.
- No need to manage sound files early.
- Easy to modify or disable.

Required sound effects:

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

Keep audio simple, charming, and non-annoying.

---

## Definition of Done for MVP

The MVP is done when:

- Game launches locally.
- Title screen appears.
- Story intro appears.
- Player can choose Puchi or Pao.
- Level 1 loads.
- Player can move, jump, collect stars/shells, use powers, take damage, and reach the goal.
- Level includes both beach and underwater sections.
- Level has three beach dogs saying “I am gafo”.
- UI shows hearts, stars, shells, and character.
- Game has placeholder music and sound effects.
- Game can restart after death or completion.
- Code is organized enough for future asset replacement.

---

## Avoid

Do not add these during the first MVP unless requested:

- Online multiplayer
- Save files
- Account system
- Procedural generation
- Complex animation tooling
- Final art pipeline
- Mobile touch controls
- Advanced physics
- Boss fights
- Large world map
- Multiple levels beyond Level 1
- Complicated inventory systems

Build the smallest charming playable version first.
