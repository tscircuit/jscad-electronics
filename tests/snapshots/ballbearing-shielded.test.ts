import { test } from "bun:test"
import { assertBallBearingSnapshot } from "../fixtures/ballbearing-snapshot"

test("radial bearing top shielded, bottom shielded in standard four views", () =>
  assertBallBearingSnapshot(import.meta.path, "shielded", "shielded"))
