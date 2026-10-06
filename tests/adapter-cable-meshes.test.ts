import { expect, test } from "bun:test"
import { createCableMeshes } from "../lib/cables"
import { adapterCableExamples } from "./fixtures/adapter-cable-examples"

test("wire caps meet the actual contact centers at independently pitched ends", () => {
  for (const { definition } of adapterCableExamples) {
    const meshes = createCableMeshes({
      definition,
      path: [
        [0, 0, 0],
        [0, 0, 10],
        [0, 0, 70],
      ],
      radialSegments: 16,
    })
    const wires = meshes.filter((mesh) => mesh.name.startsWith("wire-"))
    if (definition.crossSection.kind !== "wire_bundle")
      throw new Error("Expected bundled wires")
    expect(wires).toHaveLength(definition.crossSection.wires.length)
    for (const [wireIndex, wire] of wires.entries()) {
      for (const [end, center] of [
        ["A", wire.positions.slice(-6, -3)],
        ["B", wire.positions.slice(-3)],
      ] as const) {
        const contact = meshes.find(
          (mesh) =>
            mesh.name === `${end}-bullet-socket-${wireIndex + 1}` ||
            mesh.name === `${end}-contact-${wireIndex + 1}`,
        )!
        const x = contact.positions.filter((_, axis) => axis % 3 === 0)
        // Derive the contact center from emitted connector vertices, not pitch math.
        expect(center[0]).toBeCloseTo((Math.min(...x) + Math.max(...x)) / 2)
        expect(center[1]).toBeCloseTo(0)
        expect(center[2]).toBeCloseTo(end === "A" ? 0 : 70)
      }
      expect(wire.positions.every(Number.isFinite)).toBe(true)
    }
  }
  const { definition } = adapterCableExamples[0]!
  const wire = createCableMeshes({
    definition,
    path: [
      [0, 0, 0],
      [0, 0, 10],
      [0, 0, 70],
    ],
    radialSegments: 16,
  }).find((mesh) => mesh.name === "wire-1")!
  const middleRingX = Array.from(
    { length: 16 },
    (_, side) => wire.positions[(16 + side) * 3]!,
  )
  // z=10 is one seventh of the route, not halfway despite being the middle sample.
  expect(middleRingX.reduce((sum, x) => sum + x, 0) / 16).toBeCloseTo(
    -5.5 - 0.5 / 7,
  )
})
