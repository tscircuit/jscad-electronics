import { Cuboid, Cylinder, RoundedCuboid } from "jscad-fiber"

export interface SmdPushButtonProps {
  padPitchX?: number
  padPitchY?: number
  padWidth?: number
  padHeight?: number
}

export const SmdPushButton = ({
  padPitchX = 4.2,
  padPitchY = 2.15,
  padWidth = 1.05,
  padHeight = 0.7,
}: SmdPushButtonProps) => {
  const bodyWidth = Math.max(padPitchX - padWidth, 2)
  const bodyLength = Math.max(padPitchY + padHeight - 0.25, 1.8)
  const terminalLength = Math.max((padPitchX + padWidth - bodyWidth) / 2, 0.35)
  const terminalX = bodyWidth / 2 + terminalLength / 2
  const terminalHeight = 0.1
  const frameHeight = 0.28
  const housingHeight = 0.48
  const actuatorHeight = 0.32

  return (
    <>
      {[-1, 1].flatMap((xDirection) =>
        [-1, 1].map((yDirection) => (
          <Cuboid
            key={`${xDirection}:${yDirection}`}
            color="#b9babc"
            center={[
              xDirection * terminalX,
              yDirection * (padPitchY / 2),
              terminalHeight / 2,
            ]}
            size={[
              terminalLength,
              Math.max(padHeight * 0.78, 0.3),
              terminalHeight,
            ]}
          />
        )),
      )}
      <RoundedCuboid
        color="#b9babc"
        center={[0, 0, frameHeight / 2]}
        size={[bodyWidth, bodyLength, frameHeight]}
        roundRadius={0.12}
      />
      <RoundedCuboid
        color="#202226"
        center={[0, 0, frameHeight + housingHeight / 2]}
        size={[bodyWidth - 0.28, bodyLength - 0.28, housingHeight]}
        roundRadius={0.18}
      />
      <Cylinder
        color="#d7d8d9"
        center={[0, 0, frameHeight + housingHeight + actuatorHeight / 2]}
        height={actuatorHeight}
        radius={Math.min(bodyWidth, bodyLength) * 0.28}
      />
      <Cylinder
        color="#34363a"
        center={[
          -bodyWidth * 0.33,
          bodyLength * 0.3,
          frameHeight + housingHeight + 0.012,
        ]}
        height={0.024}
        radius={Math.min(bodyWidth, bodyLength) * 0.035}
      />
    </>
  )
}
