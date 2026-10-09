import { expect, test } from "bun:test"
import { setscrewModelPropsSchema } from "@tscircuit/modelprinter"
import { createSetScrewMesh } from "../lib/models/setscrew"
import { inspectMesh } from "./fixtures/setscrew-mesh"
test("setscrew all sizes have one closed oriented mesh and pinned assembly dimensions", () => {
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const input = { metricSize, length: 25 },
      p = setscrewModelPropsSchema.parse(input)
    const mesh = createSetScrewMesh(input),
      { vertices } = inspectMesh(mesh)
    expect(Math.min(...vertices.map((v) => v[2]))).toBe(-25)

    expect(Math.max(...vertices.map((v) => v[2]))).toBe(0)
    const contact = vertices.filter((v) => v[2] === -25)
    expect(
      contact.every(
        (v) => Math.abs(Math.hypot(v[0], v[1]) - p.cupDiameter / 2) < 1e-8,
      ),
    ).toBe(true)
    expect(
      vertices.some(
        (v) =>
          v[0] === 0 &&
          v[1] === 0 &&
          Math.abs(v[2] - (-25 + p.cupDepth)) < 1e-8,
      ),
    ).toBe(true)
    const floor = vertices.filter(
      (v) =>
        Math.abs(v[2] + p.socketDepth) < 1e-9 &&
        Math.hypot(v[0], v[1]) <= p.socketAcrossFlats / Math.sqrt(3) + 1e-8,
    )
    expect(Math.max(...floor.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.socketAcrossFlats / Math.sqrt(3),
      8,
    )
    expect(
      floor.some(
        (v) =>
          Math.abs(v[0]) < 1e-8 &&
          Math.abs(v[1] - p.socketAcrossFlats / 2) < 1e-8,
      ),
    ).toBe(true)

    const middle = vertices.filter((v) => v[2] > -23 && v[2] < -5)
    expect(Math.min(...middle.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.threadRootDiameter / 2,
      5,
    )
    expect(Math.max(...middle.map((v) => Math.hypot(v[0], v[1])))).toBeCloseTo(
      p.diameter / 2,
      5,
    )
    const smooth = createSetScrewMesh({ ...input, showThreads: false })
    inspectMesh(smooth)
    expect(smooth.positions.length).toBeLessThan(mesh.positions.length)
    expect(
      createSetScrewMesh({ ...input, leftHand: true }).positions,
    ).not.toEqual(mesh.positions)
  }
}, 30000)
test("setscrew threads follow the specified helical phase rather than stacked rings", () => {
  const input = { metricSize: "M3" as const, length: 6 },
    p = setscrewModelPropsSchema.parse(input)
  const right = inspectMesh(createSetScrewMesh(input)).vertices,
    left = inspectMesh(
      createSetScrewMesh({ ...input, leftHand: true }),
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
test("setscrew rejects invalid resolution, impractical size and invalid contracts", () => {
  const input = { metricSize: "M3" as const, length: 6 }
  for (const radialSegments of [23, 25, 193, NaN, Infinity])
    expect(() => createSetScrewMesh(input, { radialSegments })).toThrow(
      "resolution",
    )
  for (const threadStepsPerTurn of [1, 23, 97, NaN, Infinity])
    expect(() => createSetScrewMesh(input, { threadStepsPerTurn })).toThrow(
      "resolution",
    )
  expect(() => createSetScrewMesh({ ...input, length: 100000 })).toThrow(
    "limit",
  )
  expect(() => createSetScrewMesh({ ...input, diameter: 999 })).toThrow()
  inspectMesh(
    createSetScrewMesh(input, { radialSegments: 24, threadStepsPerTurn: 24 }),
  )
}, 30000)

test("smooth setscrew volume subtracts both blind recesses from the clipped body", () => {
  const p = setscrewModelPropsSchema.parse({
    metricSize: "M3",
    length: 6,
    showThreads: false,
  })
  const { volume } = inspectMesh(createSetScrewMesh(p))
  const R = p.diameter / 2,
    r = p.cupDiameter / 2,
    m = R - p.mouthChamfer
  const frustum = (h: number, a: number, b: number) =>
    (Math.PI * h * (a * a + a * b + b * b)) / 3
  const body =
    Math.PI * R * R * (p.length - p.pointTaperLength - p.mouthChamfer) +
    frustum(p.pointTaperLength, R, r) +
    frustum(p.mouthChamfer, R, m)
  const removed =
    (Math.PI * r * r * p.cupDepth) / 3 +
    (Math.sqrt(3) * p.socketAcrossFlats * p.socketAcrossFlats * p.socketDepth) /
      2
  expect(Math.abs(volume / (body - removed) - 1)).toBeLessThan(0.001)
}, 30000)
