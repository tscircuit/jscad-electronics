import { Cuboid, Cylinder } from "jscad-fiber"

export const PinRow = ({
  numberOfPins,
  pitch = 2.539,
  pinDiameter = 1,
  pinHeight = 8,
}: {
  numberOfPins: number
  pitch?: number
  pinDiameter?: number
  pinHeight?: number
}) => {
  return (
    <>
      {Array.from({ length: numberOfPins }, (_, i) => (
        <>
          <Cuboid
            color="#222"
            size={[pitch * 1.5, pitch * 1.5, 1.5]}
            center={[
              i < numberOfPins / 2
                ? i * pitch + pitch / 2
                : (-i + numberOfPins / 2 - 1) * pitch + pitch / 2,
              0,
              0.75,
            ]}
          />
          <Cylinder
            color="gold"
            height={pinHeight}
            radius={pinDiameter}
            center={[
              i < numberOfPins / 2
                ? i * pitch + pitch / 2
                : (-i + numberOfPins / 2 - 1) * pitch + pitch / 2,
              0,
              0.75,
            ]}
          />
        </>
      ))}
    </>
  )
}
