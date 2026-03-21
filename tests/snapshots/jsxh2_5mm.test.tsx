import { expect, test } from "bun:test"
import "../fixtures/png-matcher"
import * as React from "react"
import * as jscadModeling from "@jscad/modeling"
import { createJSCADRenderer } from "jscad-fiber"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"
import { JSXH2_5mm } from "../../lib/JSXH2_5mm"
import { Colorize, Cuboid, Translate } from "jscad-fiber"

async function renderComponentTopView(
  element: React.ReactElement,
): Promise<Buffer> {
  const container: any[] = []
  const { createJSCADRoot } = createJSCADRenderer(jscadModeling as any)
  const root = createJSCADRoot(container)
  root.render(element)

  const result = { geometries: container.map((geom) => ({ geom })) }

  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: "jscad_y+ -> gltf_z+",
  })

  // Apply top-down camera preset for better component visibility
  const pngBuffer = await renderGLTFToPNGBufferFromGLBBuffer(
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string),
    {
      width: 800,
      height: 600,
      backgroundColor: [1, 1, 1],
      ambient: 0.5,
      gamma: true,
      cull: true,
      camPos: [0.001, 20, -0.05],
      lookAt: [0, 0, 0],
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
  )

  return pngBuffer
}

test("JSXH 2.5mm component", async () => {
  const element = (
    <>
      <Colorize color="#4c8c2b">
        <Translate offset={[0, 0, -0.5]}>
          <Cuboid size={[20, 20, 1]} center={[0, 0, 0]} />
        </Translate>
      </Colorize>
      <JSXH2_5mm numPins={4} />
    </>
  )
  const pngBuffer = await renderComponentTopView(element)
  await expect(pngBuffer).toMatchPngSnapshot(import.meta.path)
})
