import { expect, test } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

// Snapshot: screen with explicit screenWidth and screenHeight overrides

test("mountedpcbmodule with custom screen dimensions", async () => {
  const pngBuffer = await renderFootprint(
    "mountedpcbmodule_pinrow10_rows1_pinrowbottom_width50_height30_screen_screenwidth20_screenheight15_screencenteroffsetx10_screencenteroffsety4",
  );
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
