import {
  Colorize,
  Cuboid,
  Hull,
  Translate,
  Cylinder,
  Subtract,
} from "jscad-fiber"

export const TO92 = () => {
  // === Dimensions (mm) ===
  const bodyRadius = 2.4
  const bodyHeight = 4.5
  const flatCut = 1.1

  const legWidth = 0.4
  const legThickness = 0.25

  const bodyZ = bodyHeight / 2

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
  const leadMidPosB: [number, number, number] = [0, 1.28, -2.72]
  const leadTipPos2: [number, number, number] = [0, 1.28, -8.9]

  const sideLeadZ = -7.5

  return (
    <Translate center={[0, 1, 10.5]}>
      <Colorize color={bodyColor}>
        <Subtract>
          <Translate center={[0, 0, bodyZ]}>
            <Cylinder radius={bodyRadius} height={bodyHeight} />
          </Translate>
          <Translate center={[0, -(bodyRadius - flatCut / 2), bodyZ]}>
            <Cuboid size={[bodyRadius * 2, flatCut, bodyHeight + 0.2]} />
          </Translate>
        </Subtract>
      </Colorize>

      <Translate center={leadTipPos1}>
        <Cuboid size={leadTipSize} />
      </Translate>
      <Hull>
        <Translate center={leadMidPosA}>
          <Cuboid size={leadSmallSize} />
        </Translate>
        <Translate center={leadMidPosB}>
          <Cuboid size={leadSmallSize} />
        </Translate>
      </Hull>
      <Translate center={leadTipPos2}>
        <Cuboid size={[leadLength, legWidth, 12.2]} />
      </Translate>

      <Translate center={[1.3, 0, sideLeadZ]}>
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
      <Translate center={[-1.3, 0, sideLeadZ]}>
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
    </Translate>
  )
}
