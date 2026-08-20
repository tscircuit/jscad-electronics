import { PinHeader } from "./PinHeader"

export const PinRow = ({
  numberOfPins,
  pitch = 2.54,
  longSidePinLength = 6,
  invert,
  rows = 1,
  smd,
  rightangle,
}: {
  numberOfPins: number
  pitch?: number
  longSidePinLength?: number
  invert?: boolean
  rows?: number
  smd?: boolean
  rightangle?: boolean
}) => {
  const pinThickness = 0.63
  const bodyHeight = 2
  const pinsPerRow = Math.ceil(numberOfPins / rows)
  const rowSpacing = 2.54 // Standard spacing between rows
  const shortSidePinLength = 3
  const xoff = -((pinsPerRow - 1) / 2) * pitch

  // A through-hole header is mounted on TOP of the board: the plastic body
  // sits on the surface (z 0 to bodyHeight), its long pins stand above it and
  // its short pins pass down through the holes.
  //
  // The default used to be the other way up — body at z -3.6 to -1.6, i.e.
  // hanging under the board with 2mm of pin poking through, which is a
  // BOTTOM-mounted header — and `invert` produced the ordinary one. Two things
  // follow from that being backwards: every through-hole header rendered
  // upside down, and the part measured 0.9mm above the board when it is really
  // about 8.5mm, so an enclosure sized from it left no room for the header at
  // all. `invert` now means what it says: mounted on the underside.
  // Which way up a header goes, and which end of its pins passes through the
  // board, are two different questions. This flag answers the SECOND one; the
  // first is the component's `layer`, which consumers already implement (see
  // 3d-viewer's cad-model-transform: a bottom-layer part is repositioned and
  // rotated 180 degrees about X). A model that flipped itself would be flipped
  // twice on a bottom-layer component, so nothing here ever puts the body
  // below z = 0.
  //
  //   default   long pins up, short pins down through the board — a male
  //             header mounted the ordinary way
  //   invert    installed backwards: long pins down THROUGH the board, short
  //             pins up. Unusual, but a real option (board stacking, wire
  //             wrap), and what `invert` meant when it was added in #236.
  //
  // The default used to be the backwards one, and #256 then pushed the whole
  // part 3.6mm down to compensate, which put the body under the board.
  //
  // `faceup` is gone. It was added a day after `invert`, by a different
  // author, sharing its expression, and its only distinct effect was deleting
  // the pins below the board — which on a through-hole footprint, made of
  // plated HOLES, produces a part that cannot be soldered into its own land
  // pattern. The orientation it named ("the male pin header should face
  // upwards, out of the top layer") is what a correctly mounted header does
  // by default. It is deprecated in footprinter (tscircuit/footprinter#813)
  // and simply ignored here, so a footprint string that still carries it
  // renders the part correctly rather than differently.
  const throughHole = !smd && !rightangle
  const flipped = throughHole ? !invert : Boolean(invert)
  const flipZ = (z: number) => (flipped ? -z + bodyHeight : z)

  return (
    <>
      {Array.from({ length: numberOfPins }, (_, i) => {
        const row = Math.floor(i / pinsPerRow)
        const col = i % pinsPerRow
        const x = xoff + col * pitch
        const y = ((rows - 1) / 2 - row) * rowSpacing

        return (
          <PinHeader
            key={i}
            x={x}
            y={y}
            pinThickness={pinThickness}
            shortSidePinLength={shortSidePinLength}
            longSidePinLength={longSidePinLength}
            bodyHeight={bodyHeight}
            flipZ={flipZ}
            smd={smd}
            rightangle={rightangle}
          />
        )
      })}
    </>
  )
}
