import { expect, test } from "bun:test"
import { createHatSectionMesh } from "../lib/models/hatsection"
import { props, checkMesh } from "./fixtures/hatsection"
test("hatsection 5: zero inside radius and wider lips remain closed", () => {
  checkMesh(createHatSectionMesh({ ...props, bendRadius: 0 }))
  checkMesh(createHatSectionMesh({ ...props, lipWidth: 15, crownWidth: 50 }))
})
