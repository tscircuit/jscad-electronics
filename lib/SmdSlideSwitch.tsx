import { fp } from "@tscircuit/footprinter"
import { Colorize, Cuboid, Cylinder, Rotate, Subtract } from "jscad-fiber"

/** Low-profile side-actuated SPDT switch; MSK12C02 and MINI MSK12C02 outlines. */
export const SmdSlideSwitch = ({
  footprint = "smdslideswitch7",
  position = 0,
}: { footprint?: string; position?: 0 | 1 }) => {
  const canonical = footprint.replace(/_pin1location\([^)]*\)/g, "")
  const params = fp.string(canonical).json() as unknown as {
    mpx: number
    mounty: number
  }
  const elements = fp.string(canonical).circuitJson()
  const pads = elements.filter(
    (e) => e.type === "pcb_smtpad" && e.shape === "rect",
  )
  const target = fp
    .string(footprint)
    .circuitJson()
    .filter(
      (e) =>
        e.type === "pcb_smtpad" &&
        (e.shape === "rect" || e.shape === "rotated_rect"),
    )
  if (pads.length < 7 || !Number.isFinite(params.mpx) || params.mpx < 3)
    throw new Error("SmdSlideSwitch needs signal pads and four mounting pads")
  const angle =
    Math.atan2(target[1]!.y - target[0]!.y, target[1]!.x - target[0]!.x) -
    Math.atan2(pads[1]!.y - pads[0]!.y, pads[1]!.x - pads[0]!.x)
  const width = params.mpx - 0.5,
    depth = 2.7,
    height = params.mpx > 6 ? 1.5 : 1.4,
    y = params.mounty
  return (
    <Rotate rotation={[0, 0, angle]}>
      <Colorize color="#aeb4ba">
        <Subtract>
          <Cuboid size={[width, depth, height]} center={[0, y, height / 2]} />
          <Cuboid
            size={[width - 0.3, depth - 0.3, height]}
            center={[0, y, height / 2 - 0.15]}
          />
          <Cuboid size={[2.7, 0.5, 0.9]} center={[0, y - depth / 2, 0.65]} />
        </Subtract>
      </Colorize>
      <Colorize color="#28292c">
        <Cuboid
          size={[width - 0.32, depth - 0.32, 0.35]}
          center={[0, y, 0.175]}
        />
        <Cuboid
          size={[1, 2.25, 0.65]}
          center={[position === 0 ? -0.5 : 0.5, y - 1.5, 0.65]}
        />
        {elements
          .filter((e) => e.type === "pcb_hole")
          .map((hole, i) =>
            "hole_diameter" in hole && "x" in hole ? (
              <Cylinder
                key={i}
                radius={hole.hole_diameter * 0.42}
                height={0.6}
                center={[hole.x, hole.y, -0.2]}
              />
            ) : null,
          )}
      </Colorize>
      <Colorize color="#c6c7c9">
        {pads.map((pad, i) => {
          const signal = i < pads.length - 4
          const outerY = pad.y + pad.height * 0.4
          const innerY = Math.min(pad.y - pad.height * 0.4, y + depth / 2 - 0.2)
          return (
            <Cuboid
              key={i}
              size={[
                pad.width * 0.8,
                signal ? outerY - innerY : pad.height * 0.8,
                0.18,
              ]}
              center={[pad.x, signal ? (outerY + innerY) / 2 : pad.y, 0.09]}
            />
          )
        })}
      </Colorize>
    </Rotate>
  )
}
