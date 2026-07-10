import { expect, test } from "bun:test"
import { getRightAnglePinParts } from "./helpers/right-angle-pin-geometry"

/**
 * `invert` mounts the header on the other side of the board, so the tail --
 * the end that goes through the plated hole -- has to leave the bend in the
 * opposite direction. The bend is where the mating pin sits, so the tail is
 * measured against it rather than against a fixed Z.
 */
test("inverting a right-angle header sends the tail through the board the other way", () => {
  const upright = getRightAnglePinParts()
  const inverted = getRightAnglePinParts({ invert: true })

  const uprightBendZ = (upright.matingPin.min.z + upright.matingPin.max.z) / 2
  const invertedBendZ =
    (inverted.matingPin.min.z + inverted.matingPin.max.z) / 2

  expect(upright.tail.max.z).toBeGreaterThan(uprightBendZ)
  expect(upright.tail.min.z).toBeCloseTo(uprightBendZ)

  expect(inverted.tail.min.z).toBeLessThan(invertedBendZ)
  expect(inverted.tail.max.z).toBeCloseTo(invertedBendZ)
})
