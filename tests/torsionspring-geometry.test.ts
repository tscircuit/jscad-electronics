import { expect, test } from "bun:test"
import {
  getTorsionSpringDimensions,
  getTorsionSpringFrame,
  torsionSpringModelPropsSchema,
} from "@tscircuit/modelprinter"
import { createTorsionSpringMesh } from "../lib/models/torsionspring"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
} from "./fixtures/assert-gear-geometry"
for (const p of [
  {},
  { leftHand: true },
  { turns: 4.5, wireDiameter: 1, pitch: 1.1 },
  { turns: 1, outerDiameter: 3, wireDiameter: 1, pitch: 1.1 },
]) {
  test(`torsion spring closed outward tube and open bore: ${JSON.stringify(p)}`, () => {
    const props = torsionSpringModelPropsSchema.parse(p),
      d = getTorsionSpringDimensions(props)
    const mesh = createTorsionSpringMesh(props),
      volume = assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, d.insideDiameter / 2)
    const idealVolume =
      Math.PI * (props.wireDiameter / 2) ** 2 * d.centerlineLength
    expect(volume).toBeGreaterThan(idealVolume * 0.98)
    expect(volume).toBeLessThan(idealVolume * 1.001)
  })
}
test("torsion spring opposite hands mirror the entire envelope and preserve volume", () => {
  const a = createTorsionSpringMesh({}),
    b = createTorsionSpringMesh({ leftHand: true })
  const aa = meshBounds(a),
    bb = meshBounds(b)
  for (const axis of [0, 2]) {
    expect(aa.minimum[axis]).toBeCloseTo(bb.minimum[axis]!, 10)
    expect(aa.maximum[axis]).toBeCloseTo(bb.maximum[axis]!, 10)
  }
  expect(aa.minimum[1]).toBeCloseTo(-bb.maximum[1]!, 10)
  expect(aa.maximum[1]).toBeCloseTo(-bb.minimum[1]!, 10)
  expect(assertClosedGearMesh(a)).toBeCloseTo(assertClosedGearMesh(b), 9)
})
test("torsion spring free-end sections have the specified diameter and normal-cut caps", () => {
  const p = torsionSpringModelPropsSchema.parse({}),
    d = getTorsionSpringDimensions(p),
    mesh = createTorsionSpringMesh(p)
  const rings = mesh.positions.length / 3 - 2
  for (const [offset, s] of [
    [0, 0],
    [rings - 24, d.centerlineLength],
  ]) {
    const f = getTorsionSpringFrame(p, s!)
    for (let i = 0; i < 24; i++) {
      const delta = mesh.positions
        .slice(3 * (offset! + i), 3 * (offset! + i) + 3)
        .map((n, axis) => n - f.position[axis]!)
      expect(Math.hypot(...delta)).toBeCloseTo(p.wireDiameter / 2, 10)
      expect(
        delta.reduce((sum, n, axis) => sum + n * f.tangent[axis]!, 0),
      ).toBeCloseTo(0, 10)
    }
  }
})
test("torsion spring resolution guards run before allocation", () => {
  for (const segmentsPerTurn of [0, 15, 18, 257, NaN, Infinity])
    expect(() => createTorsionSpringMesh({}, { segmentsPerTurn })).toThrow()
  for (const wireSegments of [0, 7, 10, 65, NaN])
    expect(() => createTorsionSpringMesh({}, { wireSegments })).toThrow()
  expect(() =>
    createTorsionSpringMesh(
      { turns: 128 },
      { segmentsPerTurn: 256, wireSegments: 64 },
    ),
  ).toThrow("250000")
  expect(() => createTorsionSpringMesh({ startLegLength: 1e-15 })).toThrow(
    "resolution",
  )
})
