import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("0402 SMD component", async () => {
  const pngBuffer = await renderFootprint("0402");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
