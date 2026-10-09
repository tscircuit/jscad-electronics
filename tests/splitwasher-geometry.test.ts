import { expect, test } from "bun:test"
import { getSplitWasherDimensions } from "@tscircuit/modelprinter"
import { createSplitWasherMesh } from "../lib/models/splitwasher"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
const props = {
  innerDiameter: 6.1,
  outerDiameter: 11.8,
  thickness: 1.6,
  rise: 1.6,
  gapAngle: 10,
}
test("split washer is closed and outward with an open bore, angular gap and specified rise", () => {
  const mesh = createSplitWasherMesh(props),
    volume = assertClosedGearMesh(mesh)
  assertOpenAxialBore(mesh, props.innerDiameter / 2)
  const b = meshBounds(mesh),
    d = getSplitWasherDimensions(props)
  expect(b.minimum[2]).toBe(0)
  expect(b.maximum[2]).toBeCloseTo(3.2, 12)
  expect(b.maximumRadius).toBeCloseTo(5.9, 12)
  expect(volume).toBeGreaterThan(d.volume * 0.9999)
  expect(volume).toBeLessThan(d.volume)
  // Both end faces stay radial and their plane displacement is exactly rise.
  const end = mesh.positions.length - 12
  expect(mesh.positions[2]).toBe(0)
  expect(mesh.positions[end + 2]).toBe(1.6)
  const lastAngle =
    (Math.atan2(mesh.positions[end + 1]!, mesh.positions[end]!) * 180) / Math.PI
  expect(lastAngle).toBeCloseTo(-10, 10)
})
test("opposite split washer hands mirror Y and preserve positive volume", () => {
  const a = createSplitWasherMesh(props),
    b = createSplitWasherMesh({ ...props, leftHanded: true })
  for (let i = 0; i < a.positions.length; i++)
    expect(b.positions[i]).toBeCloseTo(
      a.positions[i]! * (i % 3 === 1 ? -1 : 1),
      12,
    )
  expect(assertClosedGearMesh(a)).toBeCloseTo(assertClosedGearMesh(b), 10)
  expect(
    assertClosedGearMesh(createSplitWasherMesh({ ...props, rise: 0 })),
  ).toBeGreaterThan(0)
})
test("the rectangular section retains its volume independently of helix rise", () => {
  const volumes = [0, 1.6, 8].map((rise) =>
    assertClosedGearMesh(
      createSplitWasherMesh({ ...props, rise }, { angularSegments: 48 }),
    ),
  )
  for (const volume of volumes) expect(volume).toBeCloseTo(volumes[0]!, 10)
  const thin = { ...props, thickness: 0.001, rise: 8 }
  const ideal = getSplitWasherDimensions(thin).volume
  const actual = assertClosedGearMesh(createSplitWasherMesh(thin))
  expect(actual / ideal).toBeCloseTo(1, 4)
})
test("split washer resolution and impossible inputs fail before rendering", () => {
  for (const angularSegments of [0, 23, 1441, 24.5, NaN, Infinity])
    expect(() => createSplitWasherMesh(props, { angularSegments })).toThrow()
  expect(() => createSplitWasherMesh({ ...props, outerDiameter: 6 })).toThrow()
  expect(() => createSplitWasherMesh({ ...props, thickness: 1e-15 })).toThrow(
    "precision",
  )
})
