import { componentMaterials } from "./materials"
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
  const builder = fp.string(canonical)
  const params = builder.json()
  if (params.fn !== "usbcmidmount") {
    throw new Error("UsbCMidmount requires a usbcmidmount footprint")
  }
  const elements = builder.circuitJson()
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
  const width = 8.94
  const height = 3.2
  const centerZ = 1.65
  const wall = params.shellwall ?? 0.22
  const front = -params.bodybottom
  const depth = params.shelldepth ?? params.rowy + 0.23 - front
  const back = front + depth
  const centerY = front + depth / 2
  if (!Number.isFinite(depth) || depth < 3 || slots.length !== 4)
    throw new Error(
      "UsbCMidmount requires four mounting slots and a shell depth of at least 3 mm",
    )

  const cavity = params.cavitydepth ?? depth - 1.15
  const setback = params.tonguesetback ?? 0.85
  const thickness = params.tonguethickness ?? 0.7
  if (!(wall > 0 && thickness > 0 && thickness + 0.07 < height - 2 * wall))
    throw new Error("USB-C tongue and contacts must fit inside the shell walls")
  if (!(0 <= setback && setback < cavity && cavity < depth))
    throw new Error(
      "USB-C requires 0 <= tonguesetback < cavitydepth < shelldepth",
    )

  const insulatorFront = front + cavity
  const tongueFront = front + setback
  // With no authored cavity the legacy rectangular tongue extends into the
  // rear block. An explicit cavity terminates the exposed tongue at its wall.
  const tongueBack =
    params.cavitydepth === undefined ? back - 0.25 : insulatorFront
  const tongueLength = tongueBack - tongueFront
  const customTongue =
    params.cavitydepth !== undefined || params.tonguesetback !== undefined
  const contactInset = Math.min(0.15, tongueLength / 4)
  const contactLength = customTongue
    ? tongueLength - 2 * contactInset
    : depth - 2
  const tongueCenter = (tongueFront + tongueBack) / 2
  const contactCenter = customTongue ? tongueCenter : centerY + 0.1
  // Reach the sidewall at its widest point while preserving slot insertion depth.
  const tabBottom = -0.9,
    tabTop = centerZ + 0.1
  return (
    <Rotate rotation={[0, 0, angle]}>
      <Colorize color="#b8bdc4" material={componentMaterials.brushedMetal}>
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
      <Colorize color="#242529" material={componentMaterials.moldedPlastic}>
        <Cuboid
          size={[6.65, tongueLength, thickness]}
          center={[0, tongueCenter, centerZ]}
        />
        {params.cavitydepth === undefined ? (
          <Cuboid size={[7.6, 1, 2.45]} center={[0, back - 0.65, centerZ]} />
        ) : (
          <Translate offset={[0, (insulatorFront + back) / 2, centerZ]}>
            <Capsule
              width={width - 2 * wall}
              height={height - 2 * wall}
              depth={depth - cavity}
            />
          </Translate>
        )}
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
      <Colorize color="#d3ad57" material={componentMaterials.goldContact}>
        {[-1, 1].flatMap((side) =>
          [-2.75, -2.25, -1.25, -0.25, 0.25, 1.25, 2.25, 2.75].map((x) => (
            <Cuboid
              key={`${side}-${x}`}
              size={[0.24, contactLength, 0.04]}
              center={[
                x,
                contactCenter,
                centerZ + side * (thickness / 2 + 0.015),
              ]}
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
      <Colorize color="#b8bdc4" material={componentMaterials.brushedMetal}>
        {slots.map((slot, i) => (
          <Cuboid
            key={i}
            size={[
              0.4,
              "hole_height" in slot && slot.hole_height !== undefined
                ? Math.max(0.3, slot.hole_height - 0.2)
                : 1,
              tabTop - tabBottom,
            ]}
            center={[slot.x, slot.y, (tabTop + tabBottom) / 2]}
          />
        ))}
      </Colorize>
    </Rotate>
  )
}
