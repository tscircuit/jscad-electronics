import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SOD123W diode", async () => {
  const pngBuffer = await renderFootprint("sod123w");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
