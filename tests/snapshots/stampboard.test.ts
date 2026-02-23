import { test, expect } from "bun:test";
import "../fixtures/png-matcher";
import { renderFootprint } from "../helpers/render-footprint";

// Stampboard/stampreceiver footprint with inner holes on all sides
// Ensures 3D renderer handles stamp-style boards
// with symmetrical pin counts and optional inner holes

test("stampboard receiver with inner holes", async () => {
  const pngBuffer = await renderFootprint(
    "stampreceiver_left20_right20_bottom3_top3_w21mm_innerhole",
  );
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
}, 10000);
