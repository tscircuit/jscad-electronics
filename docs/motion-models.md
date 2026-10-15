# Fundamental motion and bearing models

These models describe configurable nominal assembly geometry in millimeters. They use generic industrial names rather than manufacturer part numbers. Count fields are unitless integers; dimensions accept millimeters and explicit common length units. All models accept the bare family name to use the defaults below, reject unknown or duplicate properties, and reject nonpositive dimensions and incompatible geometric relations.

## `pillowblockbearing`

Mounted radial bearing in a raised pillow housing. Shaft axis is Y; the mounting-foot bottom is Z=0. Open front race shows rolling elements. Clearance, cage and grease hardware are nominal; no load rating is implied.

```text
pillowblockbearing_bore20mm_bw80mm_bd30mm_bt8mm_hd46mm_ch30mm_ms60mm_mh6mm
```

| Property | Short token | Default |
|---|---|---|
| `boreDiameter` | `bore` | 20 mm |
| `baseWidth` | `bw` | 80 mm |
| `baseDepth` | `bd` | 30 mm |
| `baseThickness` | `bt` | 8 mm |
| `housingDiameter` | `hd` | 46 mm |
| `centerHeight` | `ch` | 30 mm |
| `mountSpacing` | `ms` | 60 mm |
| `mountHoleDiameter` | `mh` | 6 mm |

Visible features: shaft bore along Y, two mounting holes, exposed front balls and raised housing.

## `flangebearing`

Square four-bolt flange bearing with an axial Z shaft bore and open top rolling-element race. Flange bottom is Z=0. Nominal assembly envelope and race clearances; not a manufacturer part or load-rated design.

```text
flangebearing_bore20mm_fw64mm_ft6mm_hd44mm_hh20mm_ms46mm_mh6mm
```

| Property | Short token | Default |
|---|---|---|
| `boreDiameter` | `bore` | 20 mm |
| `flangeWidth` | `fw` | 64 mm |
| `flangeThickness` | `ft` | 6 mm |
| `housingDiameter` | `hd` | 44 mm |
| `housingHeight` | `hh` | 20 mm |
| `mountSpacing` | `ms` | 46 mm |
| `mountHoleDiameter` | `mh` | 6 mm |

Visible features: four mounting bores, hub shoulder, shaft bore and exposed balls.

## `needlebearing`

Open straight-needle radial bearing. Axis is Z and lower face is Z=0. Inner and outer races enclose separately visible axial needles. Roller sizes/clearances are nominal and do not define a bearing standard or rating.

```text
needlebearing_id20mm_od30mm_w20mm_race1.5mm_rollers18
```

| Property | Short token | Default |
|---|---|---|
| `innerDiameter` | `id` | 20 mm |
| `outerDiameter` | `od` | 30 mm |
| `width` | `w` | 20 mm |
| `raceThickness` | `race` | 1.5 mm |
| `rollerCount` | `rollers` | 18 |

Visible features: long axial needles, open races and through shaft bore.

## `cylindricalrollerbearing`

Open cylindrical-roller radial bearing with short axial rollers between inner and outer races and an outer retaining lip. Axis Z, bottom Z=0. Assembly envelope only; cage/preload and load rating are not specified.

```text
cylindricalrollerbearing_id20mm_od42mm_w16mm_race3mm_rollers12
```

| Property | Short token | Default |
|---|---|---|
| `innerDiameter` | `id` | 20 mm |
| `outerDiameter` | `od` | 42 mm |
| `width` | `w` | 16 mm |
| `raceThickness` | `race` | 3 mm |
| `rollerCount` | `rollers` | 12 |

Visible features: short cylindrical rollers, retaining lips and connected axial bore.

## `camfollower`

Stud-mounted cam follower with an exposed open roller race and hex drive socket. Stud is on Z, from Z=0 to studLength; wheel sits above it. Smooth stud represents the thread major-diameter envelope, not a screw thread.

```text
camfollower_od32mm_w14mm_stud10mm_sl26mm_socket5mm_rollers10
```

| Property | Short token | Default |
|---|---|---|
| `wheelDiameter` | `od` | 32 mm |
| `wheelWidth` | `w` | 14 mm |
| `studDiameter` | `stud` | 10 mm |
| `studLength` | `sl` | 26 mm |
| `socketDiameter` | `socket` | 5 mm |
| `rollerCount` | `rollers` | 10 |

Visible features: stud, hex socket, outer wheel and exposed rolling elements.

## `vgroovewheel`

Symmetric V-groove track wheel with straight axial bore. Z axis, bottom Z=0. Groove flanks run from 20%/80% of the width to the central root; this nominal track envelope does not specify a bearing or rail standard.

```text
vgroovewheel_od40mm_root28mm_bore8mm_w12mm
```

| Property | Short token | Default |
|---|---|---|
| `outerDiameter` | `od` | 40 mm |
| `rootDiameter` | `root` | 28 mm |
| `boreDiameter` | `bore` | 8 mm |
| `width` | `w` | 12 mm |

Visible features: deep continuous circumferential V groove and through bore.

## `rodend`

Rod-end eye with a curved spherical inner insert and smooth male-stem envelope pointing toward -Y. Eye axis Z, bottom Z=0. Thread major diameter only, no threads, articulation limit or load rating.

```text
rodend_hd28mm_bore12mm_w12mm_stem10mm_sl30mm
```

| Property | Short token | Default |
|---|---|---|
| `headDiameter` | `hd` | 28 mm |
| `boreDiameter` | `bore` | 12 mm |
| `headWidth` | `w` | 12 mm |
| `stemDiameter` | `stem` | 10 mm |
| `stemLength` | `sl` | 30 mm |

Visible features: eye with curved spherical insert, axial bore and extended stem.

## `sphericalbearing`

Spherical plain bearing assembly: cylindrical outer race with spherical pocket and truncated spherical inner ring with an axial bore. Axis Z, bottom Z=0. Outer race is recessed to 72% of inner-ring width to expose the spherical shoulders. Small nominal spherical clearance; articulation and tolerances are not modeled.

```text
sphericalbearing_od30mm_bore12mm_w14mm_ball22mm
```

| Property | Short token | Default |
|---|---|---|
| `outerDiameter` | `od` | 30 mm |
| `boreDiameter` | `bore` | 12 mm |
| `width` | `w` | 14 mm |
| `ballDiameter` | `ball` | 22 mm |

Visible features: spherical mating surfaces and curved inner bore ring.

## `clevis`

Fork clevis with parallel ears, shared cross-pin bore along X and rear mounting bore along Y. Rear plane Y=0, underside Z=0. Bores are smooth; pin/thread geometry and strength are not implied.

```text
clevis_w30mm_l45mm_h20mm_gap14mm_back10mm_pin8mm_mount10mm
```

| Property | Short token | Default |
|---|---|---|
| `width` | `w` | 30 mm |
| `length` | `l` | 45 mm |
| `height` | `h` | 20 mm |
| `gap` | `gap` | 14 mm |
| `backThickness` | `back` | 10 mm |
| `pinDiameter` | `pin` | 8 mm |
| `mountDiameter` | `mount` | 10 mm |

Visible features: open fork slot, aligned ear pin bores and rear mounting bore.

## `gearrack`

Straight rack envelope along X with trapezoidal teeth above a mounting bar and two vertical mounting holes. Base underside Z=0. Teeth are nominal placement geometry, not conjugate involute teeth or a machining standard.

```text
gearrack_pitch8mm_teeth12_w12mm_h8mm_th4mm_mh3.5mm
```

| Property | Short token | Default |
|---|---|---|
| `pitch` | `pitch` | 8 mm |
| `toothCount` | `teeth` | 12 |
| `width` | `w` | 12 mm |
| `baseHeight` | `h` | 8 mm |
| `toothHeight` | `th` | 4 mm |
| `mountHoleDiameter` | `mh` | 3.5 mm |

Visible features: repeated trapezoidal rack teeth and two mounting bores.

## `sprocket`

Chain-sprocket envelope with circular roller pockets between radial teeth, hub shoulder and through bore. Axis Z, bottom Z=0. Tooth/pocket outline is nominal, not a chain pitch standard, conjugate roller seating profile or cutting specification.

```text
sprocket_od60mm_root48mm_w8mm_bore12mm_teeth16_hub26mm_hh10mm
```

| Property | Short token | Default |
|---|---|---|
| `outerDiameter` | `od` | 60 mm |
| `rootDiameter` | `root` | 48 mm |
| `width` | `w` | 8 mm |
| `boreDiameter` | `bore` | 12 mm |
| `toothCount` | `teeth` | 16 |
| `hubDiameter` | `hub` | 26 mm |
| `hubHeight` | `hh` | 10 mm |

Visible features: radial teeth/valleys, hub shoulder and through bore.

## `rollerchain`

Straight roller-chain segment along X with alternating inner/outer side plates, discrete rollers and projecting rivet pins. Roller axes Z. Nominal pitch/width placement assembly; not a named chain standard or flexible/meshing simulation.

```text
rollerchain_pitch12.7mm_links6_roller7.9mm_w8mm_pin4mm_plate1.2mm
```

| Property | Short token | Default |
|---|---|---|
| `pitch` | `pitch` | 12.7 mm |
| `linkCount` | `links` | 6 |
| `rollerDiameter` | `roller` | 7.9 mm |
| `width` | `w` | 8 mm |
| `pinDiameter` | `pin` | 4 mm |
| `plateThickness` | `plate` | 1.2 mm |

Visible features: alternating side plates, free rollers and projecting pin heads.

## `vbeltsheave`

Multi-groove V-belt sheave with sloped circumferential groove flanks, small root land, hub and through bore. Axis Z, bottom Z=0. Nominal groove envelope; belt section standard, taper bushing and keyway are not specified.

```text
vbeltsheave_od60mm_bore12mm_w24mm_grooves2_depth8mm_gw9mm_hub26mm_hh8mm
```

| Property | Short token | Default |
|---|---|---|
| `outerDiameter` | `od` | 60 mm |
| `boreDiameter` | `bore` | 12 mm |
| `width` | `w` | 24 mm |
| `grooveCount` | `grooves` | 2 |
| `grooveDepth` | `depth` | 8 mm |
| `grooveWidth` | `gw` | 9 mm |
| `hubDiameter` | `hub` | 26 mm |
| `hubHeight` | `hh` | 8 mm |

Visible features: separate V grooves, root lands, hub shoulder and through bore.

## `conveyorroller`

Hollow conveyor tube with end plugs and a continuous axle projecting beyond each end. Axis Z, tube spans Z=0..length and axle starts at negative shaftExtension. End plugs are nominal; internal bearings and shaft flats are not specified.

```text
conveyorroller_od50mm_l150mm_wall3mm_shaft10mm_ext15mm_end4mm
```

| Property | Short token | Default |
|---|---|---|
| `outerDiameter` | `od` | 50 mm |
| `length` | `l` | 150 mm |
| `wallThickness` | `wall` | 3 mm |
| `shaftDiameter` | `shaft` | 10 mm |
| `shaftExtension` | `ext` | 15 mm |
| `endThickness` | `end` | 4 mm |

Visible features: hollow tube midsection, end plugs and two projecting shaft ends.

## `shaftsupport`

Split shaft support with a horizontal Y shaft bore, top clamping slit, transverse X clamp-screw bore and two vertical foot mounting bores. Bottom Z=0. No thread, clamp hardware or load rating is specified.

```text
shaftsupport_bore16mm_bw55mm_bd32mm_bt7mm_hw26mm_hd20mm_hh34mm_ch26mm_ms40mm_mh5mm_slit1.5mm_clamp4mm
```

| Property | Short token | Default |
|---|---|---|
| `boreDiameter` | `bore` | 16 mm |
| `baseWidth` | `bw` | 55 mm |
| `baseDepth` | `bd` | 32 mm |
| `baseThickness` | `bt` | 7 mm |
| `headWidth` | `hw` | 26 mm |
| `headDepth` | `hd` | 20 mm |
| `headHeight` | `hh` | 34 mm |
| `centerHeight` | `ch` | 26 mm |
| `mountSpacing` | `ms` | 40 mm |
| `mountHoleDiameter` | `mh` | 5 mm |
| `slitWidth` | `slit` | 1.5 mm |
| `clampHoleDiameter` | `clamp` | 4 mm |

Visible features: shaft bore, connected top slit, clamp screw bore and mounting foot bores.

Each family exports a typed React component and `create<Name>Geom` / `create<Name>Mesh` factories. Model-string routing uses the paired modelprinter schema. The mesh is triangulated with finite indexed vertices. Standard ISOMETRIC, TOP, FRONT and SIDE PNG snapshots cover the complete default assembly.

Geometry regressions inspect real bores, mounting holes, rollers, slots and hollow interiors, together with dimensions and positive volume. Default indexed meshes and representative variants are checked for closed boundaries with opposite triangle winding on every shared edge.
