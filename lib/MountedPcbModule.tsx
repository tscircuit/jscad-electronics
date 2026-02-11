import { Colorize, Cuboid, Cylinder, Subtract } from "jscad-fiber"
import { PinHeader } from "./PinHeader"
import { FemaleHeader } from "./FemaleHeader"
import { Screen } from "./Screen"

export const MountedPcbModule = ({
  numPins = 5,
  rows = 1,
  p = 2.54,
  id = 1.0,
  od = 1.5,
  boardThickness = 1.6,
  width,
  height,
  pinRowSide = "left",
  holes = [],
  holeInset = 1.0,
  pinRowHoleEdgeToEdgeDist = 2.0,
  female,
  nopin,
  screen,
  screenWidth,
  screenHeight,
  screenCenterOffsetX,
  screenCenterOffsetY,
}: {
  numPins?: number
  rows?: number
  p?: number
  id?: number
  od?: number
  boardThickness?: number
  width?: number | string
  height?: number | string
  pinRowSide?: "left" | "right" | "top" | "bottom"
  holes?: string[]
  holeInset?: number
  pinRowHoleEdgeToEdgeDist?: number
  female?: boolean
  nopin?: boolean
  screen?: boolean
  screenWidth?: number
  screenHeight?: number
  screenCenterOffsetX?: number
  screenCenterOffsetY?: number
}) => {
  const showScreen = screen ?? false
  const boardCenterZ = boardThickness / 2
  const numPinsPerRow = Math.ceil(numPins / rows)

  // Calculate width and height if not provided
  let calculatedWidth: number
  let calculatedHeight: number
  if (pinRowSide === "left" || pinRowSide === "right") {
    calculatedWidth = (rows - 1) * p + 2 * pinRowHoleEdgeToEdgeDist
    calculatedHeight = (numPinsPerRow - 1) * p + 2 * pinRowHoleEdgeToEdgeDist
  } else {
    calculatedHeight = (rows - 1) * p + 2 * pinRowHoleEdgeToEdgeDist
    calculatedWidth = (numPinsPerRow - 1) * p + 2 * pinRowHoleEdgeToEdgeDist
  }
  if (numPins === 0) {
    calculatedWidth = 10
    calculatedHeight = 10
  }
  const finalWidth = Number(width ?? calculatedWidth)
  const finalHeight = Number(height ?? calculatedHeight)

  // Calculate pin positions
  const pins: { x: number; y: number }[] = []
  let pinStartX = 0
  let pinStartY = 0
  let pinDirectionX = 0
  let pinDirectionY = 0
  let rowDirectionX = 0
  let rowDirectionY = 0

  if (pinRowSide === "left" || pinRowSide === "right") {
    pinStartX =
      pinRowSide === "left"
        ? -finalWidth / 2 + pinRowHoleEdgeToEdgeDist
        : finalWidth / 2 - pinRowHoleEdgeToEdgeDist
    pinStartY = -((numPinsPerRow - 1) / 2) * p
    pinDirectionX = 0
    pinDirectionY = p
    rowDirectionX = pinRowSide === "left" ? p : -p
    rowDirectionY = 0
  } else {
    pinStartX = -((numPinsPerRow - 1) / 2) * p
    pinStartY =
      pinRowSide === "top"
        ? finalHeight / 2 - pinRowHoleEdgeToEdgeDist
        : -finalHeight / 2 + pinRowHoleEdgeToEdgeDist
    pinDirectionX = p
    pinDirectionY = 0
    rowDirectionX = 0
    rowDirectionY = pinRowSide === "top" ? -p : p
  }

  let pinNumber = 0
  for (let row = 0; row < rows && pinNumber < numPins; row++) {
    for (let col = 0; col < numPinsPerRow && pinNumber < numPins; col++) {
      const x = pinStartX + col * pinDirectionX + row * rowDirectionX
      const y = pinStartY + col * pinDirectionY + row * rowDirectionY
      pins.push({ x, y })
      pinNumber++
    }
  }

  // Calculate hole positions
  const holePositions: { x: number; y: number }[] = []
  if (holes) {
    for (const pos of holes) {
      let hx = 0
      let hy = 0
      if (pos === "topleft") {
        hx = -finalWidth / 2 + holeInset
        hy = finalHeight / 2 - holeInset
      } else if (pos === "topright") {
        hx = finalWidth / 2 - holeInset
        hy = finalHeight / 2 - holeInset
      } else if (pos === "bottomleft") {
        hx = -finalWidth / 2 + holeInset
        hy = -finalHeight / 2 + holeInset
      } else if (pos === "bottomright") {
        hx = finalWidth / 2 - holeInset
        hy = -finalHeight / 2 + holeInset
      } else if (pos === "center") {
        hx = 0
        hy = 0
      }
      holePositions.push({ x: hx, y: hy })
    }
  }
  // Recreated pin row geometry (local copy to avoid PinRow dependency)
  const pinThickness = 0.63
  const pinBodyHeight = 2
  const longSidePinLength = 6
  const shortSidePinLength = 3
  const boardOffsetZ = nopin || female ? 0 : pinBodyHeight
  const boardTopZ = boardOffsetZ + boardThickness
  // Board body with holes subtracted
  const boardBody = (
    <Colorize color="#008080">
      <Subtract>
        <Cuboid
          center={[0, 0, boardCenterZ + boardOffsetZ]}
          size={[finalWidth, finalHeight, boardThickness]}
        />
        {holePositions.map((hole, index) => (
          <Cylinder
            key={`hole-${index}`}
            center={[hole.x, hole.y, boardCenterZ + boardOffsetZ]}
            radius={od / 2}
            height={boardThickness}
          />
        ))}
        {pins.map((pin, index) => (
          <Cylinder
            key={`pin-hole-${index}`}
            center={[pin.x, pin.y, boardCenterZ + boardOffsetZ]}
            radius={od / 2}
            height={boardThickness}
          />
        ))}
      </Subtract>
    </Colorize>
  )

  // Plated through-holes
  const platedHoles = pins.map((pin, index) => (
    <Colorize key={`pin-${index}`} color="#FFD700">
      <Subtract>
        <Cylinder
          center={[pin.x, pin.y, boardThickness / 2 + boardOffsetZ]}
          radius={od / 2}
          height={boardThickness}
        />
        <Cylinder
          center={[pin.x, pin.y, boardThickness / 2 + boardOffsetZ]}
          radius={id / 2}
          height={boardThickness}
        />
      </Subtract>
    </Colorize>
  ))

  const headerPins = pins.map((pin, index) => (
    <PinHeader
      key={`pin-3d-${index}`}
      x={pin.x}
      y={pin.y}
      pinThickness={pinThickness}
      shortSidePinLength={shortSidePinLength}
      longSidePinLength={longSidePinLength}
      bodyHeight={pinBodyHeight}
      flipZ={(z: number) => z}
    />
  ))

  const femaleHeaderRow = pins.map((pin, index) => (
    <FemaleHeader
      key={`female-pin-3d-${index}`}
      x={pin.x}
      y={pin.y}
      flipZ={(z: number) => -z}
    />
  ))

  return (
    <>
      {boardBody}
      {platedHoles}
      {!female && !nopin && headerPins}
      {female && femaleHeaderRow}
      {showScreen && (
        <Screen
          width={screenWidth ?? finalWidth * 0.8}
          height={screenHeight ?? finalHeight * 0.6}
          offset={{
            x: screenCenterOffsetX ?? 0,
            y: screenCenterOffsetY ?? 0,
            z: boardTopZ,
          }}
        />
      )}
    </>
  )
}

export default MountedPcbModule
