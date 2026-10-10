import {
  tSlotPanelRetainerModelPropsSchema,
  type TSlotPanelRetainerModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"
export interface TSlotPanelRetainerMesh {
  positions: number[]
  indices: number[]
}
/** Custom stepped panel-edge clip; no extrusion supplier or T-slot standard is implied. Width is centered on X, rear mounting face is Y=0, depth extends +Y, and bottom Z=0. A horizontal shelf starts at Z=offset and has thickness t. Its front retaining lip rises panelThickness above the shelf top. A panel rests on Z=offset+t behind that lip. The rear flange spans the full height and has one Y-directed fixing hole centered in width, at Z=height-thickness-holeDiameter/2, leaving thickness above the hole. */
export function createTSlotPanelRetainerMesh(
  input: TSlotPanelRetainerModelPropsInput,
): TSlotPanelRetainerMesh {
  const p = tSlotPanelRetainerModelPropsSchema.parse(input)
  const {
    width: w,
    height: h,
    depth: d,
    thickness: t,
    panelThickness: panel,
    offset,
    holeDiameter: hole,
  } = p
  const holeZ = h - t - hole / 2,
    shelfTop = offset + t
  const flange = (low: number, high: number): ProfilePoint[] => [
    [-w / 2, low],
    [w / 2, low],
    [w / 2, high],
    [-w / 2, high],
  ]
  // Subdivide the shelf tangents at Y=t so the rear flange joins without caps.
  const shelf: ProfilePoint[] = [
    [0, offset],
    [t, offset],
    [d, offset],
    [d, shelfTop + panel],
    [d - t, shelfTop + panel],
    [d - t, shelfTop],
    [t, shelfTop],
    [0, shelfTop],
  ]
  return joinProfileMeshes([
    extrudePlanarProfile({
      outer: flange(0, offset),
      start: 0,
      end: t,
      project: (u, v, depth) => [u, depth, v],
      reverse: true,
      skipWall: (a, b) => a[1] === offset && b[1] === offset,
    }),
    extrudePlanarProfile({
      outer: flange(shelfTop, h),
      holes: [circularProfile(0, holeZ, hole / 2)],
      start: 0,
      end: t,
      project: (u, v, depth) => [u, depth, v],
      reverse: true,
      skipWall: (a, b) => a[1] === shelfTop && b[1] === shelfTop,
    }),
    extrudePlanarProfile({
      outer: shelf,
      start: -w / 2,
      end: w / 2,
      project: (u, v, depth) => [depth, u, v],
      skipWall: (a, b) => a[0] <= t && b[0] <= t && a[1] === b[1],
    }),
  ])
}
