import { test } from "bun:test"
import { assertFlatHeadScrewGeometry } from "./fixtures/assert-flat-head-screw-geometry"

test(
  "flatheadscrew closed oriented geometry, datum, thread handedness and resolution",
  assertFlatHeadScrewGeometry,
)
