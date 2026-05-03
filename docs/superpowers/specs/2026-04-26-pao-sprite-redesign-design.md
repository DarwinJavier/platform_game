# Pao Sprite Redesign — Design Spec

**Date:** 2026-04-26  
**Goal:** Visually overhaul the code-drawn Pao gameplay sprite to better match the reference character sheet (`references/pao-character-sheet.png`), while keeping all art drawn in code (no PNG sprite files).

---

## Approach: Option C — Structural Restructure + Redraw

Work in two phases:

1. **Phase 1** — Fix the underlying coordinate system and proportions so every pose has the right foundation.
2. **Phase 2** — Redraw all 9 poses with correct anatomy, expressions, and pose-specific details.

---

## Phase 1: Structural Foundation

### Frame Size

| | Current | Proposed |
|---|---|---|
| Width | 124 px | 124 px (unchanged) |
| Height | 124 px | **160 px** |
| ART_SCALE | 1.3 | **1.0** (draw at 1:1 for clarity) |

Rationale: the square 124×124 frame squashes the character. The reference shows a clearly taller silhouette. Removing ART_SCALE and working at 1:1 makes the drawing coordinates match screen pixels directly, which is easier to reason about.

### Coordinate Layout (idle reference)

```
y ≈ 10–18   Head top
y ≈ 28–42   Head centre / face
y ≈ 44–52   Neck
y ≈ 52–60   Shoulders
y ≈ 60–104  Torso (shirt ends ~y=101, belt y=104)
y ≈ 108–118 Hips / waist
y ≈ 118–134 Upper legs / knees
y ≈ 134–150 Lower legs / feet
```

### Key Structural Changes

- **Neck segment added** — a short skin-coloured rect connecting head to torso. Currently the head sits directly on the torso.
- **Back braid kept in-frame** — in idle poses the current braid clips off the left edge. The new layout keeps all braid segments within the 124 px width.
- **Longer legs** — feet move from y≈86 (old) to y≈145–150. Legs are roughly half the total body height, matching the reference.
- **Midriff** — a strip of skin tone between the shirt hem and belt is added. The reference shows a crop top with a visible gap.
- **Shell necklace** — a cream circle + pendant drawn on the torso front. Already partially present but repositioned for the new torso coordinates.

### PlayerController.ts Changes

**Scale:** The current sprite renders too large on screen (~92 px tall on a 540 px canvas). The new 124×160 frame with the character filling ~130 px of texture height should be displayed at `setScale(0.52)`, giving ~68 px on screen — proportional for this style of 2D platformer. This is a starting value; it can be tuned in one line once the sprite is running in the game.

**Hitbox:** Must be updated for the new frame dimensions and scale. Values below are approximate and will be confirmed after rendering:

```typescript
// Old
this.sprite.setScale(1);
this.sprite.setSize(34, 70);
this.sprite.setOffset(45, 42);

// New
this.sprite.setScale(0.52);
this.sprite.setSize(34, 88);   // hitbox in texture pixels, before scale
this.sprite.setOffset(45, 38);
```

Note: Phaser's `setSize` and `setOffset` work in the texture's own pixel space, so they do not need to be divided by the scale factor.

---

## Phase 2: All 9 Poses Redrawn

### Expression System

Three expression tiers used across poses:

| Tier | Brows | Mouth | Used in |
|---|---|---|---|
| **Focused** | Short, thin, high above eyes — plenty of gap (Option B) | Filled crescent smile — bezier curve, no teeth (Option C) | Idle 1, Idle 2, Fall, Power |
| **Happy** | Relaxed, same height, slightly lower | Wide rounded-rect smile with white teeth sliver | Run 1, Run 2, Jump, Win |
| **Hurt** | Flat, same height | Small tight grimace, no teeth | Hurt only |

**Brow detail (Focused / Happy):** Short rects, thin (1–1.5 px height), placed well above the eyes with visible skin gap. Lighter colour (`PAO.hair` not `PAO.hairDark`) so they read as soft. Both brows at the same height — no inner-corner raising which reads as anger.

**Smile detail (Focused):** Filled crescent using two quadratic bezier curves — outer arc dips ~8 px below the corners, inner arc dips ~4 px. Width ~17 px. No teeth visible.

### Pose-by-Pose Plan

#### Idle 1
- Upright confident stance, weight even on both feet
- Arms hanging relaxed at sides, slight outward angle
- Back braid hangs straight behind, 5 bead segments reaching waist
- Front braid falls forward over right shoulder
- Expression: **Focused**

#### Idle 2 (second frame of idle animation)
- Identical to Idle 1 with a subtle weight shift: hip tilts slightly, one arm rests closer to hip
- Creates a gentle "breathing" feel in the 2-frame idle cycle
- Expression: **Focused**

#### Run 1
- Body leans forward
- Left arm swings forward-up, right arm swings back-down
- Left leg strides forward, right leg pushes back
- Back braid flies horizontally behind the head
- Expression: **Happy**

#### Run 2
- Opposite of Run 1: right arm forward, left arm back; right leg back, left leg forward
- Back braid mirrors Run 1 position
- Expression: **Happy**

#### Jump
- Both arms raised above head
- Knees pulled upward and inward
- Back braid floats upward/behind
- Front braid lifts slightly
- Expression: **Happy**

#### Fall
- Distinct from Jump: arms spread wide and angled downward (bracing)
- Legs trail loosely below
- Back braid trails upward (carried by upward air resistance)
- Expression: **Focused** (alert, not panicked)

#### Hurt
- Body leans backward in recoil
- Both arms flung up and back
- Front braid hidden (obscured by recoil lean)
- Back braid hangs normally
- Expression: **Hurt**

#### Win
- One arm raised in victory (left arm, fist up)
- Other arm rests on hip
- Sparkle effect drawn beside the head (cross shape in `COLORS.magicGlow`)
- Back braid floats/lifted
- Expression: **Happy**

#### Power (Basketball Toss)
- Overhand wind-up pose: right arm raised back and up holding ball, left arm extended forward for balance
- Basketball drawn as a filled orange circle (~7 px radius) with two thin crossing lines for seams
- Planted stance — feet further apart than idle for stability
- Expression: **Focused** (concentrating on throw)

### Braid Detail

**Back braid:** 5 circular bead segments in `PAO.hairDark`, each with a `PAO.hair` highlight circle inside, and a `PAO.hairLight` specular dot. Tied with a `COLORS.tropicalAqua` rect at the end. Position varies per pose (hanging / flying back / floating).

**Front braid:** 4 segments, same layered circle approach. Tied with `COLORS.tropicalAqua`. Hidden in Hurt pose.

---

## Files Changed

| File | Change |
|---|---|
| `src/systems/PaoSpriteFactory.ts` | Complete rewrite — new constants, new drawing functions, all 9 poses |
| `src/systems/PlayerController.ts` | 2 lines: `setSize` and `setOffset` updated for 124×160 frame |

No other files are touched.

---

## Out of Scope

- Puchi sprite (separate task if desired)
- PNG/image-based sprites (post-MVP)
- New animation frames beyond the current 9 poses
- Any gameplay mechanic changes
