import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOT457 diode", async () => {
  const pngBuffer = await renderFootprint("sot457");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
