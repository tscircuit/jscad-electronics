import jscad from "@jscad/modeling"
import type { Geom3 } from "@jscad/modeling/src/geometries/geom3"
import {
  getUflDimensions,
  type UflModelPropsInput,
} from "@tscircuit/modelprinter"

export type UflGeometry = { geom: Geom3; color: string }

/** Nominal unmated receptacle; board surface Z=0, coaxial mating axis +Z. */
export function createUflGeometries(
  input: UflModelPropsInput = {},
): UflGeometry[] {
  const d = getUflDimensions(input)
  const { booleans, primitives } = jscad
  const silver = "#bcbfc3"
  const dielectric = "#eee9d5"
  const gold = "#d9b45b"
  const plateThickness = 0.05
  const shellHeight = d.height - d.baseHeight
  const cylinder = (diameter: number, bottom: number, top: number) =>
    primitives.cylinder({
      radius: diameter / 2,
      height: top - bottom,
      center: [d.bodyCenterX, 0, (bottom + top) / 2],
      segments: 48,
    })
  const terminal = (size: [number, number, number], x: number, y: number) =>
    primitives.cuboid({ size, center: [x, y, d.terminalThickness / 2] })

  return [
    {
      geom: primitives.cuboid({
        size: [d.baseWidth, d.baseLength, d.baseHeight - plateThickness],
        center: [d.bodyCenterX, 0, (d.baseHeight - plateThickness) / 2],
      }),
      color: dielectric,
    },
    {
      geom: booleans.subtract(
        primitives.cuboid({
          size: [d.baseWidth, d.baseLength, plateThickness],
          center: [d.bodyCenterX, 0, d.baseHeight - plateThickness / 2],
        }),
        cylinder(d.shellInnerDiameter, 0, d.baseHeight + plateThickness),
      ),
      color: silver,
    },
    {
      geom: booleans.subtract(
        cylinder(
          d.shellOuterDiameter,
          d.baseHeight,
          d.baseHeight + shellHeight,
        ),
        cylinder(
          d.shellInnerDiameter,
          d.baseHeight - plateThickness,
          d.height + plateThickness,
        ),
      ),
      color: silver,
    },
    {
      geom: cylinder(d.shellInnerDiameter, d.baseHeight, d.dielectricHeight),
      color: dielectric,
    },
    {
      geom: cylinder(d.centerPinDiameter, d.baseHeight, d.centerPinHeight),
      color: gold,
    },
    {
      geom: terminal(
        [d.groundTerminalWidth, d.groundTerminalDepth, d.terminalThickness],
        d.groundTerminalX,
        d.groundTerminalY,
      ),
      color: silver,
    },
    {
      geom: terminal(
        [d.signalTerminalWidth, d.signalTerminalHeight, d.terminalThickness],
        d.signalTerminalX,
        0,
      ),
      color: gold,
    },
    {
      geom: terminal(
        [d.groundTerminalWidth, d.groundTerminalDepth, d.terminalThickness],
        d.groundTerminalX,
        -d.groundTerminalY,
      ),
      color: silver,
    },
    {
      // Retention tab opposite the signal contact; not a fourth PCB terminal.
      geom: terminal(
        [d.rearTabWidth, d.rearTabHeight, d.terminalThickness],
        d.rearTabX,
        0,
      ),
      color: silver,
    },
  ]
}
