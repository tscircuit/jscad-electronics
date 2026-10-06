import { expect, test } from "bun:test"
import { createCableMeshes, type CablePoint } from "../lib/cables"
import { createCablePathFrames, dot } from "../lib/cables/path-frames"
import { cableExamples } from "./fixtures/cable-examples"

test("pin 1 wire exits follow independently constrained endpoint sides", () => {
  const definition = cableExamples[1]!
  // Right-handed world XYZ, +Z up, mm. The unequal segment lengths ensure
  // twist is distributed by arc length rather than by sample count.
  const path: CablePoint[] = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 20],
  ]
  for (const endPin1Side of [
    [0, -1, 0],
    [1, 0, 0],
  ] as CablePoint[]) {
    const startPin1Side: CablePoint = [-1, 0, 0]
    const meshes = createCableMeshes({
      definition,
      path,
      startPin1Side,
      endPin1Side,
    })
    for (const [name, width] of [
      ["A-housing", startPin1Side],
      ["B-housing", endPin1Side],
    ] as const) {
      const housing = meshes.find((mesh) => mesh.name === name)!
      const projections = Array.from(
        { length: housing.positions.length / 3 },
        (_, index) =>
          dot(
            housing.positions.slice(index * 3, index * 3 + 3) as CablePoint,
            width,
          ),
      )
      expect(Math.max(...projections) - Math.min(...projections)).toBeCloseTo(
        definition.connectorA.bodyWidth,
        6,
      )
    }
    const firstWire = meshes.find((mesh) => mesh.name === "wire-1")!
    // sweepRoundCable emits each cap's center as its last two vertices.
    const start = firstWire.positions.slice(-6, -3) as CablePoint
    const end = firstWire.positions.slice(-3) as CablePoint
    const offset = 1.5 // first wire lies toward pin 1 at both ends
    start.forEach((value, axis) =>
      expect(value).toBeCloseTo(
        path[0]![axis]! + offset * startPin1Side[axis]!,
        6,
      ),
    )
    end.forEach((value, axis) =>
      expect(value).toBeCloseTo(
        path.at(-1)![axis]! + offset * endPin1Side[axis]!,
        6,
      ),
    )
    const frames = createCablePathFrames(path, {
      startPin1Side,
      endPin1Side,
    })
    const expectedTwist = endPin1Side[0] === 1 ? Math.PI : Math.PI / 2
    expect(Math.atan2(frames[1]!.normal[1], frames[1]!.normal[0])).toBeCloseTo(
      expectedTwist / 20,
      6,
    )
  }
})

test("one endpoint constraint fixes roll without twist and omitted constraints preserve legacy output", () => {
  const path: CablePoint[] = [
    [0, 0, 0],
    [0, 0, 10],
  ]
  expect(createCablePathFrames(path, {})).toEqual(createCablePathFrames(path))
  for (const constraints of [
    { startPin1Side: [0, 1, 0] as CablePoint },
    { endPin1Side: [0, 1, 0] as CablePoint },
  ]) {
    for (const frame of createCablePathFrames(path, constraints))
      frame.normal.forEach((value, axis) =>
        expect(value).toBeCloseTo(axis === 1 ? -1 : 0, 6),
      )
  }
  for (const width of [
    [0, 0, 0],
    [0, 0, 1],
    [NaN, 1, 0],
  ] as CablePoint[]) {
    expect(() =>
      createCablePathFrames(path, { startPin1Side: width }),
    ).toThrow()
    expect(() => createCablePathFrames(path, { endPin1Side: width })).toThrow()
  }
})
