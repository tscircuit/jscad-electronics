import { importVanilla } from "../fixtures/importVanilla.js"
import * as jscadModeling from "@jscad/modeling"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import { renderGLTFToPNGBufferFromGLBBuffer } from "poppygl"

/**
 * Render a footprint to PNG using poppygl via GLTF conversion
 * This preserves colors correctly from the JSCAD model
 */
export async function renderFootprint(footprint: string): Promise<Buffer> {
  const { getJscadModelForFootprint } = await importVanilla()
  const result = getJscadModelForFootprint(footprint, jscadModeling)

  // Convert JSCAD model to GLB format (preserves colors)
  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
  })

  // Render the GLB with grid settings
  // Note: renderGLTFToPNGBufferFromGLBBuffer will auto-frame the camera
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
  )

  return pngBuffer
}
