import { expect, test } from "bun:test"
import { PNG } from "pngjs"
import {
  getJstMotorConnector,
  getNemaMotorReferencePoints,
} from "@tscircuit/modelprinter"
import "./fixtures/png-matcher"
import { NemaMotor } from "../lib/NemaMotor"
import { renderComponent } from "./helpers/render-component"

test("JST PH and SH headers show their mating faces on the motor", async () => {
  // Range endpoints plus the existing PH6 model pin both new families and
  // backwards-compatible geometry. Each image pairs placement with a closeup
  // large enough to inspect individual contacts and the open mating face.
  for (const wireConnection of [
    "jst-ph-2",
    "jst-ph-6",
    "jst-ph-16",
    "jst-sh-2",
    "jst-sh-15",
  ] as const) {
    const spec = getJstMotorConnector(wireConnection)!
    const reference = getNemaMotorReferencePoints({ nemaSize: 17 }).wireside
      .position
    // renderComponent maps motor-local (x, y, z) mm to glTF (x, z, -y).
    const targetX = reference.x + spec.matingDepth / 2
    const distance = Math.max(12, spec.bodyWidth * 1.5)
    const element = <NemaMotor nemaSize={17} wireConnection={wireConnection} />
    const views = [
      await renderComponent(element, {
        camPos: [110, 35, 85],
        lookAt: [0, -20, 0],
        showGrid: false,
      }),
      await renderComponent(element, {
        camPos: [
          targetX + distance,
          reference.z + distance * 0.3,
          distance * 0.2,
        ],
        lookAt: [targetX, reference.z, -reference.y],
        showGrid: false,
      }),
    ]
    const sheet = new PNG({ width: 1600, height: 600 })
    for (const [i, view] of views.entries()) {
      PNG.bitblt(
        PNG.sync.read(Buffer.from(view)),
        sheet,
        0,
        0,
        800,
        600,
        i * 800,
        0,
      )
    }
    await expect(PNG.sync.write(sheet)).toMatchPngSnapshot(
      import.meta.path,
      `nema-${wireConnection}`,
    )
  }
}, 60000)
