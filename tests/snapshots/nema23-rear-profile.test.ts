import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderNema23RearProfile } from "../fixtures/render-nema23-rear-profile"

for (const mode of ["backfaceholes", "backfacescrews", "plainbackface"]) {
  const modelString = `nema23_nowires_${mode}`
  test(`${modelString} four views`, async () => {
    await expect(await renderNema23RearProfile(modelString)).toMatchPngSnapshot(
      import.meta.path,
      `nema23-${mode}`,
    )
  }, 30_000)
}
