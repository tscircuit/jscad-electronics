import { expect, test } from "bun:test"
import { Footprinter3d } from "../lib/Footprinter3d"
import { ExtrudedPads } from "../lib/ExtrudedPads"
import { source } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 9: mechanical routing has no copper pads and validates input", () => {
  expect(ExtrudedPads({ footprint: source })).toBeNull()
  expect(() => Footprinter3d({ footprint: source + "_unknown1mm" })).toThrow()
})
