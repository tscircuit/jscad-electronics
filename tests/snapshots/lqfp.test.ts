import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("LQFP-64 large IC package", async () => {
  const pngBuffer = await renderFootprint("lqfp64");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
