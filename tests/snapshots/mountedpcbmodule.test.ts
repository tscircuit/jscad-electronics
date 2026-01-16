import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

test("mountedpcbmodule with pins and holes", async () => {
  const pngBuffer = await renderFootprint(
    "mountedpcbmodule",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
}, 10000)
