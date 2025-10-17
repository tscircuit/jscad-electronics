import { Cuboid, Cylinder, Subtract, Union } from "jscad-fiber"
import type { FC } from "react"

interface SMAProps {
  bodyLength?: number
  bodyDiameter?: number
  threadLength?: number
  threadDiameter?: number
  pinLength?: number
  pinDiameter?: number
  legWidth?: number
  legHeight?: number
  legDepth?: number
}

export const SMA: FC<SMAProps> = ({
  bodyLength = 10,
  bodyDiameter = 6,
  threadLength = 5,
  threadDiameter = 5,
  pinLength = 17,
  pinDiameter = 1,
  legWidth = 1,
  legHeight = 1,
  legDepth = 2,
}) => {
  const body = (
    <Cylinder
      height={bodyLength}
      radius={bodyDiameter / 2}
      center={{ x: 0, y: 0, z: bodyLength / 2 }}
    />
  )

  const thread = (
    <Cylinder
      height={threadLength}
      radius={threadDiameter / 2}
      center={{ x: 0, y: 0, z: bodyLength + threadLength / 2 }}
    />
  )

  const pin = (
    <Cylinder
      height={pinLength}
      radius={pinDiameter / 2}
      center={{ x: 0, y: 0, z: 7.5 }}
    />
  )

  const leg = (
    <Cuboid
      size={[legWidth, legDepth, legHeight]}
      center={{ x: 0, y: 0, z: 0 }}
    />
  )

  const legs = (
    <>
      <Union>
        <Cuboid
          size={[legWidth, legDepth, legHeight]}
          center={{
            x: bodyDiameter / 2 + legWidth / 2,
            y: 0,
            z: legHeight / 2,
          }}
        />
        <Cuboid
          size={[legWidth, legDepth, legHeight]}
          center={{
            x: -(bodyDiameter / 2 + legWidth / 2),
            y: 0,
            z: legHeight / 2,
          }}
        />
        <Cuboid
          size={[legDepth, legWidth, legHeight]}
          center={{
            x: 0,
            y: bodyDiameter / 2 + legWidth / 2,
            z: legHeight / 2,
          }}
        />
        <Cuboid
          size={[legDepth, legWidth, legHeight]}
          center={{
            x: 0,
            y: -(bodyDiameter / 2 + legWidth / 2),
            z: legHeight / 2,
          }}
        />
      </Union>
    </>
  )

  return (
    <Union>
      {body}
      {thread}
      {pin}
      {legs}
    </Union>
  )
}
