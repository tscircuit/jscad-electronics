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
})

test("localized fanout preserves the supplied bends and both connector rolls", () => {
  const { definition } = adapterCableExamples[0]!
  const meshes = createCableMeshes({
    definition,
    path: [
      [0, 0, 0],
      [0, 0, 30],
      [30, 0, 30],
      [30, 0, 60],
    ],
    startPin1Side: [-1, 0, 0],
    endPin1Side: [0, -1, 0],
    radialSegments: 16,
  })
  for (let index = 0; index < 3; index++) {
    const wire = meshes.find((mesh) => mesh.name === `wire-${index + 1}`)!
    for (const [end, center] of [
      ["A", wire.positions.slice(-6, -3)],
      ["B", wire.positions.slice(-3)],
    ] as const) {
      const socket = meshes.find(
        (mesh) => mesh.name === `${end}-bullet-socket-${index + 1}`,
      )!
      for (const axis of [0, 1]) {
        const coordinates = socket.positions.filter((_, i) => i % 3 === axis)
        expect(center[axis]).toBeCloseTo(
          (Math.min(...coordinates) + Math.max(...coordinates)) / 2,
        )
      }
    }
  }
  const centerWire = meshes.find((mesh) => mesh.name === "wire-2")!
  const rings = (centerWire.positions.length - 6) / 48
  for (const corner of [
    [0, 0, 30],
    [30, 0, 30],
  ]) {
    const centers = Array.from({ length: rings }, (_, ring) =>
      [0, 1, 2].map(
        (axis) =>
          Array.from(
            { length: 16 },
            (_, side) => centerWire.positions[(ring * 16 + side) * 3 + axis]!,
          ).reduce((sum, value) => sum + value, 0) / 16,
      ),
    )
    expect(
      centers.some((point) =>
        point.every((value, axis) => Math.abs(value - corner[axis]!) < 1e-8),
      ),
    ).toBe(true)
  }
})

test("adapter wires bunch through the middle and fan out only within 20 mm of either end", () => {
  for (const { definition } of adapterCableExamples) {
    if (definition.crossSection.kind !== "wire_bundle")
      throw new Error("Expected bundle")
    const compactPitch =
      1.2 *
      Math.max(...definition.crossSection.wires.map((wire) => wire.diameter))
    for (const length of [70, 12]) {
      const ringCenters = (samples: number[]) => {
        const wire = createCableMeshes({
          definition,
          path: samples.map((z) => [0, 0, z]),
          radialSegments: 16,
        }).find((mesh) => mesh.name === "wire-1")!
        const count = (wire.positions.length - 6) / (16 * 3)
        return Array.from({ length: count }, (_, ring) =>
          [0, 1, 2].map(
            (axis) =>
              Array.from(
                { length: 16 },
                (_, side) => wire.positions[(ring * 16 + side) * 3 + axis]!,
              ).reduce((sum, value) => sum + value, 0) / 16,
          ),
        )
      }
      const sparse = ringCenters([0, length])
      const dense = ringCenters([0, length / 7, length / 2, length])
      const endLength = Math.min(20, length / 3)
      const offset = -(definition.crossSection.wires.length - 1) / 2
      const middle = sparse.filter(
        (center) =>
          center[2]! >= endLength - 1e-8 &&
          center[2]! <= length - endLength + 1e-8,
      )
      expect(middle.length).toBeGreaterThanOrEqual(3)
      for (const center of middle)
        expect(center[0]).toBeCloseTo(offset * compactPitch)
      for (const center of sparse) {
        const match = dense.find(
          (other) => Math.abs(other[2]! - center[2]!) < 1e-8,
        )!
        expect(match).toBeDefined()
        expect(match[0]).toBeCloseTo(center[0]!)
        expect(center.every(Number.isFinite)).toBe(true)
      }
    }
  }
})
