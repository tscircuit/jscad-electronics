import { Colorize, Cuboid, Hull, Translate } from "jscad-fiber"

export interface SmdPinHeaderProps {
  numberOfPins: number
  pitch?: number
  pinThickness?: number
  bodyWidth?: number
  bodyHeight?: number
  standoffHeight?: number
  matingPinLength?: number
  tailSpan?: number
}

export const SmdPinHeader = ({
  numberOfPins,
  pitch = 2.54,
  pinThickness = 0.64,
  bodyWidth = 2.5,
  bodyHeight = 2.54,
  standoffHeight = 1.27,
  matingPinLength = 5.8,
  tailSpan = 5.08,
}: SmdPinHeaderProps) => {
  const xStart = -((numberOfPins - 1) * pitch) / 2
  const bodyTop = standoffHeight + bodyHeight
  const tailLength = tailSpan / 2
  const tipChamferHeight = pinThickness * 0.35

  return (
    <>
      {Array.from({ length: numberOfPins }, (_, index) => {
        const x = xStart + index * pitch
        const tailDirection = index % 2 === 0 ? 1 : -1
        const postBodyLength = matingPinLength - tipChamferHeight
        const verticalTailLength = standoffHeight - pinThickness / 2

        return (
          <Translate key={index} x={x}>
            <Cuboid
              color="#222"
              size={[pitch, bodyWidth, bodyHeight]}
              center={[0, 0, standoffHeight + bodyHeight / 2]}
            />
            <Colorize color="#d4af37">
              <Cuboid
                size={[pinThickness, tailLength, pinThickness]}
                center={[0, tailDirection * (tailLength / 2), pinThickness / 2]}
              />
              <Cuboid
                size={[pinThickness, pinThickness, verticalTailLength]}
                center={[0, 0, pinThickness / 2 + verticalTailLength / 2]}
              />
              <Cuboid
                size={[pinThickness, pinThickness, postBodyLength]}
                center={[0, 0, bodyTop + postBodyLength / 2]}
              />
              <Hull>
                <Cuboid
                  size={[pinThickness, pinThickness, 0.01]}
                  center={[0, 0, bodyTop + postBodyLength]}
                />
                <Cuboid
                  size={[pinThickness * 0.65, pinThickness * 0.65, 0.01]}
                  center={[0, 0, bodyTop + matingPinLength]}
                />
              </Hull>
            </Colorize>
          </Translate>
        )
      })}
    </>
  )
}
