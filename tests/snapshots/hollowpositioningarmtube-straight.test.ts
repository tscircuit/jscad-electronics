import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { straightHollowPositioningArmTubeString } from "../fixtures/hollowpositioningarmtube-inputs"
import { renderHollowPositioningArmTubeSnapshot } from "../fixtures/render-hollowpositioningarmtube-snapshot"

test("hollowpositioningarmtube: four views of the straight ribbed tube", async () => {
  const png = await renderHollowPositioningArmTubeSnapshot(
    straightHollowPositioningArmTubeString,
    "HOLLOW POSITIONING ARM TUBE / STRAIGHT",
  )
  await expectPngSnapshot(png, import.meta.path)
}, 30000)
