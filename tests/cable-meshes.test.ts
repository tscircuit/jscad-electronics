import { expect, test } from "bun:test"
import { createCableMeshes, type CableMesh } from "../lib/cables"
import { cross, dot, subtract } from "../lib/cables/path-frames"
import { cableExamplePath, cableExamples } from "./fixtures/cable-examples"

function assertCableMesh(mesh: CableMesh) {
  expect(mesh.positions.every(Number.isFinite)).toBe(true)
  expect(mesh.positions.length % 3).toBe(0)
  expect(mesh.indices.length % 3).toBe(0)
  expect(mesh.indices.length).toBeGreaterThan(0)
  let volume = 0
  for (let index = 0; index < mesh.indices.length; index += 3) {
    const points = mesh.indices.slice(index, index + 3).map((vertex) => {
      expect(
        Number.isInteger(vertex) &&
          vertex >= 0 &&
          vertex < mesh.positions.length / 3,
      ).toBe(true)
      return mesh.positions.slice(vertex * 3, vertex * 3 + 3) as [
        number,
        number,
        number,
      ]
    })
    const [a, b, c] = points as [
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ]
    expect(
      Math.hypot(...cross(subtract(b, a), subtract(c, a))),
    ).toBeGreaterThan(1e-10)
    volume += dot(a, cross(b, c)) / 6
  }
  expect(volume).toBeGreaterThan(0)
}

test("all common cable models produce finite, outward-facing 3D triangle meshes", () => {
  for (const definition of cableExamples) {
    for (const mesh of createCableMeshes({
      definition,
      path: cableExamplePath,
    }))
      assertCableMesh(mesh)
  }
})

test("round sweeps are capped, have consistently paired edges, and span their supplied endpoints", () => {
  const meshes = createCableMeshes({
    definition: cableExamples[0]!,
    path: [
      [0, 0, 0],
      [0, 0, 20],
    ],
    radialSegments: 16,
  })
  const jacket = meshes.find((mesh) => mesh.name === "jacket")!
  type MeshEdge = string
  const edges = new Map<MeshEdge, number>()
  for (let index = 0; index < jacket.indices.length; index += 3) {
    const triangle = jacket.indices.slice(index, index + 3)
    for (let side = 0; side < 3; side++) {
      const a = triangle[side]!
      const b = triangle[(side + 1) % 3]!
      const edge = `${Math.min(a, b)}:${Math.max(a, b)}`
      edges.set(edge, (edges.get(edge) ?? 0) + 1)
    }
  }
  expect([...edges.values()].every((count) => count === 2)).toBe(true)
  const z = jacket.positions.filter((_, index) => index % 3 === 2)
  expect(Math.min(...z)).toBe(0)
  expect(Math.max(...z)).toBe(20)
  expect(jacket.positions.length / 3).toBe(34)
})

test("bundles keep one separately colored mesh per conductor and contacts at both ends", () => {
  const meshes = createCableMeshes({
    definition: cableExamples[1]!,
    path: cableExamplePath,
  })
  expect(meshes.filter((mesh) => mesh.name.startsWith("wire-"))).toHaveLength(4)
  expect(
    meshes.filter((mesh) => mesh.name.startsWith("A-contact-")),
  ).toHaveLength(4)
  expect(
    meshes.filter((mesh) => mesh.name.startsWith("B-contact-")),
  ).toHaveLength(4)
  expect(
    new Set(
      meshes
        .filter((mesh) => mesh.name.startsWith("wire-"))
        .map((mesh) => mesh.color.join(",")),
    ).size,
  ).toBe(4)
})

test("mesh generation works for 3D paths aligned with each world axis", () => {
  for (const path of [
    [
      [0, 0, 0],
      [30, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 30, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 30],
    ],
    [
      [0, 0, 0],
      [0, 0, 10],
      [10, 0, 15],
      [10, 10, 20],
    ],
  ] as [number, number, number][][]) {
    for (const mesh of createCableMeshes({
      definition: cableExamples[0]!,
      path,
    }))
      assertCableMesh(mesh)
  }
})

test("degenerate paths, invalid diameters and conductor mismatches fail before building meshes", () => {
  const definition = cableExamples[0]!
  expect(() => createCableMeshes({ definition, path: [] })).toThrow()
  expect(() =>
    createCableMeshes({
      definition,
      path: [
        [0, 0, 0],
        [0, 0, 0],
      ],
    }),
  ).toThrow()
  expect(() =>
    createCableMeshes({
      definition,
      path: [
        [0, 0, 0],
        [Infinity, 0, 0],
      ],
    }),
  ).toThrow()
  expect(() =>
    createCableMeshes({
      definition,
      path: cableExamplePath,
      radialSegments: 3,
    }),
  ).toThrow()
  expect(() =>
    createCableMeshes({
      definition: {
        ...definition,
        crossSection: { kind: "round_jacket", diameter: -1, color: "#000000" },
      },
      path: cableExamplePath,
    }),
  ).toThrow()
  expect(() =>
    createCableMeshes({
      definition: {
        ...cableExamples[1]!,
        crossSection: {
          kind: "wire_bundle",
          wirePitch: 1,
          wires: [{ diameter: 0.6, color: "#000000" }],
        },
      },
      path: cableExamplePath,
    }),
  ).toThrow()
})
