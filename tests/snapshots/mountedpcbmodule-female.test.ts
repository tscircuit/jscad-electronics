import { expect, test } from "bun:test";
import { renderFootprint } from "tests/helpers/render-footprint";

test("mountedpcbmodule with female header and holes", async () => {
  const pngBuffer = renderFootprint(
    "mountedpcbmodule_pinrow20_rows2_pinrowbottom_width40_height22_female_holes(topleft,topright,bottomleft,bottomright)",
  );
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
}, 10000);
