import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOT963", async () => {
  const pngBuffer = await renderFootprint("sot963");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
