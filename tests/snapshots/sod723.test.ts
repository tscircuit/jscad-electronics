import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOD723 transistor", async () => {
  const pngBuffer = await renderFootprint("sod723");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
