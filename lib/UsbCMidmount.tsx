import { fp } from "@tscircuit/footprinter"
import {
  Colorize,
  Cuboid,
  Cylinder,
  Hull,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"

const Capsule = ({
  width,
  height,
  depth,
}: { width: number; height: number; depth: number }) => (
  <Hull>
    {[-1, 1].map((side) => (
      <Translate key={side} offset={[(side * (width - height)) / 2, 0, 0]}>
        <Rotate rotation={[Math.PI / 2, 0, 0]}>
          <Cylinder radius={height / 2} height={depth} />
        </Rotate>
      </Translate>
    ))}
  </Hull>
)

/** USB2 Type-C receptacle: rounded open shell, tongue, contacts and four slot tabs. */
export const UsbCMidmount = ({
  footprint = "usbcmidmount16",
}: { footprint?: string }) => {
  const canonical = footprint.replace(/_pin1location\([^)]*\)/g, "")
  const params = fp.string(canonical).json() as unknown as {
    bodybottom: number
    rowy: number
  }
  const elements = fp.string(canonical).circuitJson()
  const pads = elements.filter(
    (e) => e.type === "pcb_smtpad" && e.shape === "rect",
  )
  const slots = elements.filter((e) => e.type === "pcb_plated_hole")
  const holes = elements.filter((e) => e.type === "pcb_hole")
  const target = fp
    .string(footprint)
    .circuitJson()
    .find((e) => e.type === "pcb_plated_hole")
  const first = slots[0]
  const angle =
    first && target && "x" in target
      ? Math.atan2(target.y, target.x) - Math.atan2(first.y, first.x)
      : 0
  const width = 8.94,
    height = 3.2,
    wall = 0.22
  const back = params.rowy + 0.23,
    front = -params.bodybottom
  const depth = back - front,
    centerY = (back + front) / 2,
    centerZ = 1.65
  if (!Number.isFinite(depth) || depth < 3 || slots.length !== 4)
    throw new Error(
      "UsbCMidmount requires four mounting slots and a positive body depth",
    )
  return (
    <Rotate rotation={[0, 0, angle]}>
      <Colorize color="#b8bdc4">
        <Translate offset={[0, centerY, centerZ]}>
          <Subtract>
            <Capsule width={width} height={height} depth={depth} />
            <Capsule
              width={width - wall * 2}
              height={height - wall * 2}
              depth={depth + 0.2}
            />
          </Subtract>
        </Translate>
      </Colorize>
      <Colorize color="#242529">
        <Cuboid
          size={[6.65, depth - 1.1, 0.7]}
          center={[0, centerY + 0.3, centerZ]}
        />
        <Cuboid size={[7.6, 1, 2.45]} center={[0, back - 0.65, centerZ]} />
        {holes.map((hole, i) =>
          "x" in hole && "hole_diameter" in hole ? (
            <Cylinder
              key={i}
              radius={hole.hole_diameter * 0.42}
              height={0.8}
              center={[hole.x, hole.y, -0.3]}
            />
          ) : null,
        )}
      </Colorize>
      <Colorize color="#d3ad57">
        {[-1, 1].flatMap((side) =>
          [-2.75, -2.25, -1.25, -0.25, 0.25, 1.25, 2.25, 2.75].map((x) => (
            <Cuboid
              key={`${side}-${x}`}
              size={[0.24, depth - 2, 0.04]}
              center={[x, centerY + 0.1, centerZ + side * 0.365]}
            />
          )),
        )}
        {pads.map((pad, i) => (
          <Cuboid
            key={i}
            size={[
              Math.min(pad.width * 0.7, 0.35),
              pad.height * 0.8 + 0.35,
              0.15,
            ]}
            center={[pad.x, pad.y - 0.175, 0.075]}
          />
        ))}
      </Colorize>
      <Colorize color="#b8bdc4">
        {slots.map((slot, i) => (
          <Cuboid
            key={i}
            size={[
              0.4,
              "hole_height" in slot ? Math.max(0.3, slot.hole_height - 0.2) : 1,
              1.65,
            ]}
            center={[slot.x, slot.y, -0.075]}
          />
        ))}
      </Colorize>
    </Rotate>
  )
}
