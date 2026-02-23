import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOT323 transistor", async () => {
  const pngBuffer = await renderFootprint("sot323");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
