import {
  Colorize,
  Cuboid,
  Cylinder,
  Rotate,
  RoundedCuboid,
  Subtract,
  Translate,
} from "jscad-fiber"

export interface RJ45Props {
  /** Width of the shielded connector body in millimetres. */
  bodyWidth?: number
  /** Depth of the shielded connector body in millimetres. */
  bodyDepth?: number
  /** Height of the connector above the PCB in millimetres. */
  bodyHeight?: number
  /** Signed Y offset of the connector body from the signal rows. */
  bodyCenterY?: number
  /** Include the two indicator LEDs and their four through-hole leads. */
  ledPins?: boolean
  /** Mirror the eight signal pins so pin 1 is on the left. */
  firstPinLeft?: boolean
  /** Mirror the eight signal pins so pin 1 is in the top row. */
  firstPinTop?: boolean
  signalPitch?: number
  signalRowPitch?: number
  signalHoleDiameter?: number
  shieldPinX?: number
  shieldPinY?: number
  shieldHoleDiameter?: number
  locatorHoleX?: number
  locatorHoleY?: number
  locatorHoleDiameter?: number
  ledPinX?: number
  ledPinPitch?: number
  ledPinY?: number
  /** Override the inferred direction of the cable opening. */
  openingDirection?: -1 | 1
  shellColor?: string
  housingColor?: string
  contactColor?: string
}

const range = (length: number) => Array.from({ length }, (_, index) => index)

/**
 * Parametric, shielded 8P8C modular jack.
 *
 * The PCB-facing parameters intentionally mirror the `rj45` footprinter
 * function so the model's signal, shield, locator and optional LED leads stay
 * aligned with the generated land pattern.
 */
export const RJ45 = ({
  bodyWidth = 16.26,
  bodyDepth = 15.88,
  bodyHeight = 13.5,
  bodyCenterY = -0.96,
  ledPins = false,
  firstPinLeft = false,
  firstPinTop = false,
  signalPitch = 1.02,
  signalRowPitch = 1.78,
  signalHoleDiameter = 0.9144,
  shieldPinX = 8.13,
  shieldPinY = 0.13,
  shieldHoleDiameter = 1.8,
  locatorHoleX = 6.35,
  locatorHoleY = -3.43,
  locatorHoleDiameter = 3.25,
  ledPinX = 4.57,
  ledPinPitch = 2.29,
  ledPinY = 5.7,
  openingDirection,
  shellColor = "#b7bdc2",
  housingColor = "#20242a",
  contactColor = "#d6a928",
}: RJ45Props) => {
  const frontDirection =
    openingDirection ?? (bodyCenterY > 0 ? (1 as const) : (-1 as const))
  const frontY = bodyCenterY + (frontDirection * bodyDepth) / 2
  const shellThickness = Math.min(0.38, bodyWidth * 0.024)
  const openingWidth = Math.max(bodyWidth - 2.5, bodyWidth * 0.72)
  const openingHeight = Math.min(bodyHeight - 2.4, 9.6)
  const openingCenterZ = 1.3 + openingHeight / 2
  const cavityDepth = Math.min(4.4, bodyDepth * 0.34)
  const cavityCenterY = frontY - (frontDirection * cavityDepth) / 2
  const backWallY =
    frontY - frontDirection * (cavityDepth + shellThickness * 0.7)
  const signalLeadRadius = Math.max(
    0.22,
    Math.min(signalHoleDiameter * 0.36, 0.38),
  )
  const signalPinPositions = range(8).map((index) => {
    const defaultX = (3.5 - index) * signalPitch
    const defaultY = index % 2 === 0 ? -signalRowPitch / 2 : signalRowPitch / 2
    return {
      x: firstPinLeft ? -defaultX : defaultX,
      y: firstPinTop ? -defaultY : defaultY,
    }
  })
  const ledPinPositions = [
    -ledPinX - ledPinPitch,
    -ledPinX,
    ledPinX,
    ledPinX + ledPinPitch,
  ]
  const contactPitch = openingWidth / 10
  const contactY = frontY - frontDirection * Math.max(cavityDepth * 0.48, 1.2)
  const contactZ = openingCenterZ + openingHeight * 0.18
  const frontLipY = frontY + frontDirection * shellThickness * 0.2

  return (
    <>
      <Colorize color={shellColor}>
        <Subtract>
          <RoundedCuboid
            center={[0, bodyCenterY, bodyHeight / 2]}
            size={[bodyWidth, bodyDepth, bodyHeight]}
            roundRadius={Math.min(0.45, bodyWidth * 0.03)}
          />
          <Cuboid
            center={[0, cavityCenterY, openingCenterZ]}
            size={[
              openingWidth,
              cavityDepth + shellThickness * 2,
              openingHeight,
            ]}
          />
        </Subtract>

        <RoundedCuboid
          center={[0, frontLipY, 0.72]}
          size={[openingWidth + 0.5, shellThickness * 1.25, 1.05]}
          roundRadius={0.12}
        />

        {[-1, 1].map((direction) => (
          <RoundedCuboid
            key={`shield-tab:${direction}`}
            center={[direction * shieldPinX, shieldPinY, 0.25]}
            size={[
              Math.max(shieldHoleDiameter * 0.46, 0.65),
              Math.max(shieldHoleDiameter * 0.72, 1.1),
              3.4,
            ]}
            roundRadius={0.12}
          />
        ))}

        {[-1, 1].map((direction) => (
          <RoundedCuboid
            key={`top-seam:${direction}`}
            center={[
              direction * bodyWidth * 0.24,
              bodyCenterY - frontDirection * bodyDepth * 0.08,
              bodyHeight + 0.04,
            ]}
            size={[bodyWidth * 0.22, bodyDepth * 0.42, 0.1]}
            roundRadius={0.04}
          />
        ))}
      </Colorize>

      <Colorize color={housingColor}>
        <Subtract>
          <RoundedCuboid
            center={[0, cavityCenterY, openingCenterZ]}
            size={[
              openingWidth - 0.2,
              cavityDepth + shellThickness * 0.5,
              openingHeight - 0.2,
            ]}
            roundRadius={0.22}
          />
          <Cuboid
            center={[
              0,
              cavityCenterY - frontDirection * shellThickness * 0.2,
              openingCenterZ - 0.05,
            ]}
            size={[
              openingWidth - 1.25,
              cavityDepth + shellThickness,
              openingHeight - 1.35,
            ]}
          />
        </Subtract>

        <Cuboid
          center={[0, backWallY, openingCenterZ]}
          size={[openingWidth - 1.15, shellThickness, openingHeight - 1.25]}
        />

        <RoundedCuboid
          center={[0, frontY - frontDirection * cavityDepth * 0.28, 1.55]}
          size={[openingWidth - 2.6, cavityDepth * 0.5, 1.15]}
          roundRadius={0.16}
        />

        {[-1, 1].map((direction) => (
          <Cylinder
            key={`locator:${direction}`}
            center={[direction * locatorHoleX, locatorHoleY, -0.25]}
            radius={Math.max(locatorHoleDiameter * 0.41, 0.65)}
            height={2.7}
          />
        ))}
      </Colorize>

      <Colorize color={contactColor}>
        {signalPinPositions.map(({ x, y }, index) => (
          <Cylinder
            key={`signal-lead:${index}`}
            center={[x, y, 0.15]}
            radius={signalLeadRadius}
            height={3.1}
          />
        ))}

        {range(8).map((index) => (
          <Translate
            key={`socket-contact:${index}`}
            offset={[
              (index - 3.5) * contactPitch,
              contactY,
              contactZ + (index % 2 === 0 ? 0.03 : -0.03),
            ]}
          >
            <Rotate rotation={[frontDirection * 0.2, 0, 0]}>
              <RoundedCuboid
                size={[Math.max(contactPitch * 0.28, 0.28), 3.25, 0.16]}
                roundRadius={0.05}
              />
            </Rotate>
          </Translate>
        ))}

        {ledPins &&
          ledPinPositions.map((x, index) => (
            <Cylinder
              key={`led-lead:${index}`}
              center={[x, ledPinY, 0.15]}
              radius={signalLeadRadius}
              height={3.1}
            />
          ))}
      </Colorize>

      {ledPins && (
        <>
          <RoundedCuboid
            color="#73b744"
            center={[
              -bodyWidth / 2 + 2.05,
              frontY + frontDirection * shellThickness * 0.35,
              bodyHeight - 2.05,
            ]}
            size={[2.15, shellThickness * 1.55, 1.45]}
            roundRadius={0.18}
          />
          <RoundedCuboid
            color="#e0aa35"
            center={[
              bodyWidth / 2 - 2.05,
              frontY + frontDirection * shellThickness * 0.35,
              bodyHeight - 2.05,
            ]}
            size={[2.15, shellThickness * 1.55, 1.45]}
            roundRadius={0.18}
          />
        </>
      )}
    </>
  )
}

export default RJ45
