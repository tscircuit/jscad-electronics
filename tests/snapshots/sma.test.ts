import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SMA diode", async () => {
  const pngBuffer = await renderFootprint("sma");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
