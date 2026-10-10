import { expect, test } from "bun:test"
import { createTSlotPanelRetainerGeom } from "../lib/models/tslotpanelretainer"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 6: geometry rejects impossible fitting dimensions", () => {
  expect(() => createTSlotPanelRetainerGeom({ ...props, depth: 6 })).toThrow()
})
