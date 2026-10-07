# NEMA motor mounting bracket

`NemaMotorMount`, `createNemaMotorMountMesh` and `createNemaMotorMountGeom` render
the `nemamotormount` contract from @tscircuit/modelprinter. The schema, common
motor interfaces, units, defaults and validation remain in that package. This
paired change is validated with a private build of the companion modelprinter
contract; a shared dependency bridge supplies the published union preview.

```text
nemamotormount_nema17_w50mm_h60mm_depth40mm_t3mm_axisheight30mm_shaft23mm_motorhole3.5mm_basehole5.5mm_basexspan30mm_baseoffset20mm
nemamotormount_nema23_w70mm_h80mm_depth50mm_t4mm_axisheight40mm_shaft39.1mm_motorhole5.5mm_basehole5.5mm_basexspan45mm_baseoffset25mm
```

These use the common 31/47.14 mm square fixing patterns and clear 22/38.1 mm
projecting pilots. NEMA17 defaults are W50 x H60, base depth40, thickness3,
axis height30, opening23, motor holes3.5 and two base holes5.5 at X=±15/Z=-20.
NEMA23 defaults are W70 x H80, base depth50, thickness4, axis height40,
opening39.1, motor holes5.5 and base holes5.5 at X=±22.5/Z=-25. All dimensions
are mm. This is a custom rigid sharp-corner L bracket; those bracket dimensions
and base drillings are not NEMA standards or a load rating.

The motor mounting face and shaft axis share origin (0,0,0) with the existing
NEMA motor. +X is right, +Y up and +Z follows the shaft. Upright material occupies
X=±width/2, Y=-axisHeight..height-axisHeight, Z=0..thickness. The base occupies
the same X interval, Y=-axisHeight..-axisHeight+thickness and
Z=-baseDepth..thickness. Its negative-Z extension lies under the motor, with
the motor envelope above the base. The floor mounting face is Y=-axisHeight.
Four mounting bores run along Z through the upright at the contract's square
pattern. A larger central through-bore clears both shaft and pilot, with no
blind cap. Two base bores run along Y through the foot. The solid corner joins
the legs without overlapping/internal seam caps.

Circular cuts have 128 circumscribed sides, guaranteeing at least the nominal
circular clearance. The small radial tessellation excess must fit inside the
remaining hole/edge ligaments. A clear resolution error rejects thinner
ligaments or thickness below numerical precision rather than returning a mesh
with intersecting openings. Tests check the raw welded mesh, positive volume,
bounds, all hole axes, peripheral pilot clearance, physical motor/base spacing,
dimension overrides, invalid contracts and resolution guards.

`Footprinter3d` and the vanilla normal/with-pads helpers dispatch through the
folder's typed registration. These are mechanical parts and have no PCB pads.
`examples/nemamotormount.example.tsx` supplies NEMA17 and NEMA23 direct Cosmos
fixtures with full strings, exercising the same generated registry in the
browser. Each frame has its own checked-in four-view PNG; snapshots apply a
display rotation to show the physical +Y-up bracket in the fixture's +Z-up
camera convention. The factory's placement datum remains unchanged.

Motor-interface references are the existing modelprinter NEMA table and its
[NEMA17 ST4118](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf)
and [NEMA23 ST5918](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf)
drawings. A frame designation alone does not determine every motor detail;
check the actual motor drawing before selecting the common pattern.
