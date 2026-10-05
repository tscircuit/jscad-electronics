import { test } from "bun:test"
import { assertPanScrewGeometry } from "./fixtures/assert-pan-screw-geometry"

test(
  "panscrew closed oriented geometry, datum, thread handedness and resolution",
  assertPanScrewGeometry,
)
