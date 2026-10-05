import {
  tSlotExtrusionModelPropsSchema,
  type TSlotExtrusionModelPropsInput,
} from "@tscircuit/modelprinter"
import {
  circularProfile,
  extrudePlanarProfile,
  type ProfilePoint,
} from "./extrude-planar-profile"

export interface TSlotExtrusionMesh {
  positions: number[]
  indices: number[]
}

/** Four straight-sided T grooves and an optional bore, all open at both ends.
 * Section centered in XY; end mounting datum Z=0, length extends along +Z.
 */
export function createTSlotExtrusionMesh(
  input: TSlotExtrusionModelPropsInput = {},
): TSlotExtrusionMesh {
  const props = tSlotExtrusionModelPropsSchema.parse(input)
  const { width, height, length, cornerRadius, lipThickness, pocketDepth } =
    props
  const slot = props.slotWidth / 2
  const pocket = props.pocketWidth / 2
  const depth = lipThickness + pocketDepth
  const outer: ProfilePoint[] = []
  for (let face = 0; face < 4; face++) {
    const span = (face % 2 === 0 ? width : height) / 2
    const extent = (face % 2 === 0 ? height : width) / 2
    const local: ProfilePoint[] = [
      [-span + cornerRadius, -extent],
      [-slot, -extent],
      [-slot, -extent + lipThickness],
      [-pocket, -extent + lipThickness],
      [-pocket, -extent + depth],
      [pocket, -extent + depth],
      [pocket, -extent + lipThickness],
      [slot, -extent + lipThickness],
      [slot, -extent],
      [span - cornerRadius, -extent],
    ]
    if (cornerRadius > 0)
      for (let step = 1; step < 24; step++) {
        const angle = -Math.PI / 2 + (step * Math.PI) / 48
        local.push([
          span - cornerRadius + cornerRadius * Math.cos(angle),
          -extent + cornerRadius + cornerRadius * Math.sin(angle),
        ])
      }
    for (const [u, v] of local)
      outer.push(
        face === 0
          ? [u, v]
          : face === 1
            ? [-v, u]
            : face === 2
              ? [-u, -v]
              : [v, -u],
      )
  }
  return extrudePlanarProfile({
    outer,
    holes:
      props.boreDiameter > 0
        ? [circularProfile(0, 0, props.boreDiameter / 2)]
        : [],
    start: 0,
    end: length,
  })
}
