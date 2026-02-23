import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("LQFP-100 large IC package", async () => {
  const pngBuffer = await renderFootprint("lqfp100");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
