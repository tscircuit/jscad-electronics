import { Colorize, Cuboid, RoundedCuboid, Subtract } from "jscad-fiber"

export interface UsbCMidMountProps {
  split?: boolean
  reverse?: boolean
  rowY?: number
  padHeight?: number
  signalPadWidth?: number
  powerPadWidth?: number
  powerX?: number
  shellX?: number
  topY?: number
  bottomY?: number
  topHoleWidth?: number
  topHoleHeight?: number
  topRing?: number
  bottomHoleWidth?: number
  bottomHoleHeight?: number
  bottomRing?: number
  bodyBottom?: number
}

export const UsbCMidMount = ({
  split = false,
  reverse = false,
  rowY = 2.125,
  padHeight = 1.1,
  signalPadWidth = 0.3,
  powerPadWidth = 0.55,
  powerX = 3.2,
  shellX = 4.325,
  topY = 1.575,
  bottomY = 2.625,
  topHoleWidth = 0.6,
  topHoleHeight = 1.5,
  topRing = 0.25,
  bottomHoleWidth = 0.6,
  bottomHoleHeight = 1.2,
  bottomRing = 0.3,
  bodyBottom = 5.225,
}: UsbCMidMountProps) => {
  const innerPowerX = powerX - 0.8
  const mergedSignalXs = [
    -powerX,
    -innerPowerX,
    -1.75,
    -1.25,
    -0.75,
    -0.25,
    0.25,
    0.75,
    1.25,
    1.75,
    innerPowerX,
    powerX,
  ]
  const splitSignalXs = [
    -3.35, -3.05, -2.55, -2.25, -1.75, -1.25, -0.75, -0.25, 0.25, 0.75, 1.25,
    1.75, 2.25, 2.55, 3.05, 3.35,
  ]
  const leftToRightSignalXs = split ? splitSignalXs : mergedSignalXs
  const signalXs = reverse
    ? leftToRightSignalXs.slice().reverse()
    : leftToRightSignalXs.slice()
  const signalWidths = signalXs.map((_, index) =>
    split || (index >= 2 && index < signalXs.length - 2)
      ? signalPadWidth
      : powerPadWidth,
  )
  const rearY = rowY + padHeight / 2
  const frontY = -bodyBottom
  const bodyDepth = rearY - frontY
  const bodyCenterY = (rearY + frontY) / 2
  const outerWidth = shellX * 2 - 0.1
  const outerHeight = 2.5
  const bodyCenterZ = 0.25
  const innerWidth = Math.max(outerWidth - 0.85, 5)
  const innerHeight = outerHeight - 0.65
  const shellThickness = 0.22
  const tongueWidth = Math.min(innerWidth - 0.45, 6.6)
  const tongueDepth = bodyDepth * 0.72
  const tongueCenterY = frontY + tongueDepth / 2 + 0.35
  const tongueZ = bodyCenterZ - 0.12
  const innerContactLength = tongueDepth * 0.58
  const innerContactY = frontY + innerContactLength / 2 + 0.55
  const shellTabs = [
    {
      x: -shellX,
      y: topY,
      width: topHoleWidth + 2 * topRing,
      length: topHoleHeight + 2 * topRing,
    },
    {
      x: shellX,
      y: topY,
      width: topHoleWidth + 2 * topRing,
      length: topHoleHeight + 2 * topRing,
    },
    {
      x: -shellX,
      y: -bottomY,
      width: bottomHoleWidth + 2 * bottomRing,
      length: bottomHoleHeight + 2 * bottomRing,
    },
    {
      x: shellX,
      y: -bottomY,
      width: bottomHoleWidth + 2 * bottomRing,
      length: bottomHoleHeight + 2 * bottomRing,
    },
  ]

  return (
    <>
      {shellTabs.map((tab, index) => (
        <Cuboid
          key={index}
          color="#aeb1b4"
          center={[tab.x, tab.y, 0]}
          size={[tab.width, tab.length, 0.18]}
        />
      ))}
      {signalXs.map((x, index) => (
        <Cuboid
          key={`lead:${index}`}
          color="#c8a84e"
          center={[x, rowY, 0.04]}
          size={[signalWidths[index]!, padHeight, 0.08]}
        />
      ))}
      <Colorize color="#b8bbbd">
        <Subtract>
          <RoundedCuboid
            center={[0, bodyCenterY, bodyCenterZ]}
            size={[outerWidth, bodyDepth, outerHeight]}
            roundRadius={0.45}
          />
          <RoundedCuboid
            center={[0, bodyCenterY - shellThickness, bodyCenterZ]}
            size={[innerWidth, bodyDepth - shellThickness, innerHeight]}
            roundRadius={0.32}
          />
        </Subtract>
      </Colorize>
      <RoundedCuboid
        color="#242629"
        center={[0, tongueCenterY, tongueZ]}
        size={[tongueWidth, tongueDepth, 0.42]}
        roundRadius={0.14}
      />
      {signalXs.map((x, index) => (
        <Cuboid
          key={`contact:${index}`}
          color="#d2af4f"
          center={[x * 0.88, innerContactY, tongueZ + 0.225]}
          size={[
            Math.max(signalWidths[index]! * 0.62, 0.11),
            innerContactLength,
            0.03,
          ]}
        />
      ))}
    </>
  )
}
