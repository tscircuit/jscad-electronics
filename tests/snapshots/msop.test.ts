import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("MSOP package", async () => {
  const pngBuffer = await renderFootprint("msop");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
