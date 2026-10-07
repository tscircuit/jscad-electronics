import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { smoothHollowPositioningArmTubeString } from "../fixtures/hollowpositioningarmtube-inputs"
import { renderHollowPositioningArmTubeSnapshot } from "../fixtures/render-hollowpositioningarmtube-snapshot"

test("hollowpositioningarmtube: four views of the smooth U bend", async () => {
  const png = await renderHollowPositioningArmTubeSnapshot(
    smoothHollowPositioningArmTubeString,
    "HOLLOW POSITIONING ARM TUBE / SMOOTH U BEND",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
