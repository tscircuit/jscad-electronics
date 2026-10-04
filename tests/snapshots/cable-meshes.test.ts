import { test } from "bun:test"
import { encodePNG } from "poppygl"
import {
  createCableMeshes,
  type CableGeometryDefinition,
  type CablePoint,
} from "../../lib/cables"
import { createAnnotatedViewSheet } from "../fixtures/annotated-view-sheet"
import { cableExamplePath, cableExamples } from "../fixtures/cable-examples"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderCableMeshes } from "../fixtures/render-cable-meshes"

const names = ["usb-c", "jst-sh", "jst-ph", "us-mains"] as const

async function connectorView(
  definition: CableGeometryDefinition,
  end: "A" | "B",
  commonScale = false,
) {
  const connector = end === "A" ? definition.connectorA : definition.connectorB
  const meshes = createCableMeshes({
    definition: { ...definition, connectorA: connector, connectorB: connector },
    path: [
      [0, 0, 0],
      [0, 0, 35],
    ],
  }).filter((mesh) => mesh.name.startsWith("A-"))
  return encodePNG(
    renderCableMeshes(meshes, {
      width: 600,
      height: 400,
      detail: true,
      ...(commonScale
        ? { camPos: [10, 8, -24] as const, lookAt: [0, 0, -3] as const }
        : {}),
    }).bitmap,
  )
}

for (const [index, name] of names.entries()) {
  test(`${name} cable mesh, mating faces and contact details`, async () => {
    const definition = cableExamples[index]!
    const meshes = createCableMeshes({ definition, path: cableExamplePath })
    const png = createAnnotatedViewSheet(
      [
        {
          png: await encodePNG(
            renderCableMeshes(meshes, { width: 600, height: 400 }).bitmap,
          ),
          annotation: `${name} / RESOLVED 3D PATH\ncreateCableMeshes({ definition, path })`,
        },
        {
          png: await connectorView(definition, "A"),
          annotation: `CONNECTOR A / ${definition.connectorA.kind}\nCAVITIES, CONTACTS AND STRAIN RELIEF`,
        },
        {
          png: await connectorView(definition, "B"),
          annotation: `CONNECTOR B / ${definition.connectorB.kind}\nOPPOSITE ENDPOINT CONNECTOR`,
        },
      ],
      { columns: 3, fontSize: 20, annotationHeight: 80 },
    )
    await expectPngSnapshot(
      png,
      import.meta.path.replace(".test.ts", `-${name}.test.ts`),
    )
  })
}

test("JST SH and PH housings, contacts and pin counts at a common camera scale", async () => {
  const views = []
  for (const index of [1, 2]) {
    const base = cableExamples[index]!
    for (const pinCount of [2, 4, 6]) {
      if (!("pinCount" in base.connectorA)) throw new Error("Expected JST")
      const pitch = base.connectorA.pitch
      const connector = {
        ...base.connectorA,
        pinCount,
        bodyWidth: pitch === 1 ? pinCount + 1 : (pinCount - 1) * 2 + 3.8,
      }
      const definition: CableGeometryDefinition = {
        connectorA: connector,
        connectorB: connector,
        crossSection: {
          kind: "wire_bundle",
          wirePitch: pitch,
          wires: Array.from({ length: pinCount }, () => ({
            diameter: pitch === 1 ? 0.6 : 1.2,
            color: "#263449",
          })),
        },
      }
      views.push({
        png: await connectorView(definition, "A", true),
        annotation: `${connector.kind} / ${pinCount} CONTACTS\n${pitch} mm PITCH / ${connector.bodyWidth} mm HOUSING WIDTH`,
      })
    }
  }
  await expectPngSnapshot(
    createAnnotatedViewSheet(views, {
      columns: 3,
      fontSize: 22,
      annotationHeight: 80,
    }),
    import.meta.path.replace(".test.ts", "-jst-pin-counts.test.ts"),
  )
})

test("multiple cable meshes follow spatial paths and endpoint frames", async () => {
  const meshes = [0, 1, 3].flatMap((exampleIndex, index) => {
    const path: CablePoint[] = cableExamplePath.map(([x, y, z]) => [
      x * 1.5,
      y + index * 70,
      z + x * 0.3 + index * 15,
    ])
    return createCableMeshes({ definition: cableExamples[exampleIndex]!, path })
  })
  const views = []
  for (const view of [
    { name: "ISOMETRIC", camPos: [250, -200, 230] as const },
    { name: "OPPOSITE SIDE", camPos: [-220, 280, 200] as const },
  ]) {
    views.push({
      png: await encodePNG(
        renderCableMeshes(meshes, {
          width: 850,
          height: 550,
          camPos: view.camPos,
          lookAt: [0, 85, 10],
        }).bitmap,
      ),
      annotation: `${view.name} / USB-C, JST SH, US MAINS\nSPATIAL SWEEPS AND CONNECTOR ENDPOINT FRAMES`,
    })
  }
  await expectPngSnapshot(
    createAnnotatedViewSheet(views, { columns: 2, fontSize: 22 }),
    import.meta.path.replace(".test.ts", "-spatial-paths.test.ts"),
  )
})
