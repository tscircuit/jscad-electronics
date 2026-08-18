import { Colorize, Cuboid, Cylinder, Subtract } from "jscad-fiber"

export interface PotentiometerLead {
  x: number
  y: number
}

export interface PotentiometerProps {
  /** X extent of the body (footprinter's `w`). */
  bodyWidth?: number
  /** Y extent of the body (footprinter's `ca`). */
  bodyLength?: number
  /** Height of the body above the board (footprinter's `h`). */
  bodyHeight?: number
  /** X offset of the body centre from the footprint origin. */
  bodyCenterX?: number
  /** Diameter of the adjuster on the top face. */
  adjusterDiameter?: number
  /**
   * A panel-mount pot's shaft. Zero by default and on purpose: the footprint
   * carries no shaft dimension, and inventing one would make an enclosure
   * cut a hole for a part that has no shaft, or clear a volume it does not
   * need. Pass it explicitly for a panel pot.
   */
  shaftDiameter?: number
  shaftHeight?: number
  /**
   * Where the pins meet the board, from the footprint's plated holes. A
   * through-hole part with no pins at all is not a body anyone can check
   * against its footprint — it just floats over three empty holes.
   */
  leads?: PotentiometerLead[]
  /** Diameter of a pin, and how far it runs below the board. */
  leadDiameter?: number
  leadLength?: number
  bodyColor?: string
  adjusterColor?: string
}

/**
 * Trimmer / potentiometer body.
 *
 * The extent comes from the footprint: `w` across, `ca` along, `h` tall. What
 * the footprint cannot tell us is the shaft, so there is none unless asked
 * for — see `shaftHeight`.
 *
 * Name: `core` also exports a `Potentiometer`, and that one is a circuit
 * element (a React component with ports and a footprint). This is a JSCAD
 * solid with no electrical meaning, and it is named for the package the way
 * every other body in this directory is (`PushButton`, `RJ45`, `Crystal`,
 * which shadow core the same way). Renaming it would break that convention to
 * avoid a collision that cannot occur: nothing imports both.
 */
export const Potentiometer = ({
  bodyWidth = 5.35,
  bodyLength = 14,
  bodyHeight = 4,
  bodyCenterX = bodyWidth / 2,
  adjusterDiameter = Math.min(bodyWidth, bodyLength) * 0.55,
  shaftDiameter = 0,
  shaftHeight = 0,
  leads = [],
  leadDiameter = 0.6,
  leadLength = 3,
  bodyColor = "#1f4fa3",
  adjusterColor = "#d8d8d8",
}: PotentiometerProps) => {
  const adjusterHeight = 0.8
  const adjusterZ = bodyHeight + adjusterHeight / 2
  const slotWidth = Math.max(adjusterDiameter * 0.16, 0.3)

  return (
    <>
      <Colorize color={bodyColor}>
        <Cuboid
          size={[bodyWidth, bodyLength, bodyHeight]}
          center={[bodyCenterX, 0, bodyHeight / 2]}
        />
      </Colorize>

      {/* screwdriver adjuster, slot cut into it */}
      <Colorize color={adjusterColor}>
        <Subtract>
          <Cylinder
            radius={adjusterDiameter / 2}
            height={adjusterHeight}
            center={[bodyCenterX, 0, adjusterZ]}
          />
          <Cuboid
            size={[adjusterDiameter, slotWidth, adjusterHeight * 0.6]}
            center={[bodyCenterX, 0, adjusterZ + adjusterHeight / 2]}
          />
        </Subtract>
      </Colorize>

      {shaftHeight > 0 && shaftDiameter > 0 ? (
        <Colorize color={adjusterColor}>
          <Cylinder
            radius={shaftDiameter / 2}
            height={shaftHeight}
            center={[bodyCenterX, 0, bodyHeight + shaftHeight / 2]}
          />
        </Colorize>
      ) : null}

      {leads.map((lead) => (
        <Colorize color="#c0c0c0" key={`lead-${lead.x}-${lead.y}`}>
          <Cylinder
            radius={leadDiameter / 2}
            height={bodyHeight / 2 + leadLength}
            center={[lead.x, lead.y, (bodyHeight / 2 - leadLength) / 2]}
          />
        </Colorize>
      ))}
    </>
  )
}

export default Potentiometer
