import { expect, test } from "bun:test"
import { createHatSectionMesh } from "../lib/models/hatsection"
import { props, checkMesh } from "./fixtures/hatsection"
test("hatsection 2: indexed triangles form a closed outward manifold", () => {
  checkMesh(createHatSectionMesh(props))
})
