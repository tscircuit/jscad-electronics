# USB-C midmount receptacle

A USB2 Type-C receptacle with an open capsule-section shell, insulating tongue,
eight mating contacts per face, twelve footprint-driven solder tails, four slot
retention tabs and locating pegs. Physical envelope defaults (8.94 mm wide,
3.2 mm shell height) and details were checked against the public modelcdn
references [C2765186](https://modelcdn.tscircuit.com/easyeda_models/assets/C2765186.obj)
and [C165948](https://modelcdn.tscircuit.com/easyeda_models/assets/C165948.obj).

The footprint supplies the board plane, tail row, slot locations and body front.
The shell is open; the insulating rear block closes its back. It uses only
primitives supported by both React and vanilla renderers. It does not reuse the
legacy `USB_C` component's unsupported Ellipsoid/primitive rotation behavior.

Each fixture has one six-view composite: iso/top/underside, rear/side/mouth.
Dimensions vary among commercial receptacles; the model is nominal rather than
an exact representation of every USB-C vendor's internal stamping.
