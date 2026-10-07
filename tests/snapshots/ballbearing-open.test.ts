import { test } from "bun:test"
import { assertBallBearingSnapshot } from "../fixtures/ballbearing-snapshot"

test("radial bearing top open, bottom open in standard four views", () =>
  assertBallBearingSnapshot(import.meta.path, "open", "open"))
