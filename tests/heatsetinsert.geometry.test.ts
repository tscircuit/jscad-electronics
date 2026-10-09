import { expect, test } from "bun:test"
import { heatSetInsertModelPropsSchema } from "@tscircuit/modelprinter"
import { createHeatSetInsertMesh } from "../lib/models/heatsetinsert"
import { inspectMesh } from "./fixtures/heatsetinsert-mesh"
const input = {
  metricSize: "M3" as const,
  outerDiameter: 4.6,
  length: 5,
  knurlDepth: 0.2,
  knurlPitch: 0.6,
  knurlTeeth: 24,
}
test("heatsetinsert connected closed annular mesh has the exact root, crest and bore envelope", () => {
  for (const metricSize of ["M3", "M4", "M5", "M6"] as const) {
    const props = { ...input, metricSize, outerDiameter: 10 },
      p = heatSetInsertModelPropsSchema.parse(props)
    const { vertices, volume } = inspectMesh(createHeatSetInsertMesh(props))
    expect(Math.min(...vertices.map((v) => v[2]))).toBe(0)
    expect(Math.max(...vertices.map((v) => v[2]))).toBe(p.length)
    const radii = vertices.map((v) => Math.hypot(v[0], v[1]))
    expect(Math.max(...radii)).toBeCloseTo(p.outerDiameter / 2, 8)
    expect(Math.min(...radii)).toBeCloseTo(p.threadMinorDiameter / 2, 8)
    const outer = radii.filter((r) => r > p.diameter / 2 + 1e-6)
    expect(Math.min(...outer)).toBeCloseTo(p.rootOuterDiameter / 2, 8)
    expect(volume).toBeLessThan(
      ((Math.PI * (p.outerDiameter ** 2 - p.threadMinorDiameter ** 2)) / 4) *
        p.length,
    )
    inspectMesh(createHeatSetInsertMesh({ ...props, showThreads: false }))
  }
}, 30000)
test("heatsetinsert diamond crest rows shift half a tooth and preserve axial repeat phase", () => {
  const p = heatSetInsertModelPropsSchema.parse(input),
    mesh = createHeatSetInsertMesh(input)
  const { vertices } = inspectMesh(mesh),
    R = p.outerDiameter / 2,
    r = p.rootOuterDiameter / 2
  const point = (z: number, theta: number) =>
    vertices.find(
      ([x, y, Z]) =>
        Math.abs(Z - z) < 1e-8 &&
        Math.abs(Math.atan2(y, x) - theta) < 1e-8 &&
        Math.hypot(x, y) > p.diameter / 2,
    )
  expect(Math.hypot(...point(0, 0)!.slice(0, 2))).toBeCloseTo(R, 8)
  expect(
    Math.hypot(...point(0, Math.PI / p.knurlTeeth)!.slice(0, 2)),
  ).toBeCloseTo(r, 8)
  expect(Math.hypot(...point(p.knurlPitch / 2, 0)!.slice(0, 2))).toBeCloseTo(
    r,
    8,
  )
  expect(
    Math.hypot(...point(p.knurlPitch / 2, Math.PI / p.knurlTeeth)!.slice(0, 2)),
  ).toBeCloseTo(R, 8)
  expect(Math.hypot(...point(p.knurlPitch, 0)!.slice(0, 2))).toBeCloseTo(R, 8)
  const left = createHeatSetInsertMesh({ ...input, leftHand: true })
  // Changing internal thread hand must preserve every outer knurl vertex.
  const outer = (m: typeof mesh) =>
    m.positions.filter(
      (_, i) =>
        Math.hypot(m.positions[i - (i % 3)]!, m.positions[i - (i % 3) + 1]!) >
        p.diameter / 2 + 1e-6,
    )
  expect(outer(left)).toEqual(outer(mesh))
  expect(left.positions).not.toEqual(mesh.positions)
}, 30000)
test("heatsetinsert actual bore is a helical internal thread with a smooth minor-diameter option", () => {
  const p = heatSetInsertModelPropsSchema.parse(input),
    threaded = inspectMesh(createHeatSetInsertMesh(input)).vertices
  const smooth = inspectMesh(
    createHeatSetInsertMesh({ ...input, showThreads: false }),
  ).vertices
  const bore = (vertices: typeof smooth) =>
    vertices.filter((v) => Math.hypot(v[0], v[1]) < p.diameter / 2 + 1e-8)
  expect(
    Math.max(...bore(threaded).map((v) => Math.hypot(v[0], v[1]))),
  ).toBeCloseTo(p.diameter / 2, 8)
  expect(
    bore(smooth).every(
      (v) =>
        Math.abs(Math.hypot(v[0], v[1]) - p.threadMinorDiameter / 2) < 1e-8,
    ),
  ).toBe(true)
  const row = bore(threaded).filter((v) => Math.abs(v[2] - 2.5) < 1e-8)
  expect(
    Math.max(...row.map((v) => Math.hypot(v[0], v[1]))) -
      Math.min(...row.map((v) => Math.hypot(v[0], v[1]))),
  ).toBeGreaterThan(0.2)
}, 30000)
test("heatsetinsert guards preserve the positive wall and bound mesh allocation", () => {
  expect(() => createHeatSetInsertMesh({ ...input, knurlDepth: 0.8 })).toThrow()
  for (const radialSegments of [23, 95, 769, NaN, Infinity])
    expect(() => createHeatSetInsertMesh(input, { radialSegments })).toThrow(
      "resolution",
    )
  for (const segmentsPerPitch of [1, 7, 65, NaN, Infinity])
    expect(() => createHeatSetInsertMesh(input, { segmentsPerPitch })).toThrow(
      "resolution",
    )
  expect(() => createHeatSetInsertMesh({ ...input, length: 500 })).toThrow(
    "limit",
  )
  inspectMesh(
    createHeatSetInsertMesh(input, { radialSegments: 96, segmentsPerPitch: 8 }),
  )
}, 30000)

test("heatsetinsert coincident half-pitch rows weld without degenerate rings", () => {
  inspectMesh(createHeatSetInsertMesh({ ...input, length: 3 }))
}, 30000)
