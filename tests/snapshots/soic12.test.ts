import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOIC-12 IC package", async () => {
  const pngBuffer = await renderFootprint("soic12");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
