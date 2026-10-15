import jscad from "@jscad/modeling"
import {
  jawCouplingModelPropsSchema,
  getJawCouplingDimensions,
  type JawCouplingModelPropsInput,
} from "@tscircuit/modelprinter"
import { geom3ToIndexedMesh } from "../../mechanical/geom3-to-indexed-mesh"
const { primitives, extrusions, transforms, booleans } = jscad
function sector(
  inner: number,
  outer: number,
  center: number,
  halfAngle: number,
  z: number,
  height: number,
) {
  const points: [number, number][] = []
  for (let i = 0; i <= 12; i++) {
    const a = center - halfAngle + (2 * halfAngle * i) / 12
    points.push([outer * Math.cos(a), outer * Math.sin(a)])
  }
  for (let i = 12; i >= 0; i--) {
    const a = center - halfAngle + (2 * halfAngle * i) / 12
    points.push([inner * Math.cos(a), inner * Math.sin(a)])
  }
  return transforms.translateZ(
    z,
    extrusions.extrudeLinear({ height }, primitives.polygon({ points })),
  )
}
/** Separate hubs and spider, including intentional visible clearance around each interleaved jaw. */
export function createJawCouplingParts(input: JawCouplingModelPropsInput = {}) {
  const p = jawCouplingModelPropsSchema.parse(input)
  const { centralLength, jawInnerRadius } = getJawCouplingDimensions(p)
  const r = p.outerDiameter / 2,
    epsilon = Math.min(p.hubLength, p.jawDepth) * 1e-4
  const hub = (z: number) =>
    primitives.cylinder({
      radius: r,
      height: p.hubLength,
      center: [0, 0, z + p.hubLength / 2],
      segments: 64,
    })
  const hubs = [hub(0), hub(p.length - p.hubLength)]
  const spider = [
    primitives.cylinder({
      radius: jawInnerRadius * 0.97,
      height: centralLength * 0.96,
      center: [0, 0, p.length / 2],
      segments: 64,
    }),
  ]
  const pitch = Math.PI / p.jawCount
  for (let i = 0; i < 2 * p.jawCount; i++) {
    const angle = i * pitch
    const z =
      i % 2 === 0 ? p.hubLength - epsilon : p.length - p.hubLength - p.jawDepth
    hubs.push(
      sector(jawInnerRadius, r, angle, pitch * 0.39, z, p.jawDepth + epsilon),
    )
    spider.push(
      sector(
        jawInnerRadius * 0.95,
        r * 0.94,
        angle + pitch / 2,
        pitch * 0.07,
        p.hubLength + centralLength * 0.02,
        centralLength * 0.96,
      ),
    )
  }
  const bore = primitives.cylinder({
    radius: p.boreDiameter / 2,
    height: p.length + 2,
    center: [0, 0, p.length / 2],
    segments: 64,
  })
  return {
    hubs: booleans.subtract(booleans.union(...hubs), bore),
    spider: booleans.subtract(booleans.union(...spider), bore),
  }
}
export function createJawCouplingGeom(input: JawCouplingModelPropsInput = {}) {
  const parts = createJawCouplingParts(input)
  return booleans.union(parts.hubs, parts.spider)
}
export function createJawCouplingMesh(input: JawCouplingModelPropsInput = {}) {
  return geom3ToIndexedMesh(createJawCouplingGeom(input))
}
