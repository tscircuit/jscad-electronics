# Round spacer renderer

`spacer_id3.2mm_od6mm_l10mm_round_chamfer0.3mm` renders a round unthreaded spacer
with a continuous open bore and four 45-degree rim chamfers. Dimensions,
defaults, token validation and unit normalization come from modelprinter.
The lower mounting face is Z=0; overall length ends at Z=10 for this example.

`Spacer`, `createSpacerMesh`, `createSpacerGeom`, `SpacerProps` and `SpacerMesh`
are exported from the main and vanilla entrypoints. Direct props accept numbers
in millimeters or supported unit-bearing lengths. The renderer uses the existing
annular sleeve mesh construction and maps only the normalized spacer contract;
no dimensions or defaults are repeated here. Indexed vertices form one closed
outward surface with annular end faces, preserving the through opening.

The model renderer registers with `pads: "none"`; routing validates the string
and generates no implicit copper pads. Explicit circuit JSON retains its own
pad/hole behavior. The example preview and four-view snapshot cover the proposed
model string; geometry tests check the envelope, rim setbacks, open bore,
manifold topology, winding and independently calculated volume.
