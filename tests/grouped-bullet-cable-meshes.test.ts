import { expect, test } from "bun:test"
import { createCableMeshes, type CableGeometryDefinition } from "../lib/cables"

test("three bullet contacts line up with three separate wires at each end", () => {
  const contact = {
    diameter: 3.5,
    contactDepth: 7,
    pinCount: 3,
    pitch: 5.5,
    bodyDepth: 12.25,
  } satisfies CableGeometryDefinition
  const definition = {
    connectorA: {
      ...contact,
      kind: "bullet_male",
      bodyHeight: 4.1,
      bodyWidth: 15.1,
    },
    connectorB: {
      ...contact,
      kind: "bullet_female",
      bodyHeight: 4.5,
      bodyWidth: 15.5,
    },
    crossSection: {
      kind: "wire_bundle",
      wirePitch: 5.5,
      wires: ["#df4049", "#263449", "#e1b13c"].map((color) => ({
        diameter: 2,
        color,
      })),
    },
  } satisfies CableGeometryDefinition
  const path: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, 60],
  ]
  const meshes = createCableMeshes({ definition, path })
  expect(meshes).toHaveLength(15)
  for (let pin = 1; pin <= 3; pin++) {
    const wire = meshes.find((mesh) => mesh.name === `wire-${pin}`)!
    const male = meshes.find((mesh) => mesh.name === `A-bullet-pin-${pin}`)!
    const female = meshes.find(
      (mesh) => mesh.name === `B-bullet-socket-${pin}`,
    )!
    const center = (positions: number[]) => {
      const xs = positions.filter((_, index) => index % 3 === 0)
      return (Math.min(...xs) + Math.max(...xs)) / 2
    }
    expect(center(male.positions)).toBeCloseTo(center(wire.positions), 5)
    expect(center(female.positions)).toBeCloseTo(center(wire.positions), 5)
    expect(male.indices.length > 0 && female.indices.length > 0).toBe(true)
  }
  expect(() =>
    createCableMeshes({
      definition: {
        ...definition,
        connectorB: { ...definition.connectorB, pinCount: 2 },
      },
      path,
    }),
  ).toThrow()
  expect(() =>
    createCableMeshes({
      definition: {
        ...definition,
        crossSection: {
          ...definition.crossSection,
          kind: "round_jacket",
          diameter: 2,
          color: "#263449",
        },
      },
      path,
    }),
  ).toThrow()
})
