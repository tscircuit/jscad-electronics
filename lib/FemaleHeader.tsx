import { Cuboid, Colorize, Hull, Subtract } from "jscad-fiber"

export const FemaleHeader = ({
  numberOfPins,
  pitch = 2.54,
  legsLength = 3,
}: {
  numberOfPins: number
  pitch?: number
  legsLength?: number
}) => {
  const pinThickness = 0.63
  const bodyHeight = 5
  const bodyWidth = numberOfPins * pitch
  const gapWidth = pinThickness * 1.6
  const xoff = -((numberOfPins - 1) / 2) * pitch
  const Body = (
    <Colorize color="#1a1a1a">
    <Subtract>
       <Cuboid
        color="#000"
        size={[bodyWidth, pinThickness * 3, bodyHeight]}
        center={[0, 0, bodyHeight / 2]}
      />
     {Array.from({ length: numberOfPins }, (_, i) => (
          <Cuboid
            size={[gapWidth, gapWidth, bodyHeight]}
            center={[xoff + i * pitch, 0, (bodyHeight/2) ]}
          />
      ))}
    </Subtract>
    </Colorize>
  )
  return (
    <>
        {Body}
      {Array.from({ length: numberOfPins }, (_, i) => (
        <>
          {/*Long pins (bottom) */}
          <Colorize color="silver">
            <Hull>
              <Cuboid
                color="silver"
                size={[pinThickness, pinThickness, legsLength * 0.9]}
                center={[xoff + i * pitch, 0, (-legsLength / 2) * 0.9]}
              />
              <Cuboid
                color="silver"
                size={[
                  pinThickness / 1.8,
                  pinThickness / 1.8,
                  legsLength,
                ]}
                center={[xoff + i * pitch, 0, -legsLength / 2]}
              />
             
            </Hull>
            <Cuboid
                color="silver"
                size={[gapWidth, gapWidth, gapWidth * 0.5]}
                center={[xoff + i * pitch, 0, (gapWidth / 2) * 0.5]}
              />
          </Colorize>
        </>
      ))}
    </>
  )
}
