import { expect, test } from "bun:test"
import { createPerforatedAngleMesh } from "../lib/models/perforatedangle"
import { props, checkMesh } from "./fixtures/perforatedangle"
test("perforatedangle 5: zero-radius and unequal-leg alternatives remain closed", () => {
  checkMesh(createPerforatedAngleMesh({ ...props, innerRadius: 0, height: 35 }))
  checkMesh(createPerforatedAngleMesh({ ...props, holeCount: 1, length: 40 }))
})
