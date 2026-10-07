import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderNemaMotorMountSnapshot } from "../fixtures/nemamotormount-case"

test("nemamotormount NEMA17 complete model string - four views", async () => {
  await expectPngSnapshot(
    await renderNemaMotorMountSnapshot(17),
    import.meta.path,
  )
})
