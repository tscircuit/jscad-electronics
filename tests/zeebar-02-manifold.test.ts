import { expect, test } from "bun:test"
import { createZeeBarMesh } from "../lib/models/zeebar"
import { props, checkMesh } from "./fixtures/zeebar"
test("zeebar 2: indexed triangles form a closed outward manifold", () => {
  checkMesh(createZeeBarMesh(props))
})
