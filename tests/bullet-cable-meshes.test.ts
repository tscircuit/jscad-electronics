import { expect, test } from "bun:test"
import { componentMaterials } from "../lib/materials"
import { createCableMeshes, type CableGeometryDefinition } from "../lib/cables"
import {
  createConnectorMeshes,
  connectorWireExitDepth,
} from "../lib/cables/connector-meshes"

test("bullet contacts have distinct pin and socket geometry at both cable ends", () => {
  for (const diameter of [2, 3, 3.5, 4, 5, 5.5, 6, 8]) {
    const bodyDepth = diameter * 3.5
    const connectorA = {
      kind: "bullet_male" as const,
      diameter,
      contactDepth: diameter * 2,
      pinCount: 1,
      pitch: diameter + 2,
      bodyWidth: diameter + 0.6,
      bodyHeight: diameter + 0.6,
      bodyDepth,
    }
    const connectorB = {
      ...connectorA,
      kind: "bullet_female" as const,
      bodyWidth: diameter + 1,
      bodyHeight: diameter + 1,
    }
    const definition: CableGeometryDefinition = {
      connectorA,
      connectorB,
      crossSection: { kind: "round_jacket", diameter: 2, color: "#263449" },
    }
    const meshes = createCableMeshes({
      definition,
      path: [
        [0, 0, 0],
        [0, 0, 60],
      ],
    })
    expect(meshes.map((mesh) => mesh.name)).toEqual([
      "jacket",
      "A-bullet-pin",
      "A-solder-cup",
      "B-bullet-socket",
      "B-solder-cup",
    ])
    for (const mesh of meshes) {
      if (mesh.name !== "jacket")
        expect(mesh.material).toEqual(componentMaterials.goldContact)
      expect(mesh.positions.every(Number.isFinite)).toBe(true)
      expect(
        mesh.indices.every(
          (index) => index >= 0 && index < mesh.positions.length / 3,
        ),
      ).toBe(true)
    }
    expect(connectorWireExitDepth(connectorA)).toBe(bodyDepth)
    const socket = createConnectorMeshes({ connector: connectorB })[0]!
    // Mouth vertices lie on the nominal inner radius, not a filled disk.
    const mouthRadii = socket.positions.flatMap((_, index) =>
      index % 3 === 0 && Math.abs(socket.positions[index + 2]!) < 1e-5
        ? [Math.hypot(socket.positions[index]!, socket.positions[index + 1]!)]
        : [],
    )
    expect(Math.min(...mouthRadii)).toBeCloseTo(diameter / 2, 4)
    expect(Math.max(...mouthRadii)).toBeCloseTo(connectorB.bodyWidth / 2, 4)
    expect(() =>
      createCableMeshes({
        definition: {
          ...definition,
          connectorB: { ...connectorB, contactDepth: bodyDepth + 1 },
        },
        path: [
          [0, 0, 0],
          [0, 0, 60],
        ],
      }),
    ).toThrow()
  }
})
