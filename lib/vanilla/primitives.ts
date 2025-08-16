export const Cuboid = Symbol("Cuboid")
export const Cube = Symbol("Cube")
export const Cylinder = Symbol("Cylinder")
export const Sphere = Symbol("Sphere")
export const RoundedCuboid = Symbol("RoundedCuboid")

export const Translate = Symbol("Translate")
export const Rotate = Symbol("Rotate")

export const Union = Symbol("Union")
export const Subtract = Symbol("Subtract")
export const Hull = Symbol("Hull")

export const Colorize = Symbol("Colorize")

export const Polygon = Symbol("Polygon")
export const ExtrudeLinear = Symbol("ExtrudeLinear")

export type Color =
  | string
  | [number, number, number]
  | [number, number, number, number]
