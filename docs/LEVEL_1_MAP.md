# Level 1 Map: Sunlit Shores

World size: `7000 x 768`

Ground reference:
- Ground body center Y: `690`
- Ground body height: `56`
- Walkable ground top: `662`

## High-Level Flow

```text
0        1000      2000      3000      4000      5000      6000      7000
|---------|---------|---------|---------|---------|---------|---------|
START     beach/    Gafo      climb     flag      crab      crab      GOAL
safe      islands   chkpt     steps     chkpt     run       run
```

## Playable Strip

```text
Y
490                                      *  * shell           *     *
520                                      [floating]       [floating]
540                                      [floating] [floating]       [floating]
560             * star                   [floating] [floating]       [floating]
580                              [rock step]                 [rock]
600       [floating island]      [rock step]
620                         [floating island]
640                         [rock step]
662 [start beach]          [landing beach] [ground A] [ground B] [C1] [C2] [D]
690 =========================================================================
715
768 -----------------------------------------------------------------------

X  0        560  630 850   1000 1710 2500 2980 4100 4320 4410 4630 5150 5370 5720 5940 6050 6450 7000
```

## Platforms

| Role | Style | Center | Size | Walkable / Collision Range |
| --- | --- | --- | --- | --- |
| Start beach | beach | `x:280 y:690` | `560 x 56` | `x:0-560`, top `662` |
| First floating island | floating | `x:740 y:610` | `220 x 34` | `x:630-850`, top `593` |
| Main landing beach | beach | `x:1355 y:690` | `710 x 56` | `x:1000-1710`, top `662` |
| Second floating island | floating | `x:1910 y:637` | `220 x 34` | `x:1800-2020`, top `620` |
| Third floating island | floating | `x:2200 y:557` | `220 x 34` | `x:2090-2310`, top `540` |
| Ground A | beach | `x:2740 y:690` | `480 x 56` | `x:2500-2980`, top `662` |
| Ground C1 | beach | `x:4700 y:690` | `300 x 56` | `x:4550-4850`, top `662` |
| Ground C2 | beach | `x:6250 y:690` | `400 x 56` | `x:6050-6450`, top `662` |
| Ground D | beach | `x:6600 y:690` | `800 x 56` | `x:6200-7000`, top `662` |
| Rock A1 | rock | `x:2874 y:654` | `128 x 38` | `x:2810-2938`, top `635` |
| Rock A2 | rock | `x:3004 y:626` | `128 x 38` | `x:2940-3068`, top `607` |
| Rock A3 | rock | `x:3134 y:598` | `128 x 38` | `x:3070-3198`, top `579` |
| Rock C1 | rock | `x:5514 y:619` | `128 x 38` | `x:5450-5578`, top `600` |
| Island A1 | floating | `x:3460 y:577` | `220 x 34` | `x:3350-3570`, top `560` |
| Island B1 | floating | `x:3830 y:562` | `220 x 34` | `x:3720-3940`, top `545` |
| Island B2 | floating | `x:4210 y:575` | `220 x 34` | `x:4100-4320`, top `558` |
| Island B3 | floating | `x:4520 y:517` | `220 x 34` | `x:4410-4630`, top `500` |
| Island C1 | floating | `x:4880 y:562` | `220 x 34` | `x:4770-4990`, top `545` |
| Island C2 | floating | `x:5260 y:575` | `220 x 34` | `x:5150-5370`, top `558` |
| Island C3 | floating | `x:5830 y:562` | `220 x 34` | `x:5720-5940`, top `545` |

## Collectibles

| Item | Position | Notes |
| --- | --- | --- |
| Star 1 | `x:740 y:554` | Above the first floating island |
| Star 2 | `x:2680 y:582` | Ground A reward |
| Star 3 | `x:3460 y:505` | Above Island A1 |
| Star 4 | `x:3830 y:490` | Above Island B1 |
| Star 5 | `x:4880 y:490` | Above Island C1 |
| Star 6 | `x:5260 y:503` | Above Island C2 |
| Star 7 | `x:5830 y:490` | Above Island C3 |
| Shell 1 | `x:4210 y:490` | Optional reward over Island B2 |

## Decorations And Checkpoints

| Object | Position | Notes |
| --- | --- | --- |
| START sign | `x:145 y:600` | Beginning marker |
| Restaurant | `x:1500`, visible top `y:430` | Decorative restaurant behind player and crabs, scaled 1.3x larger |
| Palm tree | `x:330 y:704` | Start-area decoration |
| Palm tree | `x:1200 y:700` | Landing-beach decoration |
| Gafo dog | `x:2600 y:662` | Middle checkpoint, says `I am gafo` |
| Mami | `x:6800 y:748`, visible top about `y:540` | Static celebration pose near the end, Paola-height and feet anchored |
| Checkpoint flag | `x:6700 y:680` | Final checkpoint and level-complete trigger, bottom anchored. Starts the congratulations screen after 3 seconds. |

## Enemies

| Enemy | Position | Patrol | Notes |
| --- | --- | --- | --- |
| Crab | `x:1500 y:620` | `x:1370-1650` | Patrols on the landing beach |
| Crab | `x:2160 y:400` | `x:2100-2300` | Drops onto and patrols the third floating island |
| Crab B1 | `x:3460 y:518` | `x:3390-3570` | Patrols on Island A1 |
| Crab B2 | `x:4210 y:516` | `x:4140-4320` | Patrols on Island B2 |
| Crab C1 | `x:4700 y:620` | `x:4580-4820` | Patrols on Ground C1 |
| Giant Goose Boss | `x:6500 y:672` | Patrols around `x:6260-6740` | One-hit final obstacle, then plays collapse. |

## Water

| Kind | Center | Size | Range |
| --- | --- | --- | --- |
| None active | -- | -- | The old deep-water gap around `x:3530` was removed from the playable strip. Future water zones use the cleaned `water-spritesheet.png` frames. |

## Current Design Notes

- The first floating island is intentionally close to the start ledge:
  - Start right edge: `560`
  - Island collision left edge: `630`
  - Playable gap: `70px`
- The island-to-landing transition is forgiving:
  - Island right edge: `850`
  - Landing left edge: `1000`
  - Gap: `150px`
- The second floating island starts at `x:1800` with top `y:620`.
- The third floating island starts at `x:2090` with top `y:540`.
- The back near-water parallax layer starts at screen `y:620`.
