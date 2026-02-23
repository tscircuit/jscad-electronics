import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("Micro MELF package", async () => {
  const pngBuffer = await renderFootprint("micromelf");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
