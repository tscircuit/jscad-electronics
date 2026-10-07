import { expect, test } from "bun:test"
import {
  getTimingPulleyDimensions,
  getTimingBeltDimensions,
} from "@tscircuit/modelprinter"
import {
  createTimingPulleyMesh,
  createTimingPulleyOutline,
} from "../lib/models/timingpulley"
import {
  assertClosedGearMesh,
  assertOpenAxialBore,
  meshBounds,
  sliceMesh,
  outerRadiusAtAngle,
  innerRadiusAtAngle,
  materialArcsAtRadius,
} from "./fixtures/assert-gear-geometry"
test("timingpulley actual grooves, flat roots, fillets, pitch, flange fit and bore", () => {
  for (const [toothCount, arcSegments, crestSegments] of [
    [10, 4, 2],
    [20, 8, 4],
    [32, 12, 6],
    [64, 4, 2],
  ] as const) {
    const props = { toothCount },
      options = { arcSegments, crestSegments }
    const d = getTimingPulleyDimensions(props),
      mesh = createTimingPulleyMesh(props, options)
    const boundary = createTimingPulleyOutline(props, options)
    let previous = Math.atan2(boundary[0]![1], boundary[0]![0])
    const start = previous
    for (const [x, y] of boundary.slice(1)) {
      let angle = Math.atan2(y, x)
      while (angle <= previous) angle += 2 * Math.PI
      expect(angle - previous).toBeGreaterThan(1e-12)
      expect(angle - previous).toBeLessThan(d.toothPitchAngle / 2)
      previous = angle
    }
    expect(previous - start).toBeLessThan(2 * Math.PI)
    assertClosedGearMesh(mesh)
    assertOpenAxialBore(mesh, 2.5)
    const bounds = meshBounds(mesh)
    expect(bounds.minimum[2]).toBe(d.minZ)
    expect(bounds.maximum[2]).toBe(d.maxZ)
    expect(bounds.maximumRadius).toBeCloseTo(d.flangeDiameter / 2, 10)
    const body = sliceMesh(mesh, d.faceWidth / 2)
    const flange = sliceMesh(mesh, -0.5)
    for (let n = 0; n < toothCount; n++) {
      const a = n * d.toothPitchAngle
      expect(outerRadiusAtAngle(body, a)).toBeCloseTo(d.rootDiameter / 2, 9)
      expect(outerRadiusAtAngle(body, a + d.toothPitchAngle / 2)).toBeCloseTo(
        d.outsideDiameter / 2,
        9,
      )
      expect(innerRadiusAtAngle(body, a)).toBeCloseTo(2.5, 2)
      expect(outerRadiusAtAngle(flange, a)).toBeCloseTo(d.flangeDiameter / 2, 3)
    }
    const lands = materialArcsAtRadius(body, d.outsideDiameter / 2 - 0.25)
    expect(lands).toHaveLength(toothCount)
    const widths = lands.map((land) => land.width)
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1e-8)
    // Wrap the documented basic belt section around its tensile pitch circle.
    // Every flank/tip sample must remain in a groove, outside pulley material.
    const belt = getTimingBeltDimensions(),
      rp = d.pitchDiameter / 2
    for (let n = 0; n < toothCount; n++)
      for (let step = 0; step <= 24; step++) {
        const depth = (belt.toothHeight * step) / 24
        const half =
          belt.toothBaseWidth / 2 -
          depth * Math.tan((belt.toothAngle * Math.PI) / 360)
        for (const side of [-1, 1]) {
          const a = n * d.toothPitchAngle + (side * half) / rp
          const beltRadius = rp - belt.pitchLineOffset - depth
          expect(beltRadius - outerRadiusAtAngle(body, a)).toBeGreaterThan(
            0.005,
          )
        }
      }
    expect(d.faceWidth).toBeGreaterThan(10)
    expect(d.flangeDiameter / 2 - d.outsideDiameter / 2).toBeGreaterThan(
      belt.backingThickness,
    )
  }
  const outline = createTimingPulleyOutline()
  const d = getTimingPulleyDimensions(),
    root = d.rootDiameter / 2
  const firstGroove = outline.filter(
    ([x, y]) => x > 0 && Math.abs(Math.atan2(y, x)) < d.toothPitchAngle / 2,
  )
  expect(
    firstGroove.some(([x, y]) => Math.abs(x - root) < 1e-10 && y < 0),
  ).toBe(true)
  expect(
    firstGroove.some(([x, y]) => Math.abs(x - root) < 1e-10 && y > 0),
  ).toBe(true)
  // The exact straight flanks are vertices separated by a nonzero segment.
  const k = Math.tan((d.grooveAngle * Math.PI) / 360),
    radius = d.outsideDiameter / 2
  const onRightFlank = firstGroove.filter(
    ([x, y]) =>
      y > 0 && Math.abs(y - k * (x - radius) - d.grooveOpening / 2) < 1e-10,
  )
  expect(onRightFlank).toHaveLength(2)
  expect(
    Math.hypot(
      onRightFlank[0]![0] - onRightFlank[1]![0],
      onRightFlank[0]![1] - onRightFlank[1]![1],
    ),
  ).toBeGreaterThan(1)
  // Recover the arc radii from emitted vertices, rather than trusting metadata.
  const fitCircle = (points: [number, number][]) => {
    const a = points[0]!,
      b = points[Math.floor(points.length / 2)]!,
      c = points.at(-1)!
    const bx = b[0] - a[0],
      by = b[1] - a[1],
      cx = c[0] - a[0],
      cy = c[1] - a[1]
    const bq = (bx * bx + by * by) / 2,
      cq = (cx * cx + cy * cy) / 2,
      det = bx * cy - by * cx
    const x = (bq * cy - cq * by) / det,
      y = (bx * cq - cx * bq) / det
    const center: [number, number] = [a[0] + x, a[1] + y]
    return { center, radius: Math.hypot(x, y) }
  }
  const rootArc = firstGroove.filter(
    ([x, y]) => y > 0 && x <= root + d.grooveRootRadius + 1e-9,
  )
  const entryArc = firstGroove.filter(
    ([x, y]) =>
      y > 0 &&
      x >= radius - d.grooveEntryRadius &&
      Math.hypot(x, y) < radius - 1e-9,
  )
  expect(rootArc.length).toBeGreaterThan(5)
  expect(entryArc.length).toBeGreaterThan(5)
  const rootCircle = fitCircle(rootArc),
    entryCircle = fitCircle(entryArc)
  expect(rootCircle.radius).toBeCloseTo(d.grooveRootRadius, 8)
  expect(entryCircle.radius).toBeCloseTo(d.grooveEntryRadius, 8)
  expect(rootCircle.center[0] - root).toBeCloseTo(d.grooveRootRadius, 8)
  expect(Math.hypot(...entryCircle.center)).toBeCloseTo(
    radius - d.grooveEntryRadius,
    8,
  )
  for (const circle of [rootCircle, entryCircle])
    expect(
      Math.abs(
        circle.center[1] -
          k * (circle.center[0] - radius) -
          d.grooveOpening / 2,
      ) / Math.hypot(1, k),
    ).toBeCloseTo(circle.radius, 8)
  const maximumCount = createTimingPulleyMesh(
    { toothCount: 256 },
    { arcSegments: 4, crestSegments: 2 },
  )
  expect(maximumCount.positions.every(Number.isFinite)).toBe(true)
  expect(maximumCount.indices.length).toBeGreaterThan(
    createTimingPulleyMesh().indices.length,
  )
  for (const options of [
    { arcSegments: 3 },
    { arcSegments: 33 },
    { arcSegments: 5.5 },
    { crestSegments: 1 },
    { crestSegments: 17 },
  ])
    expect(() => createTimingPulleyMesh({}, options)).toThrow("resolution")
  expect(() => createTimingPulleyMesh({ boreDiameter: 28 })).toThrow()
  expect(() => createTimingPulleyMesh({ flangeThickness: 1e-9 })).toThrow(
    "numerical",
  )
})
