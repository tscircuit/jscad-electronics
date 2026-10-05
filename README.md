# jscad-electronics

3D Electronic Component Models for JSCAD and tscircuit

[![npm version](https://badge.fury.io/js/jscad-electronics.svg)](https://badge.fury.io/js/jscad-electronics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Docs](https://docs.tscircuit.com) &middot; [Website](https://tscircuit.com) &middot; [Twitter](https://x.com/tscircuit) &middot; [discord](https://tscircuit.com/community/join-redirect) &middot; [Quickstart](https://docs.tscircuit.com/quickstart) &middot; [Online Playground](https://tscircuit.com/playground)

jscad-electronics is a library of 3D electronic component models for use with [JSCAD](https://github.com/jscad/OpenJSCAD.org) and [tscircuit](https://github.com/tscircuit/tscircuit). It provides accurate and customizable 3D models for various electronic components, making it easier to create 3D representations of PCBs and electronic assemblies.

Contribution Guide:

[![image](https://github.com/user-attachments/assets/92236fbf-8b59-4984-9b97-0f12f24de7c8)](https://youtu.be/DHGW_DFhJao)

## Features

- Wide range of electronic component models (e.g., resistors, capacitors, ICs, connectors)
- Customizable dimensions and parameters for each component
- Integration with tscircuit for advanced PCB design capabilities
- Easy-to-use React components for JSCAD integration

## Installation

Install jscad-electronics using npm:

```bash
npm install jscad-electronics
```

## Usage

Here's a basic example of how to use jscad-electronics with JSCAD:

```jsx
import { JsCadView } from "jscad-fiber"
import { SOT233P, ExtrudedPads } from "jscad-electronics"

export default () => {
  return (
    <JsCadView zAxisUp>
      <SOT233P />
      <ExtrudedPads footprint="sot23" />
    </JsCadView>
  )
}
```

This example creates a 3D model of an SOT-23-3P component with extruded pads.

## Available Components

### Cable meshes

`jscad-electronics/cables` creates indexed, colored triangle meshes for USB-C,
JST SH/PH, and NEMA 5-15P to IEC C13 cables. Pass a physical definition from
cableprinter and an already resolved path in millimeters (+Z up):

```ts
import { createCableMeshes } from "jscad-electronics/cables"
import { parseCableString } from "@tscircuit/cableprinter"

const meshes = createCableMeshes({
  definition: parseCableString("jst_ph_pins4"),
  path: resolvedPath,
})
```

The first and last path samples are cable exit centers. Connector poses follow
the endpoint tangents; bundle wires follow parallel-transported frames. Each
mesh provides `positions`, `indices`, `color`, `name`, and `smooth`. Connector
details include hollow shells/sockets, contacts, and strain reliefs. Physical
definitions, route generation and sagging remain separate from this renderer.
The cables entrypoint does not import React or a viewer.

Cable visual regression tests live in `tests/snapshots/cable-meshes.test.ts`.
They render local meshes with poppygl: all four cable types and mating faces,
JST SH/PH pin-count comparisons, and spatial paths viewed from both sides.
Annotations use `@tscircuit/alphabet`. Regenerate these six PNGs explicitly with
`BUN_UPDATE_SNAPSHOTS=1 bun test tests/snapshots/cable-meshes.test.ts`.

jscad-electronics includes models for various components, including:

- Resistors (0402, 0603, 0805)
- Capacitors
- ICs (DIP, SOIC, TSSOP, QFN, QFP, BGA)
- Diodes (SOD-123)
- Transistors (SOT-23, SOT-563, SOT-723)
- And more!

Check the `lib` directory for a full list of available components.

## Customization

Most components accept parameters for customization. For example:

```jsx
<QFN fullWidth={4} height={0.8} thermalPadSize={2} />
```

Refer to the individual component files for available customization options.

### Flexible screens

`FlexScreen` combines a parameterized display with an FPC cable. Screen size
can be supplied directly or derived from a diagonal and aspect ratio, and the
built-in mounting presets place the display above, below, or at a right angle
to the board plane.

```tsx
import { FlexScreen } from "jscad-electronics"

<FlexScreen
  diagonal={50}
  aspectRatio="16:9"
  orientation="foldedToFaceBelowBoard"
  flexCableLength={38}
  flexCableWidth={10}
  conductorCount={10}
  distanceBelowBoard={9}
  foldDistanceFromConnector={8}
  foldOutset={5}
/>
```

Use `sitsFlat` when the display and cable continue in the same direction.
`foldedToFaceAboveBoard` and `foldedToFaceBelowBoard` create true 180-degree
folds, while `foldedToRightAngleAboveBoard` and
`foldedToRightAngleBelowBoard` create 90-degree bends. The downward 180-degree
fold starts on top of the board and turns over its edge.

For 180-degree folds, `distanceAboveBoard` or `distanceBelowBoard` sets the
final screen backplane independently of `foldDistanceFromConnector` and
`foldOutset`, which control where the loop begins and how far it projects past
the board edge. Every orientation is also available as a boolean shortcut, for
example `<FlexScreen sitsFlat />` or `<FlexScreen foldsBelowBoard />`.

Until tscircuit has a dedicated CAD-model DSL, the same model can be selected
through a footprinter string. Each underscore-separated token sets one model
property:

```tsx
<component cadModel="flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm_foldstart9mm_outset6mm" />
```

Specify connector contacts with the usual pin-count and pitch syntax:

```tsx
<component cadModel="flexscreen30_w16_h10_flex5_p0.5mm_sitsflat" />
```

`flexscreen30` sets `conductorCount={30}` and `p0.5mm` sets
`conductorPitch={0.5}`. If the contact span plus edge margins exceeds
`flexCableWidth`, the connector end widens and tapers to the cable body.
The connector contacts keep their specified pitch, while the screen-end
contacts fit the narrower body. This also works with folded orientations
and direct `<FlexScreen conductorCount={30} conductorPitch={0.5} />` props.
Omitting pitch preserves the existing cable shape and automatic spacing.

`distance` is orientation-aware: it becomes `distanceAboveBoard` with
`foldsabove` and `distanceBelowBoard` with `foldsbelow`. Explicit
`distanceabove` and `distancebelow` tokens are also supported. Other useful
tokens include `diagonal`, `ratio16x9`, `flexwidth`, `foldsegments`,
`rightangleabove`, `rightanglebelow`, `sitsflat`, `conductors`, and
`hideconductors`. Unknown tokens throw an error so a typo cannot silently
produce the wrong model. Parsing and validation are provided by
[`@tscircuit/modelprinter`](https://github.com/tscircuit/modelprinter), keeping
the string grammar independent of this JSCAD renderer.

## Parameterized gears

`SpurGear` generates external involute gears with optional bores and hubs.
`WormGear` generates single or multiple start worm screws of either hand.
Both accept ModelPrinter strings through `Footprinter3d` and the vanilla renderer:

```tsx
<Footprinter3d footprint="spurgear24_m1mm_w5mm_bore5mm" />
<Footprinter3d footprint="wormgear_m1mm_d10mm_l20mm_starts2_left_bore3mm" />
```

See [the gear guide](docs/gears.md) for direct props, mesh factories, pitch
conventions, resolution controls, and geometry limits. Worm wheels require a
conjugate tooth profile and are outside this initial implementation.

## Integration with tscircuit

jscad-electronics is designed to work seamlessly with tscircuit. You can use these 3D models in your tscircuit projects to create accurate 3D representations of your PCB designs just by
using the `footprint` prop

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have any questions, please open an issue on the [GitHub repository](https://github.com/tscircuit/jscad-electronics/issues).
