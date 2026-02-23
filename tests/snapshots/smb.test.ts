import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

test("SMB diode", async () => {
  const pngBuffer = await renderFootprint("smb");
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
