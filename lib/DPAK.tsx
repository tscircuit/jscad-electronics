import { Colorize, Cuboid, Hull, Translate } from "jscad-fiber"

export interface DPAKProps {
  /** X extent of the moulded body (the lead-to-tab axis) */
  bodyWidth?: number
  /** Y extent of the moulded body (across the leads) */
  bodyLength?: number
  /** Height of the moulded body above the board */
  bodyHeight?: number
  /** X extent of the exposed metal tab (the drain/collector pad) */
  tabWidth?: number
  /** Y extent of the exposed metal tab */
  tabLength?: number
  /** Distance between the lead pad centres and the tab pad centre */
  span?: number
  /** Lead pitch along Y */
  pitch?: number
  /** Y width of one lead */
  leadWidth?: number
  /** X length of the lead's flat pad contact */
  leadContactLength?: number
  /**
   * TO-252 (DPAK) and TO-263 (D2PAK) differ only in size, so one body serves
   * both — pass the dimensions footprinter reports for the specific package.
   */
  color?: string
  tabColor?: string
  leadColor?: string
}

/**
 * TO-252 (DPAK) / TO-263 (D2PAK): a moulded body sitting on a large exposed
 * metal tab, with gull leads leaving the opposite face.
 *
 * The footprint is asymmetric — footprinter puts the lead pads at -span/2 and
 * the tab pad at +span/2 — so the body is placed over the tab rather than over
 * the origin. Getting that wrong moves a 4.4mm-tall part several millimetres,
 * which is exactly the error an enclosure clearance check cannot see.
 */
export const DPAK = ({
  bodyWidth = 6.1,
  bodyLength = 6.5,
  bodyHeight = 2.3,
  tabWidth = 6.2,
  tabLength = 5.8,
  span = 6.85,
  pitch = 2.29,
  leadWidth = 0.9,
  leadContactLength = 1.5,
  color = "#222",
  tabColor = "#cccccc",
  leadColor = "#cccccc",
}: DPAKProps) => {
  const tabThickness = 0.5
  const tabCenterX = span / 2
  const leadPadX = -span / 2
  // The plastic covers the tab except for a strip at the far end.
  const bodyCenterX = tabCenterX + (tabWidth - bodyWidth) / 2
  const bodyFrontX = bodyCenterX - bodyWidth / 2
  const leadZ = tabThickness / 2
  const leadThickness = 0.4

  return (
    <>
      <Colorize color={tabColor}>
        <Cuboid
          size={[tabWidth, tabLength, tabThickness]}
          center={[tabCenterX, 0, tabThickness / 2]}
        />
      </Colorize>

      <Colorize color={color}>
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[bodyCenterX, 0, tabThickness + bodyHeight / 2]}
        />
      </Colorize>

      {[-1, 1].map((side) => {
        return (
          <Colorize color={leadColor} key={`lead-${side}`}>
            {/* flat pad contact */}
            <Cuboid
              size={[leadContactLength, leadWidth, leadThickness]}
              center={[
                leadPadX + leadContactLength / 2,
                side * pitch,
                leadThickness / 2,
              ]}
            />
            {/* the run from the pad up into the body face */}
            <Hull>
              <Cuboid
                size={[0.1, leadWidth, leadThickness]}
                center={[
                  leadPadX + leadContactLength,
                  side * pitch,
                  leadThickness / 2,
                ]}
              />
              <Cuboid
                size={[0.1, leadWidth, leadThickness]}
                center={[bodyFrontX, side * pitch, leadZ + tabThickness / 2]}
              />
            </Hull>
          </Colorize>
        )
      })}
    </>
  )
}

export default DPAK
