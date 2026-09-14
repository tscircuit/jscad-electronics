# SMD slide switch

Adds `SmdSlideSwitch` and the `smdslideswitch` footprint route. The model has a
folded metal cover, an insulating base, a side actuator, three signal terminals,
four mounting tabs and optional locating pegs. `position={0|1}` selects the two
actuator positions for direct component use.

Envelope checks use public modelcdn references
[MINI MSK12C02 C2681570](https://modelcdn.tscircuit.com/easyeda_models/assets/C2681570.obj)
and [MSK12C02 C431540](https://modelcdn.tscircuit.com/easyeda_models/assets/C431540.obj).
The small package has a 1.4 mm cover height; the wider package 1.5 mm. Both have
an approximately 2.7 mm cover depth. Pad span selects the nominal cover width;
lead and peg locations come from the footprint. The larger fixture preserves the
missing signal position rather than adding a spurious fourth terminal.

The three fixtures each have one six-view image: isometric, top, underside,
terminal side, end, actuator side. Geometry tests distinguish leads from mounting
tabs, check cover height, actuator projection and the no-holes variant.
