import { expect, test } from "bun:test"
import { createLeadScrewNutMesh } from "../lib/models/leadscrewnut"
import {
  sliceMesh,
  innerRadiusAtAngle,
  assertOpenAxialBore,
} from "./fixtures/assert-gear-geometry"
test("flange mount bores are open and exactly located; tessellation guards bound work", () => {
  const mesh = createLeadScrewNutMesh(
    { threadSize: "TR8x8(P2)" },
    { radialSegments: 48, segmentsPerPitch: 12, holeSegments: 32 },
  )
  const middle = sliceMesh(mesh, 1.5)
  for (const [x, y] of [
    [8, 0],
    [0, 8],
    [-8, 0],
    [0, -8],
  ] as const) {
    assertOpenAxialBore(
      {
        positions: mesh.positions.map((value, i) =>
          i % 3 === 0 ? value - x! : i % 3 === 1 ? value - y! : value,
        ),
        indices: mesh.indices,
      },
      1.75,
    )
    const centered = middle.map(
      ([a, b]) =>
        [
          [a[0] - x, a[1] - y],
          [b[0] - x, b[1] - y],
        ] as [[number, number], [number, number]],
    )
    for (const angle of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2])
      expect(innerRadiusAtAngle(centered, angle)).toBeCloseTo(1.75, 6)
  }
  const shoulderVertices = []
  for (let i = 0; i < mesh.positions.length; i += 3)
    if (mesh.positions[i + 2] === 3)
      shoulderVertices.push(
        Math.hypot(mesh.positions[i]!, mesh.positions[i + 1]!),
      )
  expect(shoulderVertices).toContain(11)
  expect(shoulderVertices).toContain(6)
  for (const options of [
    { radialSegments: 31 },
    { radialSegments: 40 },
    { radialSegments: 208 },
    { segmentsPerPitch: 7 },
    { segmentsPerPitch: 65 },
    { holeSegments: 15 },
    { holeSegments: 18 },
    { holeSegments: 100 },
  ])
    expect(() =>
      createLeadScrewNutMesh({ threadSize: "TR8x2" }, options),
    ).toThrow("resolution")
  expect(() =>
    createLeadScrewNutMesh({ threadSize: "TR8x2", length: 1e8 }),
  ).toThrow("resolution")
  expect(() =>
    createLeadScrewNutMesh({ threadSize: "TR8x2", bodyDiameter: 8 }),
  ).toThrow()
})
