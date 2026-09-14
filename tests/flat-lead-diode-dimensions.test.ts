import { expect, test } from "bun:test"
import { createFlatLeadDiode } from "../lib/utils/FlatLeadDiode"

test("flat-lead outlines reject invalid dimensions and disconnected terminals", () => {
  const base = {
    bodyLength: 2.2,
    bodyWidth: 1.3,
    bodyHeight: 0.68,
    leadSpan: 2.5,
    cathodeLength: 1.3,
    cathodeWidth: 0.88,
    anodeLength: 0.65,
    anodeWidth: 0.65,
    terminalThickness: 0.195,
    standoff: 0.11,
    taperInset: 0.05,
    markingWidth: 0.23,
  }
  const reactProps = { ...base, children: undefined }
  expect(() => createFlatLeadDiode(reactProps)).not.toThrow()
  for (const override of [
    { bodyLength: NaN },
    { bodyHeight: 0 },
    { leadSpan: 2 },
    { cathodeLength: 0.1 },
    { anodeLength: 1.3 },
    { terminalThickness: 0.1 },
    { standoff: -0.1 },
    { taperInset: 0.7 },
    { markingWidth: 2 },
  ])
    expect(() => createFlatLeadDiode({ ...base, ...override })).toThrow()
})
