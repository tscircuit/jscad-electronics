import { expect, test } from "bun:test"
import { createPerforatedAngleMesh } from "../lib/models/perforatedangle"
import { props, checkMesh } from "./fixtures/perforatedangle"
test("perforatedangle 2: indexed triangles form a closed outward manifold", () => {
  checkMesh(createPerforatedAngleMesh(props))
})
