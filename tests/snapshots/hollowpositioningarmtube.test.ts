import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { lampHollowPositioningArmTubeString } from "../fixtures/hollowpositioningarmtube-inputs"
import { renderHollowPositioningArmTubeSnapshot } from "../fixtures/render-hollowpositioningarmtube-snapshot"

test("hollowpositioningarmtube: four views of the ribbed reading-lamp arm", async () => {
  const png = await renderHollowPositioningArmTubeSnapshot(
    lampHollowPositioningArmTubeString,
    "HOLLOW POSITIONING ARM TUBE / 90 DEGREE BEND",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
