import { expect, test } from "bun:test";
import "../fixtures/png-matcher";
import { render } from "lib/vanilla/render";
import { h } from "lib/vanilla/h";
import {
  Cuboid,
  Cylinder,
  Subtract,
  Translate,
  Colorize,
} from "lib/vanilla/primitives";
import { convertJscadModelToGltf } from "jscad-to-gltf";
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl";
import * as jscadModeling from "@jscad/modeling";

test("circular_hole_with_rect_pad plated hole", async () => {
  const hole = {
    shape: "circular_hole_with_rect_pad",
    x: 1.2,
    y: -0.5,
    rect_pad_width: 1.6,
    hole_diameter: 0.6,
  };
  const vnode = h(
    Colorize,
    { color: "#b87333" },
    h(
      Translate,
      { offset: [hole.x, hole.y, 0] },
      h(
        Subtract,
        {},
        h(Cuboid, {
          size: [hole.rect_pad_width, hole.rect_pad_width, 0.01],
          center: [0, 0, 0],
        }),
        h(Cylinder, { radius: hole.hole_diameter / 2, height: 0.01 }),
      ),
    ),
  );
  const { geometries } = render(vnode, jscadModeling);

  const gltfResult = await convertJscadModelToGltf(
    { geometries },
    {
      format: "glb",
      axisTransform: "jscad_y+ -> gltf_z+",
    },
  );

  const pngBuffer = await renderGLTFToPNGBufferFromGLBBuffer(
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string),
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1],
      ambient: 0.3,
      gamma: true,
      cull: true,
      grid: {
        infiniteGrid: true,
        cellSize: 0.5,
        sectionSize: 5,
        fadeDistance: 50,
        fadeStrength: 1.5,
        gridColor: [0.9, 0.9, 0.9],
        sectionColor: [0.7, 0.7, 0.7],
      },
    },
  );

  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path);
});
