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

/** Renderer-independent closed extrusions in mm. The shaft axis is +Z,
 * mounting face at Z=0, body at -bodyLength. Cap/core profiles are illustrative.
 * Blind holes have actual floors; through holes clear the core and rear cap.
 * Threads, wires and manufacturing tolerances are not represented.
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
  const front = face(p.bodyWidth, p.faceCornerChamfer)
  const core = face(p.bodyWidth, p.bodyCornerChamfer)
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
  add(
    "rearCap",
    p.mountingHoleThrough ? core : front,
    -p.bodyLength,
    -p.bodyLength + p.rearCapLength,
  )
  add("pilot", circle(p.pilotDiameter / 2), 0, p.pilotLength)
  const r = p.shaftDiameter / 2
  const round = circle(r)
  if (p.shaftShape === "round")
    add("shaft", round, p.pilotLength, p.shaftLength)
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
