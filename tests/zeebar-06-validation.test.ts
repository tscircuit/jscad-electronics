import { expect, test } from "bun:test"
import { createZeeBarGeom } from "../lib/models/zeebar"
import { props } from "./fixtures/zeebar"
test("zeebar 6: geometry rejects impossible fitting dimensions", () => {
  expect(() => createZeeBarGeom({ ...props, upperWidth: 4 })).toThrow()
})
