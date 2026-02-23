import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("TQFP-64 large IC package", async () => {
  const pngBuffer = await renderFootprint("tqfp64");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
