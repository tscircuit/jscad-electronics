import { expect, test } from "bun:test"
import { createSplitGrommetGeom } from "../lib/models/splitgrommet"
import { splitGrommetProps } from "./fixtures/splitgrommet-example"
test("splitgrommet renderer rejects invalid material dimensions", () => {
  expect(() =>
    createSplitGrommetGeom({ ...splitGrommetProps, ...{ grooveDepth: 2 } }),
  ).toThrow()
  expect(() =>
    createSplitGrommetGeom({
      ...splitGrommetProps,
      panelHoleDiameter: Infinity,
    }),
  ).toThrow()
})
