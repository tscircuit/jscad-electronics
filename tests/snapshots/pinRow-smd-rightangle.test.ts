import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("6-pin SMD right-angle pinrow", async () => {
  const pngBuffer = await renderFootprint("pinrow6_smd_rightangle");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
