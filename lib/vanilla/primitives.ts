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

export const RoundedCylinder = Symbol("RoundedCylinder")

export type Color =
  | string
  | [number, number, number]
  | [number, number, number, number]

export const Custom = Symbol("Custom")

// The vanilla build aliases jscad-fiber/model to this module as well as its
// components, so model factories share the same traversal without React.
export { renderToJscadModel } from "./render"
export type {
  JscadModel,
  JscadReferenceFeature,
  NativeGeometry,
} from "./render"
