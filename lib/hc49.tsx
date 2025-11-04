import { Colorize, Cylinder, Hull, RoundedCylinder } from "jscad-fiber"

export interface HC49Props {
  /** overall body length (mm) */
  bodyLength?: number
  /** body width (mm) */
  bodyWidth?: number
  /** body height (mm) */
  bodyHeight?: number
  /** distance between lead centers (mm) */
  leadSpacing?: number
  /** lead diameter (mm) */
  leadDiameter?: number
  /** length of the lead below the body (mm) */
  leadLength?: number
  color?: string
  leadColor?: string
}

/**
 * HC-49 (through-hole crystal) simplified 3D model.
 * Defaults chosen to match the HC-49/U-S recommended land pattern and dimensions.
 */
export const HC49 = ({
  bodyLength = 10.2,
  bodyWidth = 4.65,
  bodyHeight = 13.46,
  leadSpacing = 5,
  leadDiameter = 0.8,
  leadLength = 12.7,
  color = "#ddd",
  leadColor = "#b87333",
}: HC49Props) => {
  // positions and sizes
  const halfLength = bodyLength / 2

  // build a capsule-like body by hullling two cylinders (circular ends) across the X axis
  const endRadius = bodyWidth / 2
  const endCenterX = halfLength - endRadius
  // center X for the through-hole leads (distance between centers = leadSpacing)
  const leadCenterX = leadSpacing / 2
  const baseHeight = 0.85

  return (
    <>
      <Colorize color={color}>
        <Hull>
          <RoundedCylinder
            height={bodyHeight}
            roundRadius={0.5}
            radius={endRadius}
            center={[-endCenterX, 0, bodyHeight]}
          />
          <RoundedCylinder
            height={bodyHeight}
            roundRadius={0.5}
            radius={endRadius}
            center={[endCenterX, 0, bodyHeight]}
          />
        </Hull>
        <Hull>
          <RoundedCylinder
            height={baseHeight}
            roundRadius={0.1}
            radius={endRadius + 0.85}
            center={[-endCenterX, 0, bodyHeight / 2 + baseHeight / 2]}
          />
          <RoundedCylinder
            height={baseHeight}
            roundRadius={0.1}
            radius={endRadius + 0.85}
            center={[endCenterX, 0, bodyHeight / 2 + baseHeight / 2]}
          />
        </Hull>
      </Colorize>

      {/* leads (through-hole) - cylinders oriented along Z, extending below the body */}
      <Colorize color={leadColor}>
        <Cylinder
          height={leadLength + bodyHeight / 2}
          radius={leadDiameter / 2}
          center={[-leadCenterX + 0.06, 0, -(leadLength / 2) + bodyHeight / 2]}
        />
        <Cylinder
          height={leadLength + bodyHeight / 2}
          radius={leadDiameter / 2}
          center={[leadCenterX - 0.06, 0, -(leadLength / 2) + bodyHeight / 2]}
        />
      </Colorize>
    </>
  )
}

export default HC49
