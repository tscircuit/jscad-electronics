import { fp } from "@tscircuit/footprinter"
import { Rotate } from "jscad-fiber"
import { ChipBody } from "./ChipBody"
import { SmdChipLead } from "./SmdChipLead"
const getPads = (footprint: string) =>
  fp
    .string(footprint)
    .circuitJson()
    .filter(
      (element) =>
        element.type === "pcb_smtpad" &&
        (element.shape === "rect" || element.shape === "rotated_rect"),
    )
    .map((pad) => ({ x: pad.x, y: pad.y, pin: pad.port_hints?.[0] }))

/** SOT143B nominal dimensions: Nexperia SOT143B package outline (mm). */
export const SOT143 = ({ footprint = "sot143" }: { footprint?: string }) => {
  const pads = getPads(footprint)
  if (pads.length !== 4) throw new Error("SOT143 requires four signal pads")
  const canonical = getPads("sot143")
  const options = fp.string(footprint).json() as { pin1location?: string[] }
  // Resolve pin1location using the numbered pad direction, not bounding boxes:
  // the latter cannot distinguish the 180-degree variants of this package.
  const origin = canonical[1]!
  const target = pads.find((pad) => pad.pin === "2")!
  const angle = options.pin1location
    ? Math.round(
        (Math.atan2(target.y, target.x) - Math.atan2(origin.y, origin.x)) /
          (Math.PI / 2),
      ) *
      (Math.PI / 2)
    : 0
  const local = pads.map((pad) => ({
    ...pad,
    x: pad.x * Math.cos(angle) + pad.y * Math.sin(angle),
    y: -pad.x * Math.sin(angle) + pad.y * Math.cos(angle),
  }))
  return (
    <Rotate rotation={[0, 0, angle]}>
      <ChipBody
        width={2.9}
        length={1.3}
        height={0.95}
        heightAboveSurface={0.05}
        center={{ x: 0, y: 0, z: 0 }}
        includeNotch={false}
        taperRatio={0.06}
      />
      {local.map((pad) => {
        const side = pad.y < 0 ? -1 : 1
        const leadWidth = pad.pin === "1" ? 0.83 : 0.43
        // Solder land is deliberately larger than the actual lead toe.
        return (
          <SmdChipLead
            key={pad.pin}
            width={leadWidth}
            thickness={0.12}
            height={0.45}
            padContactLength={0.3}
            bodyDistance={0.6}
            rotation={side < 0 ? Math.PI / 2 : -Math.PI / 2}
            position={{ x: pad.x, y: side * 1.15, z: 0.06 }}
          />
        )
      })}
    </Rotate>
  )
}
