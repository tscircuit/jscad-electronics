import { expect, test } from "bun:test"
import { createHatSectionGeom } from "../lib/models/hatsection"
import { props } from "./fixtures/hatsection"
test("hatsection 6: geometry rejects impossible fitting dimensions", () => {
  expect(() => createHatSectionGeom({ ...props, crownWidth: 8 })).toThrow()
})
