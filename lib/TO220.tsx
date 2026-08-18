import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  Subtract,
  Translate,
} from "jscad-fiber"

export interface TO220Lead {
  x: number
  y: number
}

export interface TO220Props {
  /**
   * TO-220F is the fully-moulded (isolated) variant: same outline, but the
   * metal tab is encapsulated rather than exposed. Aliasing the two would
   * report a bare metal face where there is plastic — which matters as soon
   * as anything reasons about the tab, so it is a flag rather than an alias.
   */
  mouldedTab?: boolean
  /** Where the leads meet the board, from the footprint's plated holes. */
  leads?: TO220Lead[]
  /** Width across the package (X). */
  bodyWidth?: number
  /** Thickness of the moulded body (Y). */
  bodyThickness?: number
  /** Height of the moulded body above its own base. */
  bodyHeight?: number
  /** How much metal tab stands above the moulded body. */
  tabHeight?: number
  tabThickness?: number
  mountingHoleDiameter?: number
  /** Gap between the board and the underside of the body. */
  standoff?: number
  /** How far the leads run below the board. */
  leadLength?: number
  bodyColor?: string
  tabColor?: string
  leadColor?: string
}

const TO220_DEFAULT_LEADS: TO220Lead[] = [
  { x: -2.54, y: -1 },
  { x: 0, y: -1 },
  { x: 2.54, y: -1 },
]

/**
 * TO-220, mounted upright.
 *
 * Authored standing up, in board coordinates, rather than lying down and
 * rotated into place. The rotations it used to carry were bare numbers
 * (`rotation={[0, 55, -55]}`), which both renderers read as RADIANS: 55 rad is
 * 271.3°, so the part stood up only because 271.3° is nearly -90°, and it
 * leaned 1.3° off vertical. With 16mm leads it also measured 32.5mm tall for a
 * part that is 18mm over the board, and the holes met the leads at their tips
 * instead of just under the body.
 */
export const TO220 = ({
  mouldedTab = false,
  leads = TO220_DEFAULT_LEADS,
  bodyWidth = 10,
  bodyThickness = 4.5,
  bodyHeight = 9.2,
  tabHeight = 6.4,
  tabThickness = 1.4,
  mountingHoleDiameter = 3.6,
  standoff = 3,
  leadLength = 3,
  bodyColor = "#222",
  tabColor = "#ccc",
  leadColor = "#d4b106",
}: TO220Props = {}) => {
  const centerX = leads.reduce((sum, lead) => sum + lead.x, 0) / leads.length
  const centerY = leads.reduce((sum, lead) => sum + lead.y, 0) / leads.length

  const bodyBottom = standoff
  const bodyTop = bodyBottom + bodyHeight
  const tabTop = bodyTop + tabHeight
  // The tab is flush with the back face of the moulding.
  const tabY = centerY + (bodyThickness - tabThickness) / 2
  const holeZ = tabTop - Math.max(mountingHoleDiameter * 0.8, 2.6)

  const leadWidth = 0.8
  const leadThickness = 0.5

  return (
    <>
      <Colorize color={bodyColor}>
        <Cuboid
          size={[bodyWidth, bodyThickness, bodyHeight]}
          center={[centerX, centerY, bodyBottom + bodyHeight / 2]}
        />
      </Colorize>

      {/* The tab, with its mounting hole. A moulded (TO-220F) part has the
          same outline in plastic. */}
      <Colorize color={mouldedTab ? bodyColor : tabColor}>
        <Subtract>
          <Cuboid
            size={[bodyWidth, tabThickness, tabHeight]}
            center={[centerX, tabY, bodyTop + tabHeight / 2]}
          />
          {/* Cylinder is Z-axis only in lib/vanilla, and a `rotation` prop on
              a primitive is IGNORED there — so the hole has to be turned by a
              <Rotate> wrapper, which both renderers honour. */}
          <Rotate rotation={["90deg", 0, 0]}>
            <Translate center={[centerX, holeZ, -tabY]}>
              <Cylinder
                radius={mountingHoleDiameter / 2}
                height={tabThickness * 3}
              />
            </Translate>
          </Rotate>
        </Subtract>
      </Colorize>

      {leads.map((lead) => (
        <Colorize color={leadColor} key={`lead-${lead.x}-${lead.y}`}>
          <Cuboid
            size={[leadWidth, leadThickness, standoff + leadLength]}
            center={[lead.x, lead.y, (standoff - leadLength) / 2]}
          />
        </Colorize>
      ))}
    </>
  )
}
