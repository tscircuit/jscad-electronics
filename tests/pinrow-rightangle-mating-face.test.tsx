import { expect, test } from "bun:test"
import { getRightAnglePinParts } from "./helpers/right-angle-pin-geometry"

/**
 * The mating pin leaves the header on the face the body is offset towards
 * (-Y), for either board side: that is the direction a right-angle header
 * mates in, and flipping the part over does not change which face its pins
 * come out of.
 *
 * Inverting used to mirror the mating pin along with the tail, sending it out
 * the +Y side (y -1.9..4.1) -- straight back over the board, away from the body
 * at y -4.27..-1.73, i.e. out of the opposite face from an upright header.
 */
test.each([
  ["upright", {}],
  ["inverted", { invert: true }],
] as const)(
  "%s right-angle pin mates out of the body face, starting at the pin axis",
  (_orientation, props) => {
    const { body, matingPin } = getRightAnglePinParts(props)

    // Body is offset to -Y, so the mating pin must run that way too.
    expect(body.max.y).toBeLessThan(0)
    // Starts at the pin axis (the bend) ...
    expect(matingPin.max.y).toBeCloseTo(0)
    // ... and reaches past the body, out of the mating face.
    expect(matingPin.min.y).toBeLessThan(body.min.y)
  },
)
