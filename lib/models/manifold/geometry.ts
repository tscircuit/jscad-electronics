import jscad from "@jscad/modeling"
import {
  manifoldModelPropsSchema,
  type ManifoldModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
import {
  union,
  subtract,
  box,
  sphere,
  solidX,
  solidY,
  solidZ,
  hexX,
  taperX,
  overrun,
} from "../../mechanical/plumbing-shapes"
/** Nominal envelope centered on its flow axis. Threads use smooth envelopes. */
export function createManifoldGeom(input: ManifoldModelPropsInput = {}) {
  const p = manifoldModelPropsSchema.parse(input)
  const e = overrun(
    Math.max(
      ...Object.entries(p)
        .filter(([key]) => !key.endsWith("Count"))
        .map(([, value]) => value),
    ),
  )
  const shell = box({ size: [p.length, p.width, p.height] })
  const ports = Array.from({ length: p.portCount }, (_, i) =>
    solidZ(
      p.portDiameter,
      p.height / 2 + e,
      (i - (p.portCount - 1) / 2) * p.portPitch,
      0,
      p.height / 4,
    ),
  )
  const mounting = [-1, 1].flatMap((side) =>
    [-1, 1].map((end) =>
      solidZ(
        p.mountingHoleDiameter,
        p.height + e,
        end * (p.length / 2 - p.mountingHoleDiameter),
        side * (p.width / 2 - p.mountingHoleDiameter),
      ),
    ),
  )
  return subtract(
    shell,
    solidX(p.boreDiameter, p.length + e),
    ...ports,
    ...mounting,
  )
}
export function createManifoldMesh(input: ManifoldModelPropsInput = {}) {
  return geom3ToIndexedMesh(createManifoldGeom(input))
}
