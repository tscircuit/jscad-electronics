import {
  Colorize,
  Cuboid,
  Cylinder,
  Hull,
  Subtract,
  Translate,
  Union,
} from "jscad-fiber"

export const TO92 = () => {
  // === Dimensions (mm) ===
  const bodyRadius = 2.25
  const bodyHeight = 4.5

  const legWidth = 0.4
  const legThickness = 0.25

  const pinPitch = 1.27
  const sideLeadY = 2.25 - pinPitch
  const bodyZ = bodyHeight / 2
  const bodyWidth = bodyRadius * 2
  const bodyTopCenterY = bodyRadius

  const bodyColor = "#222"
  const leadLength = 0.43
  const leadTipSize: [number, number, number] = [leadLength, legWidth, 1.32]
  const leadSmallSize: [number, number, number] = [
    leadLength,
    legWidth,
    legThickness,
  ]

  const leadTipPos1: [number, number, number] = [0, 0, -0.66]
  const leadMidPosA: [number, number, number] = [0, 0, -1.32]
  const leadMidPosB: [number, number, number] = [0, pinPitch, -2.72]
  const leadTipPos2: [number, number, number] = [0, pinPitch, -8.9]

  const sideLeadZ = -7.5

  return (
    <Translate center={[0, 0, 10.5]}>
      <Colorize color={bodyColor}>
        {/* Match footprinter's TO92 D outline: flat side at y=0, round top at y=4.5. */}
        <Union>
          <Cuboid
            size={[bodyWidth, bodyRadius, bodyHeight]}
            center={[0, bodyRadius / 2, bodyZ]}
          />
          {/* Cut the lower half from a cylinder to leave the semicircular top. */}
          <Subtract>
            <Translate center={[0, bodyTopCenterY, bodyZ]}>
              <Cylinder radius={bodyRadius} height={bodyHeight} />
            </Translate>
            <Cuboid
              size={[bodyWidth + 0.2, bodyRadius * 2, bodyHeight + 0.2]}
              center={[0, bodyTopCenterY - bodyRadius, bodyZ]}
            />
          </Subtract>
        </Union>
      </Colorize>

      <Translate center={[leadTipPos1[0], sideLeadY, leadTipPos1[2]]}>
        <Cuboid size={leadTipSize} />
      </Translate>
      <Hull>
        <Translate center={[leadMidPosA[0], sideLeadY, leadMidPosA[2]]}>
          <Cuboid size={leadSmallSize} />
        </Translate>
        <Translate
          center={[leadMidPosB[0], sideLeadY + pinPitch, leadMidPosB[2]]}
        >
          <Cuboid size={leadSmallSize} />
        </Translate>
      </Hull>
      <Translate
        center={[leadTipPos2[0], sideLeadY + pinPitch, leadTipPos2[2]]}
      >
        <Cuboid size={[leadLength, legWidth, 12.2]} />
      </Translate>

      <Translate center={[pinPitch, sideLeadY, sideLeadZ]}>
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
      <Translate center={[-pinPitch, sideLeadY, sideLeadZ]}>
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
    </Translate>
  )
}
