import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import { renderFootprint } from "../helpers/render-footprint"

// MountedPCBModule footprint with through-hole pins (hollow pipes) and mounting holes
// Ensures 3D renderer handles PCB modules with pin rows, hollow pipes, and holes

test("mountedpcbmodule with pins and holes", async () => {
  const pngBuffer = await renderFootprint(
    "mountedpcbmodule_numPins4_rows1_p2.54mm_id1mm_od1.5mm_w10mm_h10mm_pinRowSideleft_holes(topleft,topright,bottomleft,bottomright)",
  )
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
}, 10000)
