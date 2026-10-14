import {
  resolveNemaMotorProps,
  type NemaMotorModelPropsInput,
} from "./nemaMotorParameters"

export type NemaMotorPoint = [number, number]
export interface NemaMotorSection {
  name: "body" | "frontCap" | "rearCap" | "pilot" | "shaft"
  outline: NemaMotorPoint[]
  holes: NemaMotorPoint[][]
  zMin: number
  zMax: number
}
const circle = (radius: number, x = 0, y = 0): NemaMotorPoint[] =>
  Array.from({ length: 96 }, (_, i) => [
    x + radius * Math.cos((i * Math.PI) / 48),
    y + radius * Math.sin((i * Math.PI) / 48),
  ])
const face = (width: number, chamfer: number): NemaMotorPoint[] => {
  const h = width / 2,
    c = chamfer
  if (c === 0)
    return [
      [-h, -h],
      [h, -h],
      [h, h],
      [-h, h],
    ]
  return [
    [-h + c, -h],
    [h - c, -h],
    [h, -h + c],
    [h, h - c],
    [h - c, h],
    [-h + c, h],
    [-h, h - c],
    [-h, -h + c],
  ]
}

const roundedFace = (width: number, radius: number): NemaMotorPoint[] => {
  if (radius === 0) return face(width, 0)
  const center = width / 2 - radius
  return [0, 1, 2, 3].flatMap((corner) =>
    Array.from({ length: 13 }, (_, i): NemaMotorPoint => {
      const angle = (i * Math.PI) / 24,
        rotation = (corner * Math.PI) / 2
      const x = center + radius * Math.cos(angle),
        y = center + radius * Math.sin(angle)
      return [
        x * Math.cos(rotation) - y * Math.sin(rotation),
        x * Math.sin(rotation) + y * Math.cos(rotation),
      ]
    }),
  )
}

// Rounded, stepped corner reliefs follow the shoulders in the NEMA34 photo.
// Each corner has two convex fillets around a concave shoulder, not a diagonal.
const steppedFace = (
  width: number,
  chamfer: number,
  recessRadius?: number,
  filletRadius?: number,
): NemaMotorPoint[] => {
  if (chamfer === 0) return face(width, 0)
  const h = width / 2,
    c = chamfer / Math.SQRT2,
    r = Math.min(4, c / 4)
  const corner: NemaMotorPoint[] = []
  const arc = (
    x: number,
    y: number,
    radius: number,
    from: number,
    to: number,
  ) => {
    if (radius === 0) {
      corner.push([x, y])
      return
    }
    for (let i = 0; i <= 12; i++) {
      const a = ((from + ((to - from) * i) / 12) * Math.PI) / 180
      corner.push([x + radius * Math.cos(a), y + radius * Math.sin(a)])
    }
  }
  const convex = filletRadius ?? r
  const concave = recessRadius ?? r
  arc(h - c - convex, h - convex, convex, 90, 0)
  arc(h - c + concave, h - c + concave, concave, 180, 270)
  arc(h - convex, h - c - convex, convex, 90, 0)
  // Reverse the clockwise outline to match the existing CCW section profiles.
  return [0, 1, 2, 3]
    .flatMap((i) =>
      corner.map(([x, y]): NemaMotorPoint => {
        const a = (-i * Math.PI) / 2
        return [
          x * Math.cos(a) - y * Math.sin(a),
          x * Math.sin(a) + y * Math.cos(a),
        ]
      }),
    )
    .reverse()
}

/** Renderer-independent closed extrusions in mm. The shaft axis is +Z,
 * mounting face at Z=0, body at -bodyLength. Cap/core profiles are illustrative.
 * Blind holes have actual floors; front through holes clear the core.
 * Rear cap bores and screws are configured separately.
 * Threads and manufacturing tolerances are not represented. Wire geometry is added separately.
 */
export function createNemaMotorSections(
  input: NemaMotorModelPropsInput,
): NemaMotorSection[] {
  const p = resolveNemaMotorProps(input)
  const sections: NemaMotorSection[] = []
  const add = (
    name: NemaMotorSection["name"],
    outline: NemaMotorPoint[],
    zMin: number,
    zMax: number,
    holes: NemaMotorPoint[][] = [],
  ) => {
    if (zMax > zMin) sections.push({ name, outline, holes, zMin, zMax })
  }
  const front = (p.nemaSize === 34 ? roundedFace : face)(
    p.bodyWidth,
    p.faceCornerChamfer,
  )
  const core = p.stepped
    ? steppedFace(
        p.bodyWidth,
        p.bodyCornerChamfer,
        p.bodyCornerRecessRadius,
        p.bodyCornerFilletRadius,
      )
    : face(p.bodyWidth, p.bodyCornerChamfer)
  const rear = p.rearStepped
    ? steppedFace(
        p.bodyWidth,
        p.rearCornerChamfer,
        p.rearCornerRecessRadius,
        p.rearCornerFilletRadius,
      )
    : face(p.bodyWidth, p.rearCornerChamfer)
  const h = p.mountingHoleSpacing / 2
  const centers: NemaMotorPoint[] = [
    [-h, -h],
    [h, -h],
    [h, h],
    [-h, h],
  ]
  const holes = centers.map(([x, y]) =>
    circle(p.mountingHoleDiameter / 2, x, y),
  )
  const holeDepth = p.mountingHoleThrough
    ? p.frontCapLength
    : p.mountingHoleDepth
  add("frontCap", front, -holeDepth, 0, holes)
  add("frontCap", front, -p.frontCapLength, -holeDepth)
  add("body", core, -p.bodyLength + p.rearCapLength, -p.frontCapLength)
  if (p.backFacePlain) {
    add("rearCap", rear, -p.bodyLength, -p.bodyLength + p.rearCapLength)
  } else {
    const halfPitchX = p.backFaceHoleSpacingX / 2
    const halfPitchY = p.backFaceHoleSpacingY / 2
    const rearHoles = [-halfPitchX, halfPitchX].flatMap((x) =>
      [-halfPitchY, halfPitchY].map((y) =>
        circle(p.backFaceHoleDiameter / 2, x, y),
      ),
    )
    // Rear-facing blind bores open at -bodyLength, with a solid floor inside
    // the cap. The rear outline is independent of the mounting flange.
    add(
      "rearCap",
      rear,
      -p.bodyLength,
      -p.bodyLength + p.backFaceHoleDepth,
      rearHoles,
    )
    add(
      "rearCap",
      rear,
      -p.bodyLength + p.backFaceHoleDepth,
      -p.bodyLength + p.rearCapLength,
    )
  }
  add("pilot", circle(p.pilotDiameter / 2), 0, p.pilotLength)
  const r = p.shaftDiameter / 2
  const round = circle(r)
  if (p.roundShaft) add("shaft", round, p.pilotLength, p.shaftLength)
  else {
    const cut = r - p.shaftFlatDepth
    const angle = Math.acos(cut / r)
    // Exact chord ends and a circular arc: no clamping duplicate vertices.
    const profile: NemaMotorPoint[] = Array.from({ length: 97 }, (_, i) => {
      const a = angle + ((2 * Math.PI - 2 * angle) * i) / 96
      return [r * Math.cos(a), r * Math.sin(a)]
    })
    const rotation = (p.shaftFlatAngle * Math.PI) / 180
    const d: NemaMotorPoint[] = profile.map(([x, y]) => [
      x * Math.cos(rotation) - y * Math.sin(rotation),
      x * Math.sin(rotation) + y * Math.cos(rotation),
    ])
    add("shaft", round, p.pilotLength, p.shaftLength - p.shaftFlatLength)
    add("shaft", d, p.shaftLength - p.shaftFlatLength, p.shaftLength)
  }
  return sections
}
