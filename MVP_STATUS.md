# MVP Status

## Current State

`Puchi & Pao's Sparkling Adventure` now has a playable local Phaser MVP for Level 1: Sunlit Shores.

Implemented:

- Vite + TypeScript + Phaser 3 setup
- Title, story intro, character select, gameplay, game over, and level complete screens
- Puchi and Pao selection with different movement values
- Playable side-scrolling Level 1 blockout with beach, tide pool, floating platform, checkpoint, underwater, final beach, and clam shrine sections
- Stars and optional shell collectibles with HUD counters
- Three beach dogs with `I am gafo` speech bubbles
- Crab enemies with patrol, damage, stun, and power interactions
- Three-heart health, invulnerability, fall respawn, checkpoint respawn, and Game Over retry
- Puchi Sparkle Burst and Pao Shell Shield
- Shallow water slow zone and underwater movement zone
- Giant Clam Shrine goal and level complete stats
- Generated placeholder art, particles, chiptune loop, and Web Audio sound effects
- Reference-guided generated Sunlit Shores backdrop in `public/assets/sunlit-shores-backdrop.png`
- Reference-guided generated foreground terrain tile in `public/assets/sunlit-shores-platform-tile.png`
- Pause and mute controls

## Controls

```text
Arrow keys / A-D: Move
Space: Jump / swim
Shift: Run
E: Character power
Esc: Pause in Level 1
Enter: Confirm / retry
M: Mute audio
```

## Verification

Automated checks run during implementation:

- `npm.cmd install`
- `npm.cmd run build`
- Local dev server HTTP check at `http://127.0.0.1:5173`

Known build note:

- Vite warns that the Phaser bundle is larger than 500 kB after minification. This is expected for the current single-bundle MVP.

## Next Playtest Priorities

1. Manually play from title to goal with both Puchi and Pao.
2. Tune platform spacing around Floating Isles and Underwater Path if either character feels unfair.
3. Confirm crab damage, shield blocking, sparkle stun, checkpoint respawn, Game Over, and Level Complete flows feel clear.
4. Decide whether the next iteration should improve placeholder visuals, level layout, audio tuning, or add final-art asset loading.

## Remaining MVP Risks

- Level layout has build verification but has not been browser-playtested end to end with screenshots or a formal manual checklist.
- Foreground sprites are still placeholder art and should be replaced later with real pixel assets.
- Audio is generated and functional, but not musically balanced or mastered.
- No mobile/touch/gamepad support, per MVP scope.
