import { expect, test } from "bun:test"
import { flangeboltModelPropsSchema } from "@tscircuit/modelprinter"
import { createFlangeBoltMesh } from "../lib/models/flangebolt"
import { inspectMesh } from "./fixtures/flangebolt-mesh"
test("flangebolt all sizes have one closed oriented mesh and pinned assembly dimensions", () => {
  for (const metricSize of ["M5", "M6", "M8", "M10"] as const) {
    const input = { metricSize, length: 25 },
      p = flangeboltModelPropsSchema.parse(input)
    const mesh = createFlangeBoltMesh(input),
      { vertices } = inspectMesh(mesh)
    expect(Math.min(...vertices.map((v) => v[2]))).toBe(-25)

    expect(Math.max(...vertices.map((v) => v[2]))).toBeCloseTo(p.headHeight, 8)
    const bearing = vertices.filter((v) => Math.abs(v[2]) < 1e-9)
    expect(Math.max(...bearing.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.flangeDiameter / 2,
      8,
    )
    const top = vertices.filter((v) => Math.abs(v[2] - p.headHeight) < 1e-9)
    expect(Math.max(...top.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.headAcrossFlats / 2,
      8,
    )
    const upperFlat = vertices.filter(
      (v) =>
        Math.abs(v[0]) < 1e-9 &&
        v[2] >=
          p.flangeThickness +
            ((p.flangeDiameter - p.headAcrossFlats) / 2) *
              Math.tan((p.flangeSlopeAngle * Math.PI) / 180) -
            1e-8 &&
        v[2] < p.headHeight,
    )
    expect(
      upperFlat.some(
        (v) => Math.abs(Math.abs(v[1]) - p.headAcrossFlats / 2) < 1e-8,
      ),
    ).toBe(true)
    const blend = vertices.filter(
      (v) =>
        v[2] > -p.underHeadRadius &&
        v[2] < 0 &&
        Math.abs(v[1]) < 1e-9 &&
        v[0] > 0,
    )
    expect(blend.length).toBeGreaterThan(8)
    for (const [x, y, z] of blend)
      expect(
        Math.hypot(
          x - p.diameter / 2 - p.underHeadRadius,
          z + p.underHeadRadius,
        ),
      ).toBeCloseTo(p.underHeadRadius, 8)

    const middle = vertices.filter((v) => v[2] > -23 && v[2] < -5)
    expect(Math.min(...middle.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.threadRootDiameter / 2,
      5,
    )
    expect(Math.max(...middle.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.diameter / 2,
      5,
    )
    const smooth = createFlangeBoltMesh({ ...input, showThreads: false })
    inspectMesh(smooth)
    expect(smooth.positions.length).toBeLessThan(mesh.positions.length)
    expect(
      createFlangeBoltMesh({ ...input, leftHand: true }).positions,
    ).not.toEqual(mesh.positions)
  }
}, 30000)
test("flangebolt threads follow the specified helical phase rather than stacked rings", () => {
  const input = { metricSize: "M6" as const, length: 25 },
    p = flangeboltModelPropsSchema.parse(input)
  const right = inspectMesh(createFlangeBoltMesh(input)).vertices,
    left = inspectMesh(
      createFlangeBoltMesh({ ...input, leftHand: true }),
    ).vertices
  let checked = 0,
    asymmetric = 0
  for (const point of right.filter(
    ([x, y, z]) =>
      Math.abs(x) < 1e-9 &&
      y > 0 &&
      z > -p.length + 2 * p.threadPitch &&
      z < -3,
  )) {
    const [x, y, z] = point
    const r = (hand: number) => {
      const phase = ((((z + p.length) / p.threadPitch - hand / 4) % 1) + 1) % 1
      const d = Math.min(phase, 1 - phase)
      return (
        p.diameter / 2 -
        Math.min(
          (p.diameter - p.threadRootDiameter) / 2,
          Math.max(0, (d - 1 / 16) * p.threadPitch * Math.sqrt(3)),
        )
      )
    }
    expect(y).toBeCloseTo(r(1), 8)
    const opposite = left.find(
      ([lx, ly, lz]) =>
        Math.abs(lx) < 1e-9 && ly > 0 && Math.abs(lz - z) < 1e-9,
    )
    expect(opposite?.[1]).toBeCloseTo(r(-1), 8)
    if (Math.abs(r(1) - r(-1)) > 1e-3) asymmetric++
    checked++
  }
  expect(checked).toBeGreaterThan(40)
  expect(asymmetric).toBeGreaterThan(10)
}, 30000)
test("flangebolt rejects invalid resolution, impractical size and invalid contracts", () => {
  const input = { metricSize: "M6" as const, length: 25 }
  for (const radialSegments of [23, 25, 193, NaN, Infinity])
    expect(() => createFlangeBoltMesh(input, { radialSegments })).toThrow(
      "resolution",
    )
  for (const threadStepsPerTurn of [1, 23, 97, NaN, Infinity])
    expect(() => createFlangeBoltMesh(input, { threadStepsPerTurn })).toThrow(
      "resolution",
    )
  expect(() => createFlangeBoltMesh({ ...input, length: 100000 })).toThrow(
    "limit",
  )
  expect(() => createFlangeBoltMesh({ ...input, diameter: 999 })).toThrow()
  inspectMesh(
    createFlangeBoltMesh(input, { radialSegments: 24, threadStepsPerTurn: 24 }),
  )
}, 30000)
