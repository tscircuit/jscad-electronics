import { fp } from "@tscircuit/footprinter"
import { mm } from "@tscircuit/mm"
import { Colorize, Cuboid, Rotate, Subtract, Union } from "jscad-fiber"

type ShParams = {
  fn: string
  sh?: boolean
  smd?: boolean
  p: number
  num_pins: number
  mpx?: number
  mpy?: number
}
/** A generic pad fit is SH only when its pitch AND hold-down layout agree. */
export function isJstShFootprint(footprint: string): boolean {
  const p = fp.string(footprint).json() as unknown as ShParams
  if (p.fn !== "jst") return false
  return Boolean(
    p.sh ||
      (p.smd &&
        Math.abs(mm(p.p) - 1) < 0.01 &&
        Math.abs(mm(p.mpx ?? 0) - (p.num_pins - 1 + 2.6)) < 0.15 &&
        Math.abs(mm(p.mpy ?? 0) - 2.525) < 0.15),
  )
}

/** JST SH BMxxB-SRSS-TB top-entry header, nominal dimensions from JST eSH.pdf. */
export const JstSh = ({ footprint = "jst6_sh" }: { footprint?: string }) => {
  if (!isJstShFootprint(footprint))
    throw new Error(
      "JstSh requires a named SH or matching 1mm SH top-entry footprint",
    )
  const canonical = footprint.replace(/_pin1location\([^)]*\)/g, "")
  const params = fp.string(canonical).json() as unknown as ShParams
  const pads = fp
    .string(canonical)
    .circuitJson()
    .filter((e) => e.type === "pcb_smtpad" && e.shape === "rect")
  const target = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  const n = params.num_pins
  if (!Number.isInteger(n) || n < 2 || n > 20 || pads.length !== n + 2)
    throw new Error("JstSh requires 2–20 contacts and two hold-down pads")
  const signals = pads.slice(0, n),
    mounts = pads.slice(n)
  const angle =
    Math.atan2(target[1]!.y - target[0]!.y, target[1]!.x - target[0]!.x) -
    Math.atan2(pads[1]!.y - pads[0]!.y, pads[1]!.x - pads[0]!.x)
  const x = signals.reduce((sum, p) => sum + p.x, 0) / n,
    rowY = signals[0]!.y
  const direction = mounts[0]!.y > rowY ? 1 : -1
  const y = rowY + direction * 1.8,
    width = n + 2,
    depth = 2.9,
    height = 4.2
  const pinY = y - direction * 0.25
  return (
    <Rotate rotation={[0, 0, angle]}>
      <Colorize color="#e4e1d6">
        <Subtract>
          <Cuboid
            size={[width, depth, height]}
            center={[x, y, height / 2 + 0.05]}
          />
          <Cuboid
            size={[width - 1.3, 1.8, height]}
            center={[x, y, height / 2 + 0.8]}
          />
          {mounts.map((pad, i) => (
            <Cuboid
              key={`recess-${i}`}
              size={[0.7, pad.height * 0.8, 1.5]}
              center={[pad.x, pad.y, 0.75]}
            />
          ))}
          {[-1, 1].map((side) => (
            <Cuboid
              key={side}
              size={[0.55, 0.6, 1]}
              center={[
                x + side * (width / 2 - 0.9),
                y + (direction * depth) / 2,
                4,
              ]}
            />
          ))}
        </Subtract>
      </Colorize>
      <Colorize color="#c6c7c9">
        {signals.map((pad, i) => {
          const tailY = pad.y - direction * pad.height * 0.4
          return (
            <Union key={i}>
              <Cuboid
                size={[0.2, Math.abs(pinY - tailY) + 0.1, 0.2]}
                center={[pad.x, (pinY + tailY) / 2, 0.1]}
              />
              <Cuboid size={[0.2, 0.2, 3.45]} center={[pad.x, pinY, 1.725]} />
            </Union>
          )
        })}
        {mounts.map((pad, i) => (
          <Union key={`mount-${i}`}>
            <Cuboid
              size={[0.7, pad.height * 0.75, 0.2]}
              center={[pad.x, pad.y, 0.1]}
            />
            <Cuboid
              size={[0.2, pad.height * 0.6, 1.35]}
              center={[pad.x, pad.y, 0.675]}
            />
          </Union>
        ))}
      </Colorize>
    </Rotate>
  )
}
