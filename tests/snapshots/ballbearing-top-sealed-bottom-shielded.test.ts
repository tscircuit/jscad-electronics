import { test } from "bun:test"
import { assertBallBearingSnapshot } from "../fixtures/ballbearing-snapshot"

test("radial bearing top sealed, bottom shielded in standard four views", () =>
  assertBallBearingSnapshot(import.meta.path, "sealed", "shielded"))
