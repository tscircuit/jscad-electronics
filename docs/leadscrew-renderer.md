# Lead screw renderer

`LeadScrew`, `createLeadScrewMesh`, and `createLeadScrewGeom` render the
generic modelprinter `leadscrew` contract. The component and factories are
discovered from `lib/models/leadscrew/register.tsx` and exported through
React and vanilla entrypoints. Footprinter routing is synchronous and has
no PCB pads. Cosmos examples use full model strings through `Footprinter3d`.

The implementation consumes modelprinter's schema and dimension helper:
TR8x2 is one start with 2 mm pitch and lead; TR8x8(P2) is four starts with
2 mm pitch and 8 mm lead. The 30 degree trapezoidal profile follows nominal
ISO 2901:2016 design formulas. TR8/P2 is a de-facto size, not a claim of an
ISO 2902 diameter/pitch combination or ISO 2903 tolerance class.

The axis is Z, end planes Z = 0 and Z = length. A crest lies at +X on Z = 0.
Right-hand crest rotation proceeds +X toward +Y as Z increases, reversed
for left-hand. Phase z/pitch minus starts*theta/(2*pi) represents all starts;
each individual start rises by the lead over one revolution. Both 45 degree
end chamfers remain inside the stated length. Surface triangles sample flat
crests, flat roots and straight nominal flanks; root rounding, end runout
and bearing journals are omitted. This is real multi-start helical geometry.

`LeadScrewMeshOptions` controls tessellation only: radialSegments defaults
96, a multiple of 16 in [32,192]; segmentsPerPitch defaults 16, an integer
in [8,64]. Allocation is bounded to 12,000 axial steps and 1,200,000 sampled
vertices; excessive length/pitch and vanishing chamfer end radius throw
before allocation. Lower-resolution visual baselines use 48/12.

Snapshots (both labeled with their complete strings):

- `leadscrew_profile(iso2901)_tr8x8(p2)_l100mm`:
  `tests/snapshots/__snapshots__/leadscrew.snap.png`.
- `leadscrew_tr8x2_l100mm_hand(left)`:
  `tests/snapshots/__snapshots__/leadscrew-single-start.snap.png`.

Local development uses a privately built modelprinter contract package until
the root-owned shared preview bridge is published; no per-model dependency
or lockfile change belongs to this renderer.
