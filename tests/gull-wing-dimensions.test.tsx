import { expect, test } from "bun:test"
import { createDualRowGullWing } from "../lib/utils/DualRowGullWing"

test("Gull-wing outlines reject invalid or disconnected dimensions", () => {
  const p = {
    pinCount: 8,
    pitch: 1.27,
    bodyWidth: 3.9,
    bodyLength: 4.9,
    bodyHeight: 1.6,
    standoff: 0.1,
    leadSpan: 6,
    leadWidth: 0.4,
    leadThickness: 0.2,
    contactLength: 0.6,
    taperInset: 0.1,
  }
  for (const bad of [
    { pinCount: 7 },
    { pinCount: NaN },
    { pitch: Infinity },
    { bodyWidth: 0 },
    { bodyLength: 2 },
    { bodyHeight: 0.2 },
    { standoff: -1 },
    { standoff: 2 },
    { leadSpan: 4 },
    { leadWidth: 1.27 },
    { leadThickness: 1 },
    { contactLength: 1.2 },
    { taperInset: 3 },
    { exposedPadWidth: 1 },
    { exposedPadWidth: 4, exposedPadLength: 2 },
    { exposedPadWidth: 1, exposedPadLength: NaN },
  ])
    expect(() => createDualRowGullWing({ ...p, ...bad })).toThrow()
  // React/Cosmos may inject auxiliary props; validate named dimensions only.
  expect(() =>
    createDualRowGullWing({ ...p, children: undefined } as typeof p),
  ).not.toThrow()
  expect(() =>
    createDualRowGullWing({ ...p, exposedPadWidth: 2, exposedPadLength: 2 }),
  ).not.toThrow()
})
