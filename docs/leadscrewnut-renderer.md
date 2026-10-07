# Lead screw nut renderer

`LeadScrewNut`, `createLeadScrewNutMesh`, and `createLeadScrewNutGeom`
consume modelprinter's generic `leadscrewnut` schema and dimensions. Folder
registration exports the existing component/factory API through React and
vanilla, routes complete strings synchronously, and excludes PCB pads.

The nominal 30 degree ISO 2901:2016 profile has female minor/pitch/root
diameters 6/7/8.5 mm for de-facto TR8/P2. Male dimensions are 5.5/7/8 mm;
the nut preserves the nominal 0.25 mm crest/root clearance and adds the
contract's explicit default 0.05 mm radial layout allowance. It does not
copy the male surface or claim ISO 2902 size/ISO 2903 tolerance compliance.
TR8x8(P2) has four starts and 8 mm lead, while TR8x2 has one start and 2 mm
lead. Both use 2 mm pitch. Thread hand and phase match the mating screw.

A closed indexed annular mesh contains the helical female bore, 45 degree
bore mouths, cylindrical body, optional flange, and actual through-flange
mounting holes. Caps and the flange shoulder are triangulated with earcut;
no CSG subtraction or envelope-only threaded placeholder is used.
Sharp profile corners omit manufacturing root fillets and tolerance fitting.

The mounting face is Z = 0, flange shoulder Z = flangeThickness and body
top Z = length. Mounting bores are centered at +X, +Y, -X, -Y on the explicit
bolt circle and run only through the flange. Cylindrical style has no flange
or mounting holes. Body/flange/hole dimensions are custom envelope values,
not dimensions implied by a TR designation.

`LeadScrewNutMeshOptions`: radialSegments defaults 96, multiple of 16 in
[32,192]; segmentsPerPitch defaults 24, integer in [8,64]; holeSegments
defaults 32, multiple of 4 in [16,96]. A 12,000 axial-step/1,200,000 sampled
vertex limit rejects excessive inputs before allocation. Tests verify raw
manifold topology, open central and mounting bores, profile clearances,
handedness, datums, bounds, volumes and React/vanilla routing.

Snapshots use four labeled views and complete strings:

- `leadscrewnut_tr8x8(p2)_bodyod12mm_l15mm_flangeod22mm_flanget3mm_holes4_hole3.5mm_bcd16mm`:
  `tests/snapshots/__snapshots__/leadscrewnut.snap.png`.
- `leadscrewnut_tr8x2_style(cylindrical)_bodyod12mm_l15mm`:
  `tests/snapshots/__snapshots__/leadscrewnut-cylindrical.snap.png`.

Direct Cosmos fixtures call `Footprinter3d` with these exact strings.
Until a shared preview bridge exists, development uses the privately built
contract package; this model does not change the shared package or lockfile.
