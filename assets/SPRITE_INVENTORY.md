# Sprite Inventory

## Characters

### Puchi
Path:
`assets/sprites/characters/puchi/puchi-spritesheet.png`

Purpose:
Main gameplay sprite sheet for Puchi.

Expected contents:
- idle frames
- run frames
- jump frames
- fall frames
- power-use frames for throwing yellow dog stuffies
- win / celebration frames

Notes:
Puchi is the younger character. She should read as smaller, bouncier, purple/pink, and magical/playful.

Path:
`assets/sprites/characters/puchi/puchi-hit-defeat-spritesheet.png`

Purpose:
Supplemental damage and defeat sprite sheet for Puchi.

Expected contents:
- lose-one-heart / hit reaction frames
- full defeat / game-over frames

### Pao
Path:
`assets/sprites/characters/pao/pao-spritesheet.png`

Purpose:
Main gameplay sprite sheet for Pao.

Expected contents:
- idle frames
- run frames
- jump frames
- fall frames
- power-use frames for throwing basketballs
- win / celebration frames

Notes:
Pao is the older character. She should read as taller, athletic, green top, blue jeans, brown braids.

Path:
`assets/sprites/characters/pao/pao-hit-defeat-spritesheet.png`

Purpose:
Supplemental damage and defeat sprite sheet for Pao.

Expected contents:
- lose-one-heart / hit reaction frames
- full defeat / game-over frames

### Mami
Path:
`assets/sprites/characters/mami/mami-spritesheet.png`

Purpose:
Celebration NPC sprite sheet for the end of Level 1.

Expected contents:
- idle frames
- walk/run frames
- jump frames
- celebrate frames
- hurt frames

Reference:
`assets/references/mami-charactersheet.png`

Path:
`assets/sprites/characters/mami/mami-congrats-portrait.png`

Purpose:
Mami portrait used on the Level 1 congratulations screen.

## Enemies

Path:
`assets/sprites/enemies/crab-spritesheet.png`

Purpose:
Crab enemy sprite sheet.

Expected contents:
- idle frames
- moving/walking frames
- stunned/hurt frame
- defeat frames

Path:
`assets/sprites/enemies/boss-crab/BossCrab-spritesheet.png`

Purpose:
Previous giant crab level boss sprite sheet, retained as an unused legacy asset.

Expected contents:
- idle frames
- walk/run/charge frames
- attack frames
- stunned frames
- hit reaction frames
- defeat/collapse frames

Reference:
`assets/references/BossCrab-charactersheet.png`

Path:
`assets/sprites/enemies/giant-goose/Goose-spritesheet.png`

Purpose:
Original Giant Goose final boss source sprite sheet. This sheet is irregular and includes row labels, so it is used as source art rather than loaded directly in gameplay.

Path:
`assets/sprites/enemies/giant-goose/Goose-gameplay-spritesheet.png`

Purpose:
Cleaned Giant Goose final boss gameplay sprite sheet with uniform padded frames.

Path:
`assets/sprites/enemies/giant-goose/Goose-boss-clean-spritesheet.png`

Purpose:
Runtime Giant Goose final boss sheet loaded by Phaser. This reduced 4 x 4 sheet uses 360 x 180 frames and keeps only clean idle, patrol, hurt/stunned, and defeat frames. All visible frames are bottom-aligned for reliable feet-to-platform placement.

Expected contents:
- idle frames
- walk / patrol frames
- stunned frames
- hurt / hit reaction frames
- defeat / collapse frames

Reference:
`assets/references/Goose-CharacterSheet.png`

## Projectiles

Path:
`assets/sprites/projectiles/projectiles-ball-pompom.png`

Purpose:
Projectile sprite sheet.

Expected contents:
- Pao basketball projectile frames
- Puchi yellow dog stuffy projectile frames

Notes:
Pao throws basketballs. Puchi throws yellow dog stuffies inspired by a cute pudding-dog plush vibe, but not copied from any copyrighted character.

## Items

Path:
`assets/sprites/items/items-star-shell-pearl-spritesheet.png`

Purpose:
Collectible and goal item sprite sheet.

Expected contents:
- star collectible frames
- shell collectible frames
- Giant Pearl / Light of the Sea goal item frames
- heart pickup frames

## NPCs

Path:
`assets/sprites/npcs/gafo-dog-spritesheet.png`

Purpose:
Friendly golden retriever NPC.

Expected contents:
- idle frames
- tail wag frames
- walk frames
- sitting frame
- speech bubble frame saying "I am gafo"

Path:
`assets/sprites/npcs/start-sign-spritesheet.png`

Purpose:
Start sign sprite sheet for the beginning of the level.

Expected contents:
- start sign idle frames
- wobble/sparkle variants

## Environment

Path:
`assets/sprites/environment/AngryRestaurant-sprite.png`

Purpose:
Decorative restaurant environment prop.

Expected contents:
- single restaurant building image

Path:
`assets/sprites/environment/palmtree-spritesheet.png`

Purpose:
Palm tree environmental prop.

Expected contents:
- full palm tree
- sway frames
- variant frames

## Checkpoints

Path:
`assets/sprites/checkpoints/course-flag-spritesheet.png`

Purpose:
Checkpoint flag sprite sheet.

Expected contents:
- inactive flag
- active flag
- waving frames
- sparkle/activated frames
