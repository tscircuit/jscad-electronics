import jscad from "@jscad/modeling"
import {
  linearCarriageModelPropsSchema,
  getLinearCarriageDimensions,
  getLinearCarriageMountingHoles,
  type LinearCarriageModelPropsInput,
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
export interface LinearCarriageMesh {
  positions: number[]
  indices: number[]
}
export function createLinearCarriageMesh(
  input: LinearCarriageModelPropsInput = {},
): LinearCarriageMesh {
  const p = linearCarriageModelPropsSchema.parse(input)
  const d = getLinearCarriageDimensions(p)
  const features = [
    p.clearance,
    (p.width - d.channelHeadWidth) / 2,
    d.channelShoulder - d.bottom,
    p.height - d.channelTop - p.holeDepth,
    p.holeDiameter,
    (p.width - p.holePitchX - p.holeDiameter) / 2,
    (p.length - p.holePitchY - p.holeDiameter) / 2,
    p.holePitchX - p.holeDiameter,
    p.holePitchY - p.holeDiameter,
  ]
  if (
    Math.min(...features) <=
    Math.max(1e-4, Math.max(p.length, p.width, p.height) * 1e-10)
  )
    throw new Error("Linear carriage features exceed mesh resolution")
  const w = p.width / 2,
    n = d.channelNeckWidth / 2,
    a = d.channelHeadWidth / 2,
    b = d.bottom,
    s = d.channelShoulder,
    t = d.channelTop,
    h = p.height
  const outer: ProfilePoint[] = [
    [-w, b],
    [-n, b],
    [-n, s],
    [-a, s],
    [-a, t],
    [a, t],
    [a, s],
    [n, s],
    [n, b],
    [w, b],
    [w, h],
    [-w, h],
  ]
  const body = indexedMeshToGeom3(
    extrudePlanarProfile({
      outer,
      start: -p.length / 2,
      end: p.length / 2,
      project: (x, z, y) => [x, y, z],
      reverse: true,
    }),
  )
  const cutters = getLinearCarriageMountingHoles(p).map((hole) =>
    jscad.primitives.cylinder({
      radius: hole.diameter / 2,
      height: hole.depth + 1,
      center: [hole.center.x, hole.center.y, p.height - hole.depth / 2 + 0.5],
      segments: 48,
    }),
  )
  return finishShaftMountMesh(subtractShaftMountParts(body, ...cutters))
}
