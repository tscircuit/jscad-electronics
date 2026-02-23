import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("HC49 package", async () => {
  const pngBuffer = await renderFootprint("hc49");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
