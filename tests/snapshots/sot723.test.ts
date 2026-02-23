import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOT723 transistor", async () => {
  const pngBuffer = await renderFootprint("sot723");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
