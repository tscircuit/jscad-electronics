import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("TO220", async () => {
  const pngBuffer = await renderFootprint("to220");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
