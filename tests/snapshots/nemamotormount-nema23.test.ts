import { test } from "bun:test"
import { expectPngSnapshot } from "../fixtures/expect-png-snapshot"
import { renderNemaMotorMountSnapshot } from "../fixtures/nemamotormount-case"

test("nemamotormount NEMA23 complete model string - four views", async () => {
  await expectPngSnapshot(
    await renderNemaMotorMountSnapshot(23),
    import.meta.path,
  )
})
