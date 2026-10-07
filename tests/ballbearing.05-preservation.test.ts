import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { createBallBearingMesh } from "../lib/models/ballbearing"
import {
  ballBearingFaceStates,
  ballBearingFaceInput,
} from "./fixtures/ballbearing-face-cases"
import baseline from "./fixtures/ballbearing-symmetric-geometry.json"

test("six normalized face booleans preserve all three reviewed symmetric indexed geometries exactly", () => {
  for (const face of ballBearingFaceStates) {
    const { positions, indices } = createBallBearingMesh(
      ballBearingFaceInput(face, face),
    )
    const hash = createHash("sha256")
      .update(JSON.stringify({ positions, indices }))
      .digest("hex")
    expect(hash).toBe(baseline[face])
  }
})
