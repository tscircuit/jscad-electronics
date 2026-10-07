import { test } from "bun:test"
import { createCableMeshes } from "../../lib/cables"
import { adapterCableExamples } from "../fixtures/adapter-cable-examples"
import { renderModelSnapshot } from "../fixtures/render-model-snapshot"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"

for (const { name, modelString, definition } of adapterCableExamples) {
  test(`${name} / independently pitched ends / standard four views`, async () => {
    const meshes = createCableMeshes({
      definition,
      path: [
        [0, 0, 0],
        [0, 0, 10],
        [0, 0, 70],
      ],
    })
    const positions: number[] = []
    const indices: number[] = []
    for (const mesh of meshes) {
      const offset = positions.length / 3
      positions.push(...mesh.positions)
      indices.push(...mesh.indices.map((index) => index + offset))
    }
    const target: [number, number, number] = [0, 0, 35]
    const span = 115
    const png = await renderModelSnapshot({
      mesh: { positions, indices },
      title: `Adapter cable / ${name}`,
      modelString,
      views: [
        {
          name: "ISOMETRIC",
          detail: "compact bundle / fanout in the last 20 mm",
          eye: [100, -100, 130],
          target,
          span,
        },
        {
          name: "TOP",
          detail: "end contact spacing",
          eye: [0, 0, 210],
          target,
          span,
        },
        {
          name: "FRONT",
          detail: "wires meet each connector's contact pitch",
          eye: [0, -180, 35],
          target,
          span,
        },
        {
          name: "SIDE",
          detail: "unchanged supplied centerline",
          eye: [180, 0, 35],
          target,
          span,
        },
      ],
      footer:
        "Connector-local dimensions / supplied world path in mm, +Z up / one wire per contact",
    })
    await expectPngSnapshot(
      png,
      import.meta.path.replace(".test.ts", `-${name}.test.ts`),
    )
  }, 30000)
}
