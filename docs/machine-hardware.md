# Machine hardware model catalog

These twenty parametric families describe fundamental machine-building forms. All normalized dimensions are millimeters. Unit strings (`mm`, `cm`, `m`, `in`, `mil`, `ft`) are accepted for length fields; integer counts are unitless. Bare family names select defaults. Models reject unknown and duplicate tokens and invalid dimensional relationships.

These are nominal visual models for assembly layouts. They do not claim McMaster-Carr part compatibility, manufacturing dimensions, certified load ratings, mating fits or a dimensional standard. Threads are smooth envelopes; latch/clamp/caster internal mechanisms and the detent-pin spring are omitted. Expanded metal is the flat-plan aperture pattern; blades have a swept plan and nominal constant thickness. Square key has clipped plan corners rather than a full 3D edge break.

| Model | Fundamental form | Full example |
| --- | --- | --- |
| `hinge` | Flat open butt hinge, leaves in XY, hinge axis along Y; bottom Z=0. | `hinge_width60mm_length60mm_leafthickness3mm_barreldiameter10mm_pindiameter4mm_holediameter5mm` |
| `barrelhinge` | Vertical barrel hinge, axis Z, opposed mounting tabs, bottom Z=0. | `barrelhinge_height60mm_barreldiameter14mm_pindiameter6mm_leafwidth20mm_leafthickness4mm_holediameter5mm` |
| `drawlatch` | Nominal closed draw latch with base, handle, wire bail and keeper; long axis X. | `drawlatch_length100mm_width25mm_basethickness4mm_handleheight18mm_wirediameter4mm_holediameter4mm` |
| `toggleclamp` | Nominal closed hold-down toggle clamp, long axis X, handle upright, bottom Z=0. | `toggleclamp_length110mm_width35mm_basethickness5mm_handleheight55mm_armlength75mm_paddiameter14mm_holediameter5mm` |
| `levelingfoot` | Leveling foot with puck, nominal smooth threaded-stem envelope and hex lock nut, axis Z. | `levelingfoot_basediameter50mm_baseheight12mm_stemdiameter12mm_stemlength55mm_hexdiameter24mm_hexheight8mm` |
| `caster` | Nominal fixed caster assembly: rolling axis Y, plate in XY, wheel contact Z=0. | `caster_wheeldiameter75mm_wheelwidth24mm_axlediameter10mm_forkthickness5mm_platewidth50mm_platelength65mm_platethickness5mm_overallheight110mm_holediameter5mm` |
| `rubberbumper` | Cylindrical bumper with axial through bore and top counterbore, axis Z. | `rubberbumper_diameter30mm_height15mm_holediameter6mm_counterborediameter13mm_counterboredepth5mm` |
| `bridgehandle` | Bridge handle along X with two mounting feet and axial mounting holes; bottom Z=0. | `bridgehandle_length120mm_gripdiameter15mm_height40mm_mountingdiameter24mm_mountingheight5mm_holediameter5mm` |
| `handwheel` | Flat-rim spoked handwheel with axial bore, rotating axis Z. | `handwheel_outerdiameter100mm_rimwidth12mm_hubdiameter28mm_hubheight25mm_borediameter12mm_spokes4` |
| `starknob` | Lobed star knob with bottom hub and axial through bore, axis Z. | `starknob_diameter40mm_height16mm_borediameter6mm_lobes5_hubdiameter18mm_hubheight10mm` |
| `leverhandle` | Lever handle extending along +X from bored hub; bottom Z=0. | `leverhandle_length90mm_width18mm_height16mm_hubdiameter28mm_hubheight25mm_borediameter8mm` |
| `squarekey` | Parallel shaft key, length X, width Y, height Z; clipped plan corners, bottom Z=0. | `squarekey_width8mm_height8mm_length40mm_chamfer1mm` |
| `woodruffkey` | Circular segment key in XZ, thickness along Y, flat top at Z=height, bottom Z=0. | `woodruffkey_diameter30mm_thickness6mm_height12mm` |
| `ibeam` | I-section stock, centered XY cross section, length +Z from Z=0. | `ibeam_width40mm_height60mm_webthickness4mm_flangethickness6mm_length100mm` |
| `teebar` | T-section stock, centered XY envelope, flange at maximum Y, length +Z. | `teebar_width40mm_height40mm_webthickness4mm_flangethickness6mm_length100mm` |
| `roundbar` | Round stock along +Z with equal end chamfers; bottom Z=0. | `roundbar_diameter20mm_length100mm_chamfer1mm` |
| `splitringhanger` | Nominal two-piece pipe hanger: pipe axis Y, horizontal split, lug bolt holes and top mounting boss. | `splitringhanger_pipediameter32mm_bandthickness3mm_bandwidth15mm_gap2mm_lugwidth14mm_holediameter5mm` |
| `detentpin` | Nominal ball detent pin, shaft Z, transverse pull ring in XZ; mechanism internals omitted. | `detentpin_shaftdiameter8mm_shaftlength50mm_headdiameter18mm_headheight6mm_balldiameter3mm_balloffset4mm_ringdiameter24mm_ringwire2mm` |
| `expandedmetal` | Flat expanded-metal visual sheet with staggered diamond apertures and perimeter frame; XY, bottom Z=0. | `expandedmetal_width100mm_length100mm_thickness2mm_diamondwidth15mm_diamondlength30mm_strandwidth2mm_framewidth3mm` |
| `coolingfan` | Nominal axial cooling fan with square shroud, four mount holes, curved-plan blades and support spokes; airflow axis Z. | `coolingfan_size80mm_thickness25mm_hubdiameter28mm_bladecount7_bladewidth12mm_bladethickness3mm_mountingholediameter4mm_framethickness6mm` |
