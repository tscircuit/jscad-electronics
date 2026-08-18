import {
  Colorize,
  Cuboid,
  Cylinder,
  RoundedCylinder,
  Subtract,
} from "jscad-fiber"

export interface ElectrolyticCapacitorProps {
  /** Can diameter. footprinter reports this as `d` for `electrolytic`. */
  diameter?: number
  /**
   * Can height. Not part of any footprint: the same 10mm can is made in a
   * dozen heights. Defaults to `heightToDiameterRatio * diameter`, which for
   * the common radial series is a slight OVER-estimate — for a clearance
   * check that is the safe direction to be wrong in.
   */
  height?: number
  heightToDiameterRatio?: number
  /** Lead pitch (footprinter's `p`). */
  leadPitch?: number
  leadDiameter?: number
  /** How far the leads run below the board. */
  leadLength?: number
  sleeveColor?: string
  baseColor?: string
}

/**
 * Radial (can) electrolytic capacitor: the part an enclosure cavity is usually
 * sized around, and until now one with no body at all.
 *
 * Only the diameter and the lead pitch come from the footprint. The height is
 * derived, and deliberately generous — see `heightToDiameterRatio`.
 */
export const ElectrolyticCapacitor = ({
  diameter = 6.3,
  heightToDiameterRatio = 1.4,
  height = diameter * heightToDiameterRatio,
  leadPitch = 2.5,
  leadDiameter = 0.6,
  leadLength = 3,
  sleeveColor = "#1b2a6b",
  baseColor = "#1a1a1a",
}: ElectrolyticCapacitorProps) => {
  const radius = diameter / 2
  const baseHeight = Math.min(1, diameter * 0.12)
  const canHeight = Math.max(height - baseHeight, 0.1)
  const canBottom = baseHeight
  const canTop = canBottom + canHeight
  // The pressure-relief score on the top face: two crossed grooves.
  const grooveWidth = Math.max(diameter * 0.06, 0.2)
  const grooveDepth = 0.3

  return (
    <>
      {/* rubber bung / base. Slightly narrower than the can: coincident side
          faces render as z-fighting moiré, not as a join. */}
      <Colorize color={baseColor}>
        <Cylinder
          radius={radius - 0.05}
          height={baseHeight}
          center={[0, 0, baseHeight / 2]}
        />
      </Colorize>

      {/* aluminium can with its sleeve */}
      <Colorize color={sleeveColor}>
        <Subtract>
          <RoundedCylinder
            radius={radius}
            height={canHeight}
            roundRadius={Math.min(0.3, radius * 0.15)}
            center={[0, 0, canBottom + canHeight / 2]}
          />
          <Cuboid
            size={[diameter, grooveWidth, grooveDepth * 2]}
            center={[0, 0, canTop]}
          />
          <Cuboid
            size={[grooveWidth, diameter, grooveDepth * 2]}
            center={[0, 0, canTop]}
          />
        </Subtract>
      </Colorize>

      {[-1, 1].map((side) => (
        <Colorize color="#c0c0c0" key={`lead-${side}`}>
          <Cylinder
            radius={leadDiameter / 2}
            height={leadLength + baseHeight}
            center={[(side * leadPitch) / 2, 0, (baseHeight - leadLength) / 2]}
          />
        </Colorize>
      ))}
    </>
  )
}

export default ElectrolyticCapacitor
