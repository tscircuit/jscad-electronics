# Industrial fastener families

These models describe nominal visual assembly envelopes, not manufacturing standards or load ratings. Threaded bolt/nut/insert surfaces are smooth cylinders; no helical thread geometry, fit class, or ISO compliance is claimed. Dimensions use millimeters; explicit mm, cm, m, in, inch, mil, ft, and feet tokens are accepted.

All dimensions must be finite, positive, and within 0.0001–10000 mm. Every feature dimension must also be at least 0.0001 times the largest dimension to avoid unstable, near-degenerate geometry. Minimum material and clearance gaps also use that relative bound. Model-specific fit checks reject bores larger than bodies, intersecting features, invalid taper direction, and insufficient material. Unknown/duplicate tokens and inline first-token values are rejected. Long property names and the short aliases below are equivalent.

Unless specified otherwise, a model is centered around the Z axis with its lower end at Z=0. U bolts lie in the XZ plane with wire thickness along Y, and eye bolts have their eye in XZ. Hairpin cotters lie in XY with their wire above Z=0.

| Family | Geometry | Aliases and defaults (mm) |
| --- | --- | --- |
| `flatwasher` | Flat annulus with an open through bore. | `id` / `innerDiameter` = 6.4, `od` / `outerDiameter` = 12, `t` / `thickness` = 1.6 |
| `toothedwasher` | External 12-tooth washer with relief between teeth; flat uninstalled envelope. | `id` / `innerDiameter` = 6.4, `od` / `outerDiameter` = 13, `t` / `thickness` = 0.8, `td` / `toothDepth` = 1.5 |
| `wavewasher` | Three-wave annular spring washer; waveHeight is peak-to-trough rise in addition to thickness. | `id` / `innerDiameter` = 10, `od` / `outerDiameter` = 16, `t` / `thickness` = 0.6, `wh` / `waveHeight` = 1.5 |
| `bellevillewasher` | Conical annulus; coneHeight is inner-edge rise above the outer edge, in addition to axial thickness. | `id` / `innerDiameter` = 6.4, `od` / `outerDiameter` = 14, `t` / `thickness` = 0.8, `ch` / `coneHeight` = 1.5 |
| `shoulderbolt` | Reduced thread envelope, larger precision shoulder, and cylindrical head with recessed hex socket. | `sd` / `shoulderDiameter` = 8, `sl` / `shoulderLength` = 20, `td` / `threadDiameter` = 6, `tl` / `threadLength` = 10, `hd` / `headDiameter` = 13, `hh` / `headHeight` = 5 |
| `ubolt` | Round-wire U bend with two parallel legs; legSpacing is center-to-center and legLength is the straight portion. | `d` / `rodDiameter` = 6, `s` / `legSpacing` = 30, `l` / `legLength` = 35 |
| `eyebolt` | Smooth shank and closed round-wire eye in the XZ plane; eyeInnerDiameter is the clear eye diameter. | `d` / `shaftDiameter` = 6, `l` / `shaftLength` = 24, `id` / `eyeInnerDiameter` = 14, `wd` / `eyeWireDiameter` = 5 |
| `carriagebolt` | Round shank, square antirotation neck, and spherical-cap head. | `d` / `shaftDiameter` = 6, `l` / `shaftLength` = 25, `nw` / `neckWidth` = 6.5, `nh` / `neckHeight` = 3, `hd` / `headDiameter` = 14, `hh` / `headHeight` = 4 |
| `wingnut` | Hexagonal nut body with two swept-profile wings and an open cylindrical thread envelope. | `id` / `boreDiameter` = 6, `af` / `acrossFlats` = 10, `h` / `bodyHeight` = 5, `s` / `wingSpan` = 28, `wh` / `wingHeight` = 10, `wt` / `wingThickness` = 3 |
| `capnut` | Hexagonal base and ellipsoidal closed dome; blind bore terminates wallThickness below the base-to-dome plane. | `id` / `boreDiameter` = 6, `af` / `acrossFlats` = 10, `h` / `bodyHeight` = 5, `ch` / `capHeight` = 5, `wt` / `wallThickness` = 1 |
| `couplingnut` | Elongated hexagonal body with an open cylindrical thread envelope. | `id` / `boreDiameter` = 6, `af` / `acrossFlats` = 10, `h` / `height` = 18 |
| `tslotnut` | Rectangular wider base, narrower raised neck, and central open thread envelope. | `id` / `boreDiameter` = 6, `w` / `baseWidth` = 16, `l` / `length` = 20, `bh` / `baseHeight` = 4, `nw` / `neckWidth` = 10, `nh` / `neckHeight` = 4 |
| `rivetnut` | Flanged tubular insert with 24 shallow axial grip grooves and open thread envelope; uninstalled state. | `id` / `boreDiameter` = 6, `d` / `bodyDiameter` = 9, `l` / `bodyLength` = 14, `fd` / `flangeDiameter` = 12, `ft` / `flangeThickness` = 1.5 |
| `solidrivet` | Solid shank and spherical-cap factory head; uninstalled state. | `d` / `shaftDiameter` = 4, `l` / `shaftLength` = 12, `hd` / `headDiameter` = 8, `hh` / `headHeight` = 2.5 |
| `blindrivet` | Tubular flanged body, protruding mandrel, and mandrel upset head; uninstalled state. | `d` / `bodyDiameter` = 4, `l` / `bodyLength` = 10, `fd` / `flangeDiameter` = 8, `ft` / `flangeThickness` = 1.2, `md` / `mandrelDiameter` = 2, `ml` / `mandrelLength` = 20 |
| `clevispin` | Headed pin with a real transverse through hole; holeOffset is measured from the unheaded end. | `d` / `shaftDiameter` = 6, `l` / `shaftLength` = 25, `hd` / `headDiameter` = 10, `hh` / `headHeight` = 2, `hol` / `holeDiameter` = 2, `ho` / `holeOffset` = 3 |
| `springpin` | Slotted hollow cylindrical pin; gapWidth is the chord width of the straight radial slot. | `od` / `outerDiameter` = 6, `l` / `length` = 20, `wt` / `wallThickness` = 1, `g` / `gapWidth` = 1 |
| `taperpin` | Smooth conical pin between independently specified smallDiameter and largeDiameter. | `ld` / `largeDiameter` = 6, `sd` / `smallDiameter` = 5, `l` / `length` = 30 |
| `retainingring` | External C ring with two eyelet lugs and open plier holes; ring opening points toward +X. | `id` / `innerDiameter` = 16, `od` / `outerDiameter` = 20, `t` / `thickness` = 1.2, `g` / `gapWidth` = 5, `ld` / `lugDiameter` = 4, `hol` / `holeDiameter` = 1.5 |
| `hairpincotter` | One continuous round wire with a return loop, straight leg, and three waved retention bends in the XY plane. | `d` / `wireDiameter` = 2, `l` / `length` = 40, `ld` / `loopDiameter` = 10 |

## Examples

`flatwasher_id6.4mm_od12mm_t1.6mm`
`toothedwasher_id6.4mm_od13mm_t0.8mm_td1.5mm`
`wavewasher_id10mm_od16mm_t0.6mm_wh1.5mm`
`bellevillewasher_id6.4mm_od14mm_t0.8mm_ch1.5mm`
`shoulderbolt_sd8mm_sl20mm_td6mm_tl10mm_hd13mm_hh5mm`
`ubolt_d6mm_s30mm_l35mm`
`eyebolt_d6mm_l24mm_id14mm_wd5mm`
`carriagebolt_d6mm_l25mm_nw6.5mm_nh3mm_hd14mm_hh4mm`
`wingnut_id6mm_af10mm_h5mm_s28mm_wh10mm_wt3mm`
`capnut_id6mm_af10mm_h5mm_ch5mm_wt1mm`
`couplingnut_id6mm_af10mm_h18mm`
`tslotnut_id6mm_w16mm_l20mm_bh4mm_nw10mm_nh4mm`
`rivetnut_id6mm_d9mm_l14mm_fd12mm_ft1.5mm`
`solidrivet_d4mm_l12mm_hd8mm_hh2.5mm`
`blindrivet_d4mm_l10mm_fd8mm_ft1.2mm_md2mm_ml20mm`
`clevispin_d6mm_l25mm_hd10mm_hh2mm_hol2mm_ho3mm`
`springpin_od6mm_l20mm_wt1mm_g1mm`
`taperpin_ld6mm_sd5mm_l30mm`
`retainingring_id16mm_od20mm_t1.2mm_g5mm_ld4mm_hol1.5mm`
`hairpincotter_d2mm_l40mm_ld10mm`

Each renderer exports a public component, `create<Name>Geom`, and `create<Name>Mesh`. Every family has a runnable example and a checked-in standard ISOMETRIC/TOP/FRONT/SIDE PNG labeled with its full dimensional model string. Contract validation lives in modelprinter; renderers consume those schemas.
