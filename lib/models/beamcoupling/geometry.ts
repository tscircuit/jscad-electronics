import jscad from "@jscad/modeling"
import {
  beamCouplingModelPropsSchema,
  getBeamCouplingDimensions,
  type BeamCouplingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
const { primitives, booleans, extrusions, transforms } = jscad
/** Staggered transverse flexure slots leave one uninterrupted bridge at every axial station. */
export function createBeamCouplingGeom(
  input: BeamCouplingModelPropsInput = {},
) {
  const p = beamCouplingModelPropsSchema.parse(input)
  const { slotPitch } = getBeamCouplingDimensions(p)
  const body = primitives.cylinder({
    radius: p.outerDiameter / 2,
    height: p.length,
    center: [0, 0, p.length / 2],
    segments: 64,
  })
  const cutters = [
    primitives.cylinder({
      radius: p.boreDiameter / 2,
      height: p.length + 2,
      center: [0, 0, p.length / 2],
      segments: 64,
    }),
  ]
  const gap = (p.bridgeAngle * Math.PI) / 180,
    radius = p.outerDiameter
  for (let i = 0; i < p.slotCount; i++) {
    const rotation = (i * Math.PI) / 2
    const points: [number, number][] = [[0, 0]]
    for (let j = 0; j <= 64; j++) {
      const angle = rotation + gap / 2 + ((2 * Math.PI - gap) * j) / 64
      points.push([radius * Math.cos(angle), radius * Math.sin(angle)])
    }
    cutters.push(
      transforms.translateZ(
        p.hubLength + (i + 1) * slotPitch - p.slotWidth / 2,
        extrusions.extrudeLinear(
          { height: p.slotWidth },
          primitives.polygon({ points }),
        ),
      ),
    )
  }
  return booleans.subtract(body, ...cutters)
}
export function createBeamCouplingMesh(
  input: BeamCouplingModelPropsInput = {},
) {
  return geom3ToIndexedMesh(createBeamCouplingGeom(input))
}
