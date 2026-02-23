import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOT886", async () => {
  const pngBuffer = await renderFootprint("sot886");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
