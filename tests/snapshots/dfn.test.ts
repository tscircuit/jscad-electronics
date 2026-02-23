import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("DFN8 ", async () => {
  const pngBuffer = await renderFootprint("dfn8_w5.3mm_p1.27mm");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
