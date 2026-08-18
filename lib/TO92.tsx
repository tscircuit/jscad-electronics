import {
  Colorize,
  Cuboid,
  Hull,
  Translate,
  Cylinder,
  Subtract,
} from "jscad-fiber"

export interface TO92Lead {
  x: number
  y: number
}

export interface TO92Props {
  /**
   * Diameter of the round body. TO-92 comes in more than one size — `to92l`
   * is 4.8mm across, `to92s` 2.5mm — and the difference is the whole reason
   * these are separate footprints, so it must not be baked in.
   */
  bodyDiameter?: number
  bodyHeight?: number
  /** Depth of the flat cut across the cylinder. */
  flatCut?: number
  /**
   * Where the leads meet the board, taken from the footprint's plated holes.
   *
   * The pattern differs per footprint and cannot be inferred from the pitch:
   * `to92` sets its middle pin 1.27mm behind the outer two, `to92s` puts all
   * three in a row, and `to92l` places pin 1 at the origin so the group is not
   * centred at all. Defaults to `to92`'s pattern.
   */
  leads?: TO92Lead[]
  /**
   * Gap between the board and the underside of the moulded body — the leads
   * are formed in it.
   */
  standoff?: number
  /** How far the leads run below the board. */
  leadLength?: number
  bodyColor?: string
}

const TO92_DEFAULT_LEADS: TO92Lead[] = [
  { x: -1.27, y: 0.98 },
  { x: 0, y: 2.25 },
  { x: 1.27, y: 0.98 },
]

/** The two leads furthest apart, and whatever is between them. */
const splitOuterLeads = (leads: TO92Lead[]) => {
  let outer: [TO92Lead, TO92Lead] = [leads[0]!, leads[leads.length - 1]!]
  let best = -1
  for (let i = 0; i < leads.length; i++) {
    for (let j = i + 1; j < leads.length; j++) {
      const separation = Math.hypot(
        leads[i]!.x - leads[j]!.x,
        leads[i]!.y - leads[j]!.y,
      )
      if (separation > best) {
        best = separation
        outer = [leads[i]!, leads[j]!]
      }
    }
  }
  return { outer, separation: best }
}

/**
 * TO-92.
 *
 * Seated and aligned from the footprint: the body is centred on the two outer
 * leads, starts `standoff` above the board and ends `bodyHeight` higher, and
 * every lead is formed from its own hole up to a row of exit points under the
 * body. It used to be translated 10.5mm up with 15mm leads on a hardcoded
 * pattern, which measured 19.5mm end to end for a 4.5mm part and only lined up
 * with one of the three TO-92 footprints.
 */
export const TO92 = ({
  bodyDiameter = 4.8,
  bodyHeight = 4.5,
  flatCut = 1.1,
  leads = TO92_DEFAULT_LEADS,
  standoff = 1.5,
  leadLength = 3,
  bodyColor = "#222",
}: TO92Props = {}) => {
  const bodyRadius = bodyDiameter / 2
  const legWidth = 0.4
  const legThickness = 0.25

  const { outer, separation } = splitOuterLeads(leads)
  const [first, last] = outer
  const bodyCenter = {
    x: (first.x + last.x) / 2,
    y: (first.y + last.y) / 2,
  }

  // The leads leave the body base in a straight row along the outer-lead axis,
  // then splay to wherever their hole is. That is how a formed TO-92 is built,
  // and it makes the middle lead's bend fall out of the hole position rather
  // than being a constant.
  const axisLength = Math.max(separation, 0.001)
  const axis = {
    x: (last.x - first.x) / axisLength,
    y: (last.y - first.y) / axisLength,
  }
  const exitPitch = separation / 2
  const exitFor = (index: number) => {
    const offset = (index - (leads.length - 1) / 2) * exitPitch
    return {
      x: bodyCenter.x + axis.x * offset,
      y: bodyCenter.y + axis.y * offset,
    }
  }

  const leadSize: [number, number, number] = [
    legThickness,
    legWidth,
    legThickness,
  ]

  return (
    <>
      <Colorize color={bodyColor}>
        <Subtract>
          <Translate
            center={[bodyCenter.x, bodyCenter.y, standoff + bodyHeight / 2]}
          >
            <Cylinder radius={bodyRadius} height={bodyHeight} />
          </Translate>
          <Translate
            center={[
              bodyCenter.x,
              bodyCenter.y - (bodyRadius - flatCut / 2),
              standoff + bodyHeight / 2,
            ]}
          >
            <Cuboid size={[bodyRadius * 2, flatCut, bodyHeight + 0.2]} />
          </Translate>
        </Subtract>
      </Colorize>

      {leads.map((lead, index) => {
        const exit = exitFor(index)
        return (
          <Translate center={[0, 0, 0]} key={`lead-${lead.x}-${lead.y}`}>
            {/* formed section, from the hole up into the body base */}
            <Hull>
              <Translate center={[lead.x, lead.y, 0]}>
                <Cuboid size={leadSize} />
              </Translate>
              <Translate center={[exit.x, exit.y, standoff]}>
                <Cuboid size={leadSize} />
              </Translate>
            </Hull>
            {/* straight section, through the board and below it */}
            <Translate center={[lead.x, lead.y, -leadLength / 2]}>
              <Cuboid size={[legThickness, legWidth, leadLength]} />
            </Translate>
          </Translate>
        )
      })}
    </>
  )
}
