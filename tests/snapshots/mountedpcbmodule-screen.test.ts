import { expect, test } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

// Snapshot: mounted PCB module with screen overlay and mounting holes

test("mountedpcbmodule with screen overlay and holes", async () => {
  const pngBuffer = await renderFootprint(
    "mountedpcbmodule_nopin_width60_height28_holes(topleft,topright,bottomleft,bottomright)_screen",
  );
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
