import { expect, test } from "bun:test"
import { createPerforatedAngleGeom } from "../lib/models/perforatedangle"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 6: geometry rejects impossible fitting dimensions", () => {
  expect(() =>
    createPerforatedAngleGeom({ ...props, innerRadius: 22 }),
  ).toThrow()
})
