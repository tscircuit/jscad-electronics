import { Colorize, Cuboid, Hull, Translate } from "jscad-fiber"

export const TO92S = () => {
  // === Dimensions (mm) ===
  const bodyRadius = 3.9 // D
  const bodyHeight = 3.05 // E
  const flatCut = 1.42 // A

  const legWidth = 0.33 // b
  const legThickness = 0.33 // c

  const bodyZ = bodyHeight / 2

  const bodyColor = "#222"
  const leadLength = 0.43 // L1
  const leadTipSize: [number, number, number] = [leadLength, legWidth, 1.32]
  const leadSmallSize: [number, number, number] = [
    leadLength,
    legWidth,
    legThickness,
  ]

  const leadTipPos1: [number, number, number] = [0, 0, -0.66]
  const leadMidPosA: [number, number, number] = [0, 0, -1.32]
  const leadMidPosB: [number, number, number] = [0, 0, -2.72]
  const leadTipPos2: [number, number, number] = [0, 0, -8.9]

  const sideLeadZ = -7.5
  return (
    <Translate center={[0, 1, 10.5]}>
      <Colorize color={bodyColor}>
        <Translate center={[0, 0, bodyZ]}>
          <Cuboid size={[bodyRadius * 2, flatCut, bodyHeight]} />
        </Translate>
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

      <Translate center={[1.24, 0, sideLeadZ]}>
        {" "}
        {/* Pad 3 - Right */}
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
      <Translate center={[-1.24, 0, sideLeadZ]}>
        {" "}
        {/* Pad 2 - Left */}
        <Cuboid size={[leadLength, legWidth, 15]} />
      </Translate>
    </Translate>
  )
}
