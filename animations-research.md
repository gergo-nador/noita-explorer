# Animations Research

Exploring the beauties of the Sprite Animations. 

This document ignores all enemies that have exactly one <SpriteComponent> tag in their xml declaration

## Emissive

Issue: These enemies have exactly two sprite components:
1. enemy sprite declaration
2. same size sprite of the emissive points of the enemy

### Affected enemies

- 2 sprite components for assassin
- 2 sprite components for basebot_neutralizer
- 2 sprite components for basebot_sentry
- 2 sprite components for basebot_soldier
- 2 sprite components for bigfirebug
- 2 sprite components for blob
- 2 sprite components for firebug
- 2 sprite components for miniblob
- 2 sprite components for necrobot
- 2 sprite components for necrobot_super
- 2 sprite components for necromancer_shop
- 2 sprite components for necromancer_super
- 2 sprite components for roboguard_big
- 2 sprite components for scavenger_glue
- 2 sprite components for thundermage
- 2 sprite components for thundermage_big
- 2 sprite components for lasershooter
- 2 sprite components for lukki_dark
- 2 sprite components for lukki_longleg
- 2 sprite components for wizard_dark
- 2 sprite components for wizard_neutral
- 2 sprite components for wizard_poly
- 2 sprite components for wizard_swapper
- 2 sprite components for wizard_tele
- 2 sprite components for wizard_twitchy
- 2 sprite components for zombie

### Solution

Create a separate gif of the emissive layer, can be easily shown on the website

## Health Bar

Issue: Exactly three sprites, two of them are health bar related.

### Affected enemies

- 3 sprite components for friend
- 3 sprite components for islandspirit
- 3 sprite components for boss_alchemist
- 3 sprite components for boss_pit
- 3 sprite components for boss_robot

### Solution

Ignore all SpriteComponents that has tags:
- _tags="health_bar_back,ui,invincible" 
- _tags="health_bar,ui,invincible"


## Many parts - Overlapping

Issue: Sprite split into multiple layers, need to merge them before as they should be one image

### Affected enemies

`shaman` - shaman, lantern, small flame in props_gfx
```xml
<Base file="data/entities/base_enemy_basic.xml" >
    <SpriteComponent
    	image_file="data/enemies_gfx/shaman.xml"
    	offset_x="0"
    	offset_y="0">
    </SpriteComponent>
</Base>
<!-- lantern, attached to hand -->
<Entity>
    <SpriteComponent
    	image_file="data/enemies_gfx/shaman_lantern.png"
    	offset_x="3.5"
    	offset_y="1"
    	z_index="-1.1">
    </SpriteComponent>
    <SpriteComponent
    	_enabled="0"
    	image_file="data/props_gfx/lantern_small_flame.xml"
    	alpha="1"
    	offset_x="4"
    	offset_y="3"
    	emissive="1"
    	additive="0"
    	next_rect_animation=""
    	rect_animation="stand"
    	z_index="-1.2"
    	>
    </SpriteComponent>
</Entity>
```

`wraith` - main, arm, purple circle around
```xml
<Base file="data/entities/base_enemy_flying.xml" >
	<SpriteComponent
		image_file="data/enemies_gfx/wraith.xml"
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
<SpriteComponent
	image_file="data/particles/area_indicator_096_purple_dark.png"
	z_index="1.2"
	offset_x="48"
	offset_y="48"
	_enabled="0"
	>
</SpriteComponent>
<SpriteComponent
	_tags="character"
	image_file="data/enemies_gfx/wraith_arm.xml"
	offset_x="0"
	offset_y="0"
	z_index="1.6"
	rect_animation="walk"
	>
</SpriteComponent>
```

`wraith_glowing` - fog of war hole
```xml
<Base file="data/entities/base_enemy_flying.xml" >
	<SpriteComponent
		image_file="data/enemies_gfx/wraith_glowing.xml"
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
<SpriteComponent
    alpha="0.55"
    image_file="data/particles/fog_of_war_hole.xml"
    smooth_filtering="1"
    fog_of_war_hole="1" >
</SpriteComponent>
```

`enlightened_alchemist` - purple background
```xml
<Base file="data/entities/base_enemy_basic.xml" >
	<SpriteComponent
		image_file="data/enemies_gfx/enlightened_alchemist.xml"
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
<SpriteComponent
	alpha="1"
	image_file="data/particles/enlightened_alchemist_halo_dark.xml"
	emissive="1"
    additive="1"
	special_scale_x="1"
	has_special_scale="1"
	rect_animation="stand" >
</SpriteComponent>
```

`boss_ghost_polyp` - body + eye
```xml
<SpriteComponent
	_tags="magic_eye"
	alpha="1"
	image_file="data/entities/animals/boss_ghost/polyp.xml"
	next_rect_animation=""
	offset_x="0"
	offset_y="0"
	additive="1"
	emissive="1"
	z_index="1.0"
	rect_animation=""
	update_transform_rotation="0"
	>
</SpriteComponent>
<SpriteComponent
	alpha="1"
	image_file="data/entities/animals/boss_ghost/polyp_eye.xml"
	next_rect_animation=""
	offset_x="0"
	offset_y="0"
	emissive="1"
	z_index="0.9"
	rect_animation=""
	update_transform_rotation="0"
	>
</SpriteComponent>
```

`sniper_hell` - main, laser, hell overlay
```xml
<Base file="data/entities/base_enemy_basic.xml" >
	<SpriteComponent
		image_file="data/enemies_gfx/sniper_hell.xml"
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
<SpriteComponent
	_tags="laser_sight"
	_enabled="1"
	alpha="1"
	image_file="data/particles/laser_red.png"
	offset_x="5"
	offset_y="1"
	emissive="1"
	additive="1"
	visible="0"
	update_transform="0"
	next_rect_animation=""
	rect_animation="default"
	>
</SpriteComponent>
<SpriteComponent
    _tags="character"
	alpha="1"
	image_file="data/enemies_gfx/sniper_hell_overlay.xml"
	emissive="1"
    additive="1"
	rect_animation="walk" >
</SpriteComponent>
```

`sniper` - laser
```xml
<Base file="data/entities/base_enemy_basic.xml" >
	<SpriteComponent
		image_file="data/enemies_gfx/sniper.xml"
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
<SpriteComponent
	_tags="laser_sight"
	_enabled="1"
	alpha="1"
	image_file="data/particles/laser_red.png"
	offset_x="5"
	offset_y="1"
	emissive="1"
	additive="1"
	visible="0"
	update_transform="0"
	next_rect_animation=""
	rect_animation="default"
	>
</SpriteComponent>
```

- 3 sprite components for turret_right - turret, laser, emissive
- 3 sprite components for lukki - main, emissive, wiggle
- 3 sprite components for missilecrab - main, laser, emissive
- 3 sprite components for tank - main, emissive, gun
- 3 sprite components for tank_super - main emissive gun
- 3 sprite components for wraith_storm - main, fog of war, circle
- 4 sprite components for tank_rocket - main, rocket, emissive, laser
- 6 sprite components for boss_limbs - body, eye1, eye2 (upper case file name), skull, health bar
- 5 sprite components for boss_ghost - body eye pupil, health bar
- 6 sprite components for boss_wizard - body head helmet hand, health bar



Many parts - Wormlike
- 13 sprite components for boss_dragon - head body tail, health bar
- 5 sprite components for eel - head body body body tail
- 8 sprite components for fish_giga - eye, body, tentacles, health bar
- 9 sprite components for meatmaggot - head, body x 7, tail
- 6 sprite components for worm - head body tail
- 9 sprite components for worm_big - head body tail, health bar
- 15 sprite components for worm_end - head, body x 13, tail
- 15 sprite components for worm_skull - head body tail
- 7 sprite components for worm_tiny - head body tail
- 24 sprite components for maggot_tiny - head body tail, health bar, emissive head, emissive body, emissive tail


## Single behaviors

`boss_sky` 
- _remove_from_base="1"
- Sprite of actual image file

### `monk` - monk arm?
```xml
<Base file="data/entities/base_enemy_basic.xml" >
    <SpriteComponent
    	image_file="data/enemies_gfx/monk.xml"
    	offset_x="0"
    	offset_y="0">
    </SpriteComponent>
</Base>
<Entity>
    <Base file="data/entities/misc/monk_arm.xml">
        <SpriteComponent
                has_special_scale="1"
                special_scale_x="-1" >
        </SpriteComponent>
        <VariableStorageComponent
                value_bool="0">
        </VariableStorageComponent>
    </Base>
    <Entity tags="arm_fx">
        <Base file="data/entities/misc/monk_arm_fx.xml" />
    </Entity>
    <Entity tags="arm_fx">
        <Base file="data/entities/misc/monk_arm_fx.xml" />
    </Entity>
    <Entity tags="arm_fx">
        <Base file="data/entities/misc/monk_arm_fx.xml" />
    </Entity>
</Entity>
```

`data/entities/misc/monk_arm.xml`
```xml
<SpriteComponent 
        image_file="data/enemies_gfx/monk_hand.xml" 
        rect_animation="open" 
        z_index="-1">
</SpriteComponent>
```

### `turret_left` - inherited from <Base file="data/entities/animals/turret_right.xml" >

### `statue_physics`
- emissive 
- base set to empty
```xml
<PhysicsImageShapeComponent
	image_file="data/enemies_gfx/statue_physics.png"
	centered="0"
	material="rock_box2d_nohit"
	offset_x="6"
	offset_y="10"
	>
</PhysicsImageShapeComponent>
```

### `playerghost` - sprite defined in <Base file="data/entities/base_apparition.xml">

### `minipit` - base set to alpha 0, sprite defined

No Sprite component for wand_ghost - no sprite, defined somewhere else


### `mimic_potion`
```xml
<Base file="data/entities/items/pickup/potion.xml">
  	<SpriteComponent
  		_enabled="0"
	    _tags="enabled_in_hand"
  		z_index="1.05"
  	></SpriteComponent>
</Base>
<Base file="data/entities/base_enemy_flying.xml" >
	<SpriteComponent
		_remove_from_base="1"
		_tags="enabled_in_world"
		image_file=""
		offset_x="0"
		offset_y="0"
	></SpriteComponent>
</Base>
<!-- this is an empty file -->
<SpriteComponent
	_tags="enabled_in_world"
	_enabled="1"
	offset_x="4"
	offset_y="4"
	image_file="data/enemies_gfx/mimic_potion.xml"
></SpriteComponent>
```

### `boss_meat` - limbs are not mentioned here

## Gate Monsters - Physics Objects

Issue: No sprite

### Affected enemies
`gate_monster_a` has empty sprite component?
```xml
<PhysicsImageShapeComponent
	image_file="data/entities/animals/boss_gate/gate_monster_a.png"
	centered="0"
	material="rock_box2d_nohit_hard"
	offset_x="28"
	offset_y="35"
	>
</PhysicsImageShapeComponent>
<Base file="data/entities/base_enemy_flying.xml" >
	<SpriteComponent
		image_file=""
		offset_x="0"
		offset_y="0">
	</SpriteComponent>
</Base>
```

`gate_monster_b`, `gate_monster_c`, `gate_monster_d`
```xml
<Base file="data/entities/animals/boss_gate/gate_monster_a.xml" >
	<PhysicsImageShapeComponent
		image_file="data/entities/animals/boss_gate/gate_monster_b.png"
		offset_x="18"
		offset_y="35"
		>
	</PhysicsImageShapeComponent>
</Base>
```

### Solution

- Read `PhysicsIamgeShapeComponent`
- Traverse through base files and get sprites



SPECIAL
No Sprite component for player



--------------------------------------------------------------------
Regular Sprite type (1 png file)
+ emissive

Ignore health bar tags (ui elements): _tags="health_bar_back,ui,invincible" _tags="health_bar,ui,invincible"


--------------------------------------------------------------------
