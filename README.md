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

## Integration with tscircuit

jscad-electronics is designed to work seamlessly with tscircuit. You can use these 3D models in your tscircuit projects to create accurate 3D representations of your PCB designs just by
using the `footprint` prop

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have any questions, please open an issue on the [GitHub repository](https://github.com/tscircuit/jscad-electronics/issues).
