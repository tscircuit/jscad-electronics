import { expect, test } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

// MountedPCBModule footprint with through-hole pins (hollow pipes) and mounting holes
// Ensures 3D renderer handles PCB modules with pin rows, hollow pipes, and holes

test("mountedpcbmodule with pins and holes", async () => {
  const pngBuffer = await renderFootprint(
    "mountedpcbmodule_pinrow40_rows2_pinrowbottom_width65_height30.5_holes(topleft,topright,bottomleft,bottomright)",
  );
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
}, 10000);
