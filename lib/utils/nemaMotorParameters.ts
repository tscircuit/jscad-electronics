import { mm } from "@tscircuit/mm"

export type NemaSize = 8 | 17 | 23
// Matches the parameter contract introduced in modelprinter PR #7. Keep this
// renderer usable with the published modelprinter release (which has no NEMA
// schemas yet); geometry generation lives exclusively in jscad-electronics.
/** Representative motors, not dimensions guaranteed by a frame name.
 * Mounting/pilot/shaft references: Nanotec SCA2018, ST4118 and ST5918 drawings:
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_SCA2018.pdf
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf
 * Cap thicknesses, chamfers and D cuts are illustrative, configurable details.
 * NEMA 8 also has 15.4 mm pitch / 16 mm pilot variants; override both together.
 */
export const nemaMotorDimensions = {
  8: {
    bodyWidth: 20.3,
    bodyLength: 33,
    mountingHoleSpacing: 16,
    mountingHoleDiameter: 2,
    mountingHoleDepth: 2,
    mountingHoleThrough: false,
    pilotDiameter: 15,
    pilotLength: 1.5,
    shaftDiameter: 4,
    shaftLength: 15,
    shaftShape: "round",
    shaftFlatDepth: 0.5,
    shaftFlatLength: 10,
    shaftFlatAngle: 0,
    frontCapLength: 3.5,
    rearCapLength: 3.5,
    faceCornerChamfer: 0.5,
    bodyCornerChamfer: 3,
  },
  17: {
    bodyWidth: 42.3,
    bodyLength: 38,
    mountingHoleSpacing: 31,
    mountingHoleDiameter: 3,
    mountingHoleDepth: 4.5,
    mountingHoleThrough: false,
    pilotDiameter: 22,
    pilotLength: 2,
    shaftDiameter: 5,
    shaftLength: 24,
    shaftShape: "d",
    shaftFlatDepth: 0.5,
    shaftFlatLength: 15,
    shaftFlatAngle: 0,
    frontCapLength: 5,
    rearCapLength: 5,
    faceCornerChamfer: 3,
    bodyCornerChamfer: 6,
  },
  23: {
    bodyWidth: 56.4,
    bodyLength: 51,
    mountingHoleSpacing: 47.14,
    mountingHoleDiameter: 5,
    mountingHoleDepth: 5,
    mountingHoleThrough: true,
    pilotDiameter: 38.1,
    pilotLength: 1.6,
    shaftDiameter: 6.35,
    shaftLength: 20.6,
    shaftShape: "d",
    shaftFlatDepth: 0.5,
    shaftFlatLength: 15,
    shaftFlatAngle: 0,
    frontCapLength: 5,
    rearCapLength: 5,
    faceCornerChamfer: 2,
    bodyCornerChamfer: 15,
  },
} as const

export interface NemaMotorModelProps {
  nemaSize: NemaSize
  bodyWidth: number
  bodyLength: number
  mountingHoleSpacing: number
  mountingHoleDiameter: number
  mountingHoleDepth: number
  mountingHoleThrough: boolean
  pilotDiameter: number
  pilotLength: number
  shaftDiameter: number
  shaftLength: number
  shaftShape: "round" | "d"
  shaftFlatDepth: number
  shaftFlatLength: number
  shaftFlatAngle: number
  frontCapLength: number
  rearCapLength: number
  faceCornerChamfer: number
  bodyCornerChamfer: number
}
export type NemaMotorModelPropsInput = {
  nemaSize: NemaSize
  shaftFlatAngle?: number
} & {
  [K in Exclude<
    keyof NemaMotorModelProps,
    "nemaSize" | "shaftFlatAngle"
  >]?: NemaMotorModelProps[K] extends number
    ? number | string
    : NemaMotorModelProps[K]
}

export function resolveNemaMotorProps(
  input: NemaMotorModelPropsInput,
): NemaMotorModelProps {
  const defaults = nemaMotorDimensions[input.nemaSize]
  if (!defaults || ![8, 17, 23].includes(input.nemaSize))
    throw new Error("Expected NEMA size 8, 17 or 23")
  const p: NemaMotorModelProps = { ...defaults, nemaSize: input.nemaSize }
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || key === "nemaSize") continue
    if (!Object.hasOwn(defaults, key))
      throw new Error(`Unknown NEMA property "${key}"`)
    if (key === "shaftShape") {
      if (value !== "round" && value !== "d")
        throw new Error("Expected round or d shaft")
      p.shaftShape = value
    } else if (key === "mountingHoleThrough") {
      if (typeof value !== "boolean")
        throw new Error("Expected boolean mountingHoleThrough")
      p.mountingHoleThrough = value
    } else {
      if (typeof value !== "number" && typeof value !== "string")
        throw new Error(`Invalid NEMA length "${key}"`)
      if (key === "shaftFlatAngle" && typeof value !== "number")
        throw new Error("shaftFlatAngle must be a number in degrees")
      const numeric = key === "shaftFlatAngle" ? (value as number) : mm(value)
      const nonnegative = [
        "shaftFlatDepth",
        "shaftFlatLength",
        "faceCornerChamfer",
        "bodyCornerChamfer",
      ].includes(key)
      if (
        !Number.isFinite(numeric) ||
        (key !== "shaftFlatAngle" && (nonnegative ? numeric < 0 : numeric <= 0))
      )
        throw new Error(`Invalid NEMA length "${key}"`)
      Object.assign(p, { [key]: numeric })
    }
  }
  const issue = (message: string) => {
    throw new Error(message)
  }
  const r = p.mountingHoleDiameter / 2
  if (p.frontCapLength + p.rearCapLength >= p.bodyLength)
    issue("End caps must leave a positive body length")
  if (
    p.faceCornerChamfer >= p.bodyWidth / 2 ||
    p.bodyCornerChamfer >= p.bodyWidth / 2
  )
    issue("Chamfer must be smaller than half the body width")
  if (
    p.mountingHoleSpacing + 2 * r >= p.bodyWidth ||
    p.bodyWidth - p.faceCornerChamfer - p.mountingHoleSpacing <= r * Math.SQRT2
  )
    issue("Mounting holes must fit entirely inside the front face")
  if (p.pilotDiameter >= p.bodyWidth || p.pilotDiameter <= p.shaftDiameter)
    issue(
      "Pilot diameter must exceed the shaft diameter and fit inside the face",
    )
  if (p.mountingHoleSpacing / Math.SQRT2 <= p.pilotDiameter / 2 + r)
    issue("Mounting holes must clear the pilot")
  if (!p.mountingHoleThrough && p.mountingHoleDepth >= p.frontCapLength)
    issue("Blind mounting hole depth must be less than the front cap length")
  if (
    p.mountingHoleThrough &&
    p.bodyWidth - p.bodyCornerChamfer - p.mountingHoleSpacing >= -r * Math.SQRT2
  )
    issue("Body and rear cap must clear through mounting holes")
  if (p.shaftLength <= p.pilotLength)
    issue("Shaft tip must extend beyond the pilot")
  if (
    p.shaftShape === "d" &&
    (p.shaftFlatDepth <= 0 ||
      p.shaftFlatDepth >= p.shaftDiameter / 2 ||
      p.shaftFlatLength <= 0 ||
      p.shaftFlatLength > p.shaftLength - p.pilotLength)
  )
    issue(
      "D flat must have positive depth less than the shaft radius and fit above the pilot",
    )
  return p
}

const lengths = {
  l: "bodyLength",
  length: "bodyLength",
  bodylength: "bodyLength",
  bodywidth: "bodyWidth",
  shaftlength: "shaftLength",
  shaftdiameter: "shaftDiameter",
  flatdepth: "shaftFlatDepth",
  flatlength: "shaftFlatLength",
  holespacing: "mountingHoleSpacing",
  holediameter: "mountingHoleDiameter",
  holedepth: "mountingHoleDepth",
  pilotdiameter: "pilotDiameter",
  pilotlength: "pilotLength",
  frontcap: "frontCapLength",
  rearcap: "rearCapLength",
  facechamfer: "faceCornerChamfer",
  bodychamfer: "bodyCornerChamfer",
} as const

export function parseNemaMotorString(source: string) {
  const tokens = source.trim().split("_")
  const match = tokens[0]?.match(/^nema(8|17|23)$/i)
  if (!match) throw new Error("Expected nema8, nema17 or nema23")
  const props: Record<string, unknown> = {
    nemaSize: Number(match[1]),
  }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid NEMA token "${token}"`)
    const name = match[1]!.toLowerCase(),
      value = match[2]!
    let property: string, parsed: unknown
    if (name in lengths) {
      property = lengths[name as keyof typeof lengths]
      parsed = value
    } else if (name === "flatangle") {
      property = "shaftFlatAngle"
      if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:deg)?$/i.test(value))
        throw new Error("flatangle requires a numeric angle in degrees")
      parsed = Number(value.replace(/deg$/i, ""))
    } else if (
      ["round", "dshaft", "throughholes", "blindholes"].includes(name)
    ) {
      if (value) throw new Error(`NEMA flag "${name}" does not accept a value`)
      property =
        name === "round" || name === "dshaft"
          ? "shaftShape"
          : "mountingHoleThrough"
      parsed =
        name === "round"
          ? "round"
          : name === "dshaft"
            ? "d"
            : name === "throughholes"
    } else throw new Error(`Unknown NEMA motor token "${token}"`)
    if (property in props)
      throw new Error(`NEMA property "${property}" is set more than once`)
    props[property] = parsed
  }
  return resolveNemaMotorProps(props as NemaMotorModelPropsInput)
}
