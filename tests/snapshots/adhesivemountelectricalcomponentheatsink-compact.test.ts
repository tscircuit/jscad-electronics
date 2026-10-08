import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { compactString } from "../fixtures/adhesivemountelectricalcomponentheatsink-inputs"
import { renderAdhesiveMountElectricalComponentHeatsinkSnapshot } from "../fixtures/render-adhesivemountelectricalcomponentheatsink-snapshot"
test("adhesivemountelectricalcomponentheatsink compact: labeled four-view snapshot", async () => {
  await expectPngSnapshot(
    await renderAdhesiveMountElectricalComponentHeatsinkSnapshot(compactString),
    import.meta.path,
  )
}, 30000)
