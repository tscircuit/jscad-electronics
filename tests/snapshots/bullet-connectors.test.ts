import { test } from "bun:test"
import { createConnectorMeshes } from "../../lib/cables/connector-meshes"
import type { CableConnectorSpec } from "../../lib/cables"
import { componentMaterials } from "../../lib/materials"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

for (const pinCount of [1, 3]) {
  for (const gender of ["male", "female"] as const) {
    test(`bullet ${gender} / ${pinCount} contacts / standard four views`, async () => {
      const diameter = 3.5
      const bodyHeight = diameter + (gender === "male" ? 0.6 : 1)
      const connector: CableConnectorSpec = {
        kind: gender === "male" ? "bullet_male" : "bullet_female",
        diameter,
        contactDepth: diameter * 2,
        pinCount,
        pitch: diameter + 2,
        bodyWidth: bodyHeight + (pinCount - 1) * (diameter + 2),
        bodyHeight,
        bodyDepth: diameter * 3.5,
      }
      const meshes = createConnectorMeshes({ connector })
      const positions: number[] = []
      const indices: number[] = []
      for (const mesh of meshes) {
        const offset = positions.length / 3
        positions.push(...mesh.positions)
        indices.push(...mesh.indices.map((index) => index + offset))
      }
      const target: [number, number, number] = [0, 0, connector.bodyDepth / 2]
      const span = Math.max(connector.bodyWidth, connector.bodyDepth) * 1.8
      const png = await renderModelSnapshot({
        mesh: { positions, indices },
        color: meshes[0]!.color,
        ...componentMaterials.goldContact,
        title: `Bullet ${gender} / ${pinCount} ${pinCount === 1 ? "contact" : "contacts"}`,
        modelString: `bullet${pinCount === 1 ? "" : pinCount}_d3.5mm_a${gender}_b${gender}`,
        views: [
          {
            name: "ISOMETRIC",
            detail: "mating face and cylindrical contacts",
            eye: [25, -35, -25],
            target,
            span,
          },
          {
            name: "TOP",
            detail: "wire-side solder cup openings",
            eye: [0, 0, 50],
            target,
            span,
          },
          {
            name: "FRONT",
            detail: "contact length and spring slots",
            eye: [0, -50, target[2]],
            target,
            span,
          },
          {
            name: "SIDE",
            detail: "solder cup and contact profile",
            eye: [50, 0, target[2]],
            target,
            span,
          },
        ],
        footer:
          "Nominal mating diameter 3.5 mm / mouth at z=0 / +Z toward wire exit / gold contacts",
      })
      await expectPngSnapshot(
        png,
        import.meta.path.replace(".test.ts", `-${pinCount}-${gender}.test.ts`),
      )
    }, 30000)
  }
}
