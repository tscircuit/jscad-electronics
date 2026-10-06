import { test } from "bun:test"
import { assertHexBoltGeometry } from "./fixtures/assert-hex-bolt-geometry"

test(
  "hexbolt closed oriented geometry, datum, thread handedness and resolution",
  assertHexBoltGeometry,
)
