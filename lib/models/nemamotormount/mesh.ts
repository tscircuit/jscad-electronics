import {
  nemaMotorMountModelPropsSchema,
  type NemaMotorMountModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  joinProfileMeshes,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"

export interface NemaMotorMountMesh {
  positions: number[]
  indices: number[]
}

const segments = 128
const radialScale = 1 / Math.cos(Math.PI / segments)

/** Circumscribed holes guarantee their nominal minimum circular clearance. */
function hole(x: number, y: number, radius: number): ProfilePoint[] {
  return Array.from({ length: segments }, (_, index) => {
    const angle = ((index * 2 + 1) * Math.PI) / segments
    return [
      x + radius * radialScale * Math.cos(angle),
      y + radius * radialScale * Math.sin(angle),
    ]
  })
}

/** Welded, outward triangles for the complete drilled L bracket.
 * Motor face and shaft axis are at the origin; +Z follows the shaft.
 * The base extends toward -Z under the motor, at Y=-axisHeight.
 */
export function createNemaMotorMountMesh(
  input: NemaMotorMountModelPropsInput = {},
): NemaMotorMountMesh {
  const p = nemaMotorMountModelPropsSchema.parse(input)
  const {
    width,
    height,
    baseDepth,
    thickness,
    axisHeight,
    mountingHoleSpacing: span,
    mountingHoleDiameter: motorDiameter,
    shaftClearanceDiameter: openingDiameter,
    baseHoleSpacing,
    baseHoleDiameter,
    baseHoleOffset,
  } = p
  const motorRadius = motorDiameter / 2,
    openingRadius = openingDiameter / 2,
    baseRadius = baseHoleDiameter / 2
  const holeLigament = Math.min(
    width / 2 - span / 2 - motorRadius,
    height - axisHeight - span / 2 - motorRadius,
    axisHeight - thickness - span / 2 - motorRadius,
    width / 2 - openingRadius,
    height - axisHeight - openingRadius,
    axisHeight - thickness - openingRadius,
    span - motorDiameter,
    span / Math.SQRT2 - motorRadius - openingRadius,
    (width - baseHoleSpacing - baseHoleDiameter) / 2,
    baseHoleSpacing - baseHoleDiameter,
    baseHoleOffset - baseRadius,
    baseDepth - baseHoleOffset - baseRadius,
  )
  const precision =
    Math.max(width, height, baseDepth, axisHeight, thickness) * 1e-10
  const radialExcess =
    2 * Math.max(motorRadius, openingRadius, baseRadius) * (radialScale - 1)
  if (thickness <= precision || holeLigament <= radialExcess + precision)
    throw new Error(
      "NEMA motor mount ligament or thickness is below mesh resolution; increase clearance to plate edges or between holes",
    )

  const bottom = -axisHeight,
    baseTop = bottom + thickness,
    top = height - axisHeight
  const upright = extrudePlanarProfile({
    outer: [
      [-width / 2, baseTop],
      [width / 2, baseTop],
      [width / 2, top],
      [-width / 2, top],
    ],
    holes: [
      hole(0, 0, openingRadius),
      ...[-1, 1].flatMap((x) =>
        [-1, 1].map((y) => hole((x * span) / 2, (y * span) / 2, motorRadius)),
      ),
    ],
    start: 0,
    end: thickness,
    skipWall: (a, b) => a[1] === baseTop && b[1] === baseTop,
  })
  const base = extrudePlanarProfile({
    outer: [
      [-width / 2, -baseDepth],
      [width / 2, -baseDepth],
      [width / 2, 0],
      [-width / 2, 0],
    ],
    holes: [-1, 1].map((x) =>
      hole((x * baseHoleSpacing) / 2, -baseHoleOffset, baseRadius),
    ),
    start: bottom,
    end: baseTop,
    project: (x, z, y) => [x, y, z],
    reverse: true,
    skipWall: (a, b) => a[1] === 0 && b[1] === 0,
  })
  const corner = extrudePlanarProfile({
    outer: [
      [-width / 2, bottom],
      [width / 2, bottom],
      [width / 2, baseTop],
      [-width / 2, baseTop],
    ],
    start: 0,
    end: thickness,
    skipWall: (a, b) => a[1] === baseTop && b[1] === baseTop,
  })
  // The corner's Z=0 cap joins the base; its top joins the upright.
  // Omit both internal faces so the returned raw mesh needs no CSG repair.
  corner.indices = corner.indices.filter((_, index) => {
    const start = index - (index % 3)
    return !corner.indices
      .slice(start, start + 3)
      .every((vertex) => corner.positions[vertex * 3 + 2] === 0)
  })
  return joinProfileMeshes([upright, base, corner])
}
