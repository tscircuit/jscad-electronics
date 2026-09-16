/** Parameterized dual-flat no-lead package family. Dimensions are millimeters.
 * Manufacturer case names belong in fixtures, not in model dispatch or exports.
 * Existing chamfered rendering remains the default; rectangular variants expose
 * mold standoff, terminal setback/thickness and optional pin-1 corner cuts.
 */
import { Colorize, Cuboid, Hull, Subtract } from "jscad-fiber"
import { ChipBody } from "./ChipBody"
export const DFN = ({
  num_pins,
  bodyWidth = 5.3,
  bodyLength = 5.3,
  bodyThickness = 1,
  thermalPadSize,
  thermalPadOffset = { x: 0, y: 0 },
  // For a body length of 5 the typical pad width/length are 0.6 and 1.
  // Scale those values proportionally when `bodyLength` changes.
  padWidth = (bodyLength / 5.3) * 0.6,
  padLength = (bodyLength / 5.3) * 1,
  pitch = 0.5,
  thermalPadThickness = 0.2,
  bodyStyle = "chamfered",
  standoff = 0,
  terminalInset = 0,
  terminalThickness = thermalPadThickness,
  pin1TerminalChamfer = 0,
  pin1MarkWidth = 0,
}: {
  num_pins: number
  bodyWidth?: number
  bodyLength?: number
  bodyThickness?: number
  thermalPadSize?: {
    width: number
    length: number
  }
  thermalPadOffset?: { x: number; y: number }
  padWidth?: number
  padLength?: number
  pitch?: number
  thermalPadThickness?: number
  /** Rectangular bodies support small no-lead variants; legacy outline is the default. */
  bodyStyle?: "chamfered" | "rectangular"
  /** For rectangular bodies: mold bottom above the seating plane, mm. Body thickness excludes this gap. */
  standoff?: number
  /** Setback of terminal outer edges from the mold edges, mm. */
  terminalInset?: number
  /** Leadframe thickness, independent of the optional exposed pad, mm. */
  terminalThickness?: number
  /** Two outside corner cuts on terminal 1, mm. */
  pin1TerminalChamfer?: number
  /** For rectangular bodies: optional top pin-1 stripe width in mm; zero omits it. */
  pin1MarkWidth?: number
}) => {
  if (bodyStyle === "rectangular") {
    if (!Number.isInteger(num_pins) || num_pins < 2 || num_pins % 2 !== 0)
      throw new Error("DFN requires an even pin count of at least two")
    for (const value of [
      bodyWidth,
      bodyLength,
      bodyThickness,
      padWidth,
      padLength,
      pitch,
      terminalThickness,
    ])
      if (!Number.isFinite(value) || value <= 0)
        throw new Error("DFN dimensions must be finite and positive")
    for (const value of [
      standoff,
      terminalInset,
      pin1TerminalChamfer,
      pin1MarkWidth,
    ])
      if (!Number.isFinite(value) || value < 0)
        throw new Error("DFN offsets must be finite and nonnegative")
    if (
      terminalThickness <= standoff ||
      terminalThickness > standoff + bodyThickness ||
      terminalInset + padLength >= bodyWidth / 2 ||
      (num_pins / 2 - 1) * pitch + padWidth > bodyLength ||
      (num_pins > 2 && padWidth >= pitch) ||
      pin1TerminalChamfer >= Math.min(padLength, padWidth / 2) ||
      pin1MarkWidth >= bodyWidth / 4
    )
      throw new Error(
        "DFN dimensions leave disconnected or overlapping terminals",
      )
  }
  // DFN packages have pads on two opposite sides (left & right).
  // Distribute pins evenly between the two sides.
  const pinPositions: Array<{
    pinNumber: number
    x: number
    y: number
    padSizeX: number // size across the package X axis (pad width)
    padSizeY: number // size along the package Y axis (pad length)
  }> = []

  const pinsPerSide = Math.floor(num_pins / 2)
  // pinSpan = distance between first and last pin on a side (along Y)
  const pinSpan = pitch * (pinsPerSide - 1)

  for (let i = 0; i < num_pins; i++) {
    const side = i < pinsPerSide ? "left" : "right"
    const indexOnSide = i % pinsPerSide
    const y = pinSpan / 2 - indexOnSide * pitch

    // Pads on DFN are typically oriented vertically (long edge along Y)
    const padSizeX = padLength // X dimension of pad (short side)
    const padSizeY = padWidth // Y dimension of pad (long side)

    // x position: place pad inside the body so its outer edge touches the
    // package edge. Pad center should be half the pad X size away from edge.
    const x =
      side === "left"
        ? -bodyWidth / 2 + padSizeX / 2 + terminalInset
        : bodyWidth / 2 - padSizeX / 2 - terminalInset

    const pinNumber = i + 1
    pinPositions.push({ pinNumber, x, y, padSizeX, padSizeY })
  }

  if (bodyStyle === "rectangular") {
    const top = standoff + bodyThickness
    const inkThickness = Math.min(bodyThickness, bodyLength) / 100
    const stripe = (
      <Cuboid
        size={[pin1MarkWidth, bodyLength * 0.8, inkThickness]}
        center={[
          -bodyWidth / 2 + pin1MarkWidth * 1.5,
          0,
          top - inkThickness / 2,
        ]}
      />
    )
    const body = (
      <Cuboid
        size={[bodyWidth, bodyLength, bodyThickness]}
        center={[0, 0, standoff + bodyThickness / 2]}
      />
    )
    return (
      <>
        <Colorize color="#25272a">
          {pin1MarkWidth > 0 ? (
            <Subtract>
              {body}
              {stripe}
            </Subtract>
          ) : (
            body
          )}
        </Colorize>
        <Colorize color="#c7c9cd">
          {pinPositions.map((p) =>
            p.pinNumber === 1 && pin1TerminalChamfer > 0 ? (
              <Hull key={p.pinNumber}>
                <Cuboid
                  size={[
                    padLength - pin1TerminalChamfer,
                    padWidth,
                    terminalThickness,
                  ]}
                  center={[
                    p.x + pin1TerminalChamfer / 2,
                    p.y,
                    terminalThickness / 2,
                  ]}
                />
                <Cuboid
                  size={[
                    padLength,
                    padWidth - 2 * pin1TerminalChamfer,
                    terminalThickness,
                  ]}
                  center={[p.x, p.y, terminalThickness / 2]}
                />
              </Hull>
            ) : (
              <Cuboid
                key={p.pinNumber}
                size={[p.padSizeX, p.padSizeY, terminalThickness]}
                center={[p.x, p.y, terminalThickness / 2]}
              />
            ),
          )}
        </Colorize>
        {thermalPadSize && (
          <Cuboid
            color="#c7c9cd"
            size={[
              thermalPadSize.width,
              thermalPadSize.length,
              thermalPadThickness,
            ]}
            center={[
              thermalPadOffset.x,
              thermalPadOffset.y,
              thermalPadThickness / 2,
            ]}
          />
        )}
        {pin1MarkWidth > 0 && <Colorize color="#969997">{stripe}</Colorize>}
      </>
    )
  }
  return (
    <>
      <ChipBody
        center={{ x: 0, y: 0, z: 0 }}
        width={bodyWidth}
        length={bodyLength}
        height={bodyThickness}
        heightAboveSurface={0}
        color="grey"
        chamferSize={0.2}
        taperRatio={0}
        notchPosition={{
          x: -(bodyWidth / 2 - padLength),
          y: bodyLength / 2 - padLength,
          z: bodyThickness,
        }}
      />
      {pinPositions.map((p, i) => (
        <Cuboid
          key={i}
          center={[p.x, p.y, thermalPadThickness / 2]}
          size={[p.padSizeX, p.padSizeY, thermalPadThickness]}
        />
      ))}
      {thermalPadSize?.length !== undefined &&
        thermalPadSize?.width !== undefined && (
          <Cuboid
            center={[
              thermalPadOffset.x,
              thermalPadOffset.y,
              thermalPadThickness / 2,
            ]}
            size={[
              thermalPadSize.width,
              thermalPadSize.length,
              thermalPadThickness,
            ]}
          />
        )}
    </>
  )
}

export default DFN
