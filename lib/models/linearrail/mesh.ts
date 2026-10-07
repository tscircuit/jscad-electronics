import jscad from "@jscad/modeling"
import {
  linearRailModelPropsSchema,
  getLinearRailDimensions,
  getLinearRailMountingHoles,
  type LinearRailModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
import { indexedMeshToGeom3 } from "../../mechanical/indexedMeshToGeom3"
import {
  finishShaftMountMesh,
  subtractShaftMountParts,
} from "../../mechanical/shaft-mount-geometry"
export interface LinearRailMesh {
  positions: number[]
  indices: number[]
}
export function createLinearRailMesh(
  input: LinearRailModelPropsInput = {},
): LinearRailMesh {
  const p = linearRailModelPropsSchema.parse(input)
  const d = getLinearRailDimensions(p)
  const holes = getLinearRailMountingHoles(p)
  const diameter = Math.max(p.holeDiameter, p.counterboreDiameter)
  const features = [
    p.baseHeight,
    p.neckHeight,
    d.headHeight,
    (p.width - p.neckWidth) / 2,
    (p.neckWidth - p.holeDiameter) / 2,
    p.holeDiameter,
    p.firstHoleOffset - diameter / 2,
    p.length - d.lastHoleOffset - diameter / 2,
  ]
  if (p.chamfer > 0) features.push(p.chamfer)
  if (p.holeCount > 1) features.push(p.holePitch - diameter)
  if (p.counterboreDepth > 0)
    features.push(
      p.counterboreDepth,
      d.headHeight - p.counterboreDepth,
      (p.counterboreDiameter - p.holeDiameter) / 2,
      (p.width - 2 * p.chamfer - p.counterboreDiameter) / 2,
    )
  if (
    Math.min(...features) <=
    Math.max(1e-4, Math.max(p.length, p.width, p.height) * 1e-10)
  )
    throw new Error("Linear rail features exceed mesh resolution")
  const w = p.width / 2,
    n = p.neckWidth / 2,
    b = p.baseHeight,
    s = d.headBottom,
    h = p.height,
    c = p.chamfer
  const profile: ProfilePoint[] = [
    [-w, 0],
    [w, 0],
    [w, b],
    [n, b],
    [n, s],
    [w, s],
    [w, h - c],
    [w - c, h],
    [-w + c, h],
    [-w, h - c],
    [-w, s],
    [-n, s],
    [-n, b],
    [-w, b],
  ]
  const outer = profile.filter(
    (point, i) =>
      point[0] !== profile[(i + profile.length - 1) % profile.length]![0] ||
      point[1] !== profile[(i + profile.length - 1) % profile.length]![1],
  )
  const body = indexedMeshToGeom3(
    extrudePlanarProfile({
      outer,
      start: 0,
      end: p.length,
      project: (x, z, y) => [x, y, z],
      reverse: true,
    }),
  )
  const cutters = holes.flatMap((hole) => {
    const make = (diameter: number, bottom: number) =>
      jscad.primitives.cylinder({
        radius: diameter / 2,
        height: p.height + 1 - bottom,
        center: [hole.center.x, hole.center.y, (bottom + p.height + 1) / 2],
        segments: 48,
      })
    return [
      make(hole.diameter, -1),
      ...(hole.counterboreDepth > 0
        ? [make(hole.counterboreDiameter, p.height - hole.counterboreDepth)]
        : []),
    ]
  })
  return finishShaftMountMesh(subtractShaftMountParts(body, ...cutters))
}
