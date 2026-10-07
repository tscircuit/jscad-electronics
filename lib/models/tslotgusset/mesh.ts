import {
  getTSlotGussetMountingSlots,
  tSlotGussetModelPropsSchema,
  type TSlotGussetModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  extrudePlanarProfile,
  circularProfile,
  type ProfilePoint,
} from "../../mechanical/extrude-planar-profile"

export interface TSlotGussetMesh {
  positions: number[]
  indices: number[]
}

/** Right triangular flat plate at Z=0..thickness, with both complete through
 * capsules at the mounting centers/orientations resolved by modelprinter.
 */
export function createTSlotGussetMesh(
  input: TSlotGussetModelPropsInput = {},
): TSlotGussetMesh {
  const props = tSlotGussetModelPropsSchema.parse(input)
  const holes = getTSlotGussetMountingSlots(props).map((slot) => {
    const radius = slot.width / 2
    const halfStraight = (slot.length - slot.width) / 2
    const rotate = (u: number, v: number): ProfilePoint =>
      slot.orientation === 0
        ? [slot.center.x + u, slot.center.y + v]
        : [slot.center.x - v, slot.center.y + u]
    if (halfStraight === 0)
      return circularProfile(0, 0, radius).map(([u, v]) => rotate(u, v))
    const loop: ProfilePoint[] = []
    for (const side of [1, -1])
      for (let step = 0; step <= 48; step++) {
        const angle =
          -Math.PI / 2 + (step * Math.PI) / 48 + (side < 0 ? Math.PI : 0)
        loop.push(
          rotate(
            side * halfStraight + radius * Math.cos(angle),
            radius * Math.sin(angle),
          ),
        )
      }
    return loop
  })
  return extrudePlanarProfile({
    outer: [
      [0, 0],
      [props.width, 0],
      [0, props.height],
    ],
    holes,
    start: 0,
    end: props.thickness,
  })
}
