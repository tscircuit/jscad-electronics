import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { standardString } from "../fixtures/adhesivemountelectricalcomponentheatsink-inputs"
import { renderAdhesiveMountElectricalComponentHeatsinkSnapshot } from "../fixtures/render-adhesivemountelectricalcomponentheatsink-snapshot"
test("adhesivemountelectricalcomponentheatsink standard: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderAdhesiveMountElectricalComponentHeatsinkSnapshot(
      standardString,
    ),
    import.meta.path,
  )
}, 30000)
