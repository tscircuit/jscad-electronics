import { Cuboid } from "jscad-fiber"

import {
  resolveA0402Colors,
  type A0402ColorOverrides,
  type A0402ColorProp,
} from "./a0402-colors"

const fullLength = 1.0
const width = 0.5
const height = 0.5
const terminatorWidth = 0.2

const bodyLength = fullLength - terminatorWidth * 2

export interface A0402Props {
  /**
   * Backwards-compatible color prop. When provided as a string it controls the
   * body color, and when provided as an object it can override individual
   * surfaces.
   */
  color?: A0402ColorProp
  /**
   * Explicit color overrides for the component.
   */
  colors?: A0402ColorOverrides
}

export const A0402 = ({ color, colors }: A0402Props = {}) => {
  const { bodyColor, leftTerminalColor, rightTerminalColor } =
    resolveA0402Colors(color, colors)

  return (
    <>
      <Cuboid
        size={[bodyLength, width, height]}
        offset={[0, 0, height / 2]}
        color={bodyColor}
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[fullLength / 2 - terminatorWidth / 2, 0, height / 2]}
        color={rightTerminalColor}
      />
      <Cuboid
        size={[terminatorWidth, height, width]}
        offset={[-fullLength / 2 + terminatorWidth / 2, 0, height / 2]}
        color={leftTerminalColor}
      />
    </>
  )
}

export type { A0402ColorOverrides, A0402ColorProp } from "./a0402-colors"
