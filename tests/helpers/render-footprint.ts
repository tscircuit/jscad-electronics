import * as jscadModeling from "@jscad/modeling"
import type { Geometry } from "@jscad/modeling/src/geometries/types"
import { convertJscadModelToGltf } from "jscad-to-gltf"
import {
  createSceneFromGLTF,
  createUint8Bitmap,
  encodePNG,
  renderDrawCalls,
  renderGLTFToPNGFromGLB,
} from "poppygl"
import { importVanilla } from "../fixtures/importVanilla.js"
import {
  applyCameraPreset,
  getDefaultCameraResult,
  type CameraPreset,
} from "./camera-presets"
import type { RenderResult } from "../../lib/vanilla/render"

type Vec3 = [number, number, number]

type RenderFootprintOptions = {
  cameraPreset?: CameraPreset
  camPos?: Vec3
  lookAt?: Vec3
  fov?: number
  /**
   * Height of the reference grid plane, in board coordinates (jscad z).
   *
   * Pass 0 to put it where the board is. poppygl's default is the MODEL'S
   * MID-HEIGHT (`renderDrawCalls.ts`: `gridY = offset?.y ?? modelCenterY`),
   * which draws the plane through the middle of whatever is being rendered —
   * so every part looks half sunk into the board, and the grid says nothing
   * about where z = 0 is. With it pinned at 0 the grid becomes what it looks
   * like: pads and holes lie on it, bodies stand on it, leads pass through it.
   */
  gridZ?: number
  /**
   * Draw the copper pads see-through, at this opacity, so the leads and feet
   * standing on them stay visible — from underneath especially, where the
   * pads sit between the camera and everything else.
   *
   * This cannot go through the GLB path: `jscad-to-gltf` writes COLOR_0 as a
   * VEC3 and emits no materials at all, so a colour's alpha is dropped before
   * poppygl ever sees it. poppygl itself blends correctly, so a request for
   * transparency renders through its scene API with a BLEND material attached
   * to the pad primitives instead.
   */
  padOpacity?: number
}

const GLTF_AXIS_TRANSFORM = "jscad_y+ -> gltf_z+" as const

function applyGltfAxisTransform([x, y, z]: Vec3): Vec3 {
  return [x, z, -y]
}

function toVec3([x, y, z]: readonly [number, number, number]): Vec3 {
  return [x, y, z]
}

function getTransformedBoundingBox(geometry: RenderResult) {
  const geometries: Geometry[] = geometry.geometries.map(
    ({ geom }) => geom as Geometry,
  )
  const [minCorner, maxCorner] =
    jscadModeling.measurements.measureAggregateBoundingBox(...geometries)
  const [minX, minY, minZ] = toVec3(minCorner)
  const [maxX, maxY, maxZ] = toVec3(maxCorner)
  const transformedCorners = [
    applyGltfAxisTransform([minX, minY, minZ]),
    applyGltfAxisTransform([minX, minY, maxZ]),
    applyGltfAxisTransform([minX, maxY, minZ]),
    applyGltfAxisTransform([minX, maxY, maxZ]),
    applyGltfAxisTransform([maxX, minY, minZ]),
    applyGltfAxisTransform([maxX, minY, maxZ]),
    applyGltfAxisTransform([maxX, maxY, minZ]),
    applyGltfAxisTransform([maxX, maxY, maxZ]),
  ]

  let minTransformed = transformedCorners[0]!
  let maxTransformed = transformedCorners[0]!

  for (const [x, y, z] of transformedCorners.slice(1)) {
    minTransformed = [
      Math.min(minTransformed[0], x),
      Math.min(minTransformed[1], y),
      Math.min(minTransformed[2], z),
    ]
    maxTransformed = [
      Math.max(maxTransformed[0], x),
      Math.max(maxTransformed[1], y),
      Math.max(maxTransformed[2], z),
    ]
  }

  return [minTransformed, maxTransformed] as const
}

/**
 * Render a footprint to PNG using poppygl via GLTF conversion
 * This preserves colors correctly from the JSCAD model
 */
export async function renderFootprint(
  footprint: string,
  options: RenderFootprintOptions = {},
): Promise<Uint8Array> {
  const { getJscadModelForFootprint, getJscadModelForFootprintWithPads } =
    await importVanilla()
  const result = getJscadModelForFootprintWithPads(footprint, jscadModeling)

  // Which geometries are pads: `getJscadModelForFootprintWithPads` renders the
  // body first and `ExtrudedPads` after it, so everything past the body's own
  // geometry count is copper.
  const bodyGeometryCount = getJscadModelForFootprint(footprint, jscadModeling)
    .geometries.length

  // Convert JSCAD model to GLB format (preserves colors)
  // Use axisTransform to make objects lie flat (Y-up to Z-up)
  const gltfResult = await convertJscadModelToGltf(result, {
    format: "glb",
    axisTransform: GLTF_AXIS_TRANSFORM,
  })

  const glbBuffer =
    gltfResult.data instanceof ArrayBuffer
      ? gltfResult.data
      : Buffer.from(gltfResult.data as string)

  const cameraDistance =
    options.camPos && options.lookAt
      ? Math.hypot(
          options.camPos[0] - options.lookAt[0],
          options.camPos[1] - options.lookAt[1],
          options.camPos[2] - options.lookAt[2],
        )
      : 0

  // The grid fades from `fadeDistance` out to `fadeDistance * fadeStrength`,
  // so at a fixed 50mm it is entirely gone once everything is past 75mm: a
  // 53mm part like `breakoutheaders` is framed from 99mm away and renders
  // against blank white, with no datum at all.
  //
  // Raised ONLY in that case. Scaling it with every camera would move the
  // grid in renders that are perfectly readable already (`rj45-led-bottom`
  // and `to220f` are both framed from 40mm), and a snapshot that changes for
  // no reason is a snapshot nobody looks at.
  const GRID_FADE_DISTANCE = 50
  const GRID_FADE_STRENGTH = 1.5
  const gridWouldVanish =
    cameraDistance > GRID_FADE_DISTANCE * GRID_FADE_STRENGTH

  const baseRenderOptions = {
    width: 800,
    height: 600,
    backgroundColor: [1, 1, 1] as const,
    ambient: 0.3,
    gamma: true,
    cull: true as const,
    grid: {
      infiniteGrid: true,
      cellSize: 0.5,
      sectionSize: 5,
      fadeDistance: gridWouldVanish ? cameraDistance * 1.6 : GRID_FADE_DISTANCE,
      fadeStrength: GRID_FADE_STRENGTH,
      gridColor: [0.9, 0.9, 0.9] as const,
      sectionColor: [0.7, 0.7, 0.7] as const,
      ...(options.gridZ === undefined ? {} : { offset: { y: options.gridZ } }),
    },
  }

  if (!options.cameraPreset) {
    const cameraOptions = {
      ...baseRenderOptions,
      ...(options.fov === undefined ? {} : { fov: options.fov }),
      camPos: options.camPos,
      lookAt: options.lookAt,
    }
    if (options.padOpacity === undefined) {
      return renderGLTFToPNGFromGLB(glbBuffer, cameraOptions)
    }
    return renderWithTransparentPads(
      result,
      bodyGeometryCount,
      options.padOpacity,
      cameraOptions,
    )
  }

  const defaultFov = options.fov ?? 35
  const cameraOptions = applyCameraPreset(
    options.cameraPreset,
    getDefaultCameraResult(getTransformedBoundingBox(result), defaultFov),
  )

  return renderGLTFToPNGFromGLB(glbBuffer, {
    ...baseRenderOptions,
    fov: cameraOptions.fov,
    camPos: options.camPos ?? cameraOptions.camPos,
    lookAt: options.lookAt ?? cameraOptions.lookAt,
  })
}

/**
 * Render with the pad primitives made see-through.
 *
 * The GLB path cannot express this: `jscad-to-gltf` emits one mesh per
 * geometry with a VEC3 COLOR_0 and no materials, so alpha is lost in the
 * conversion. poppygl's renderer does support it — `alphaMode: "BLEND"` with
 * an alpha in `baseColorFactor`, blended after the opaque pass without writing
 * depth — so the glTF is patched with such a material for the pad meshes and
 * handed to poppygl's scene API directly.
 *
 * The mesh order is the geometry order, which is why the body count is enough
 * to identify the pads.
 */
async function renderWithTransparentPads(
  model: RenderResult,
  bodyGeometryCount: number,
  padOpacity: number,
  renderOptions: Record<string, unknown>,
): Promise<Uint8Array> {
  const gltfResult = await convertJscadModelToGltf(model, {
    format: "gltf",
    axisTransform: GLTF_AXIS_TRANSFORM,
  })

  const gltf =
    typeof gltfResult.data === "string"
      ? JSON.parse(gltfResult.data)
      : JSON.parse(new TextDecoder().decode(gltfResult.data as ArrayBuffer))

  // One mesh per geometry, in geometry order, is what makes a body/pad split
  // by index valid. It holds for jscad-to-gltf today; if a future version
  // merges or reorders meshes this stops being true, and a silent failure here
  // would make BODY geometry transparent instead of the pads.
  if ((gltf.meshes?.length ?? 0) !== model.geometries.length) {
    throw new Error(
      `expected one glTF mesh per geometry (${model.geometries.length}), got ` +
        `${gltf.meshes?.length ?? 0} — the pad/body split by index is no longer valid`,
    )
  }

  gltf.materials = gltf.materials ?? []
  const materialIndex = gltf.materials.length
  gltf.materials.push({
    name: "transparent-pad",
    // White base colour so the pad's own vertex colour survives: poppygl
    // multiplies COLOR_0 into baseColorFactor and takes alpha from the factor.
    pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, padOpacity] },
    alphaMode: "BLEND",
    doubleSided: true,
  })

  for (let i = bodyGeometryCount; i < (gltf.meshes?.length ?? 0); i++) {
    for (const primitive of gltf.meshes[i].primitives ?? []) {
      primitive.material = materialIndex
    }
  }

  const buffers = (gltf.buffers ?? []).map((buffer: { uri?: string }) => {
    const uri = buffer.uri ?? ""
    const base64 = uri.slice(uri.indexOf(",") + 1)
    return new Uint8Array(Buffer.from(base64, "base64"))
  })

  // Same encoder poppygl's own GLB entry point uses, so these PNGs are byte
  // comparable with the ones from the GLB path.
  const scene = createSceneFromGLTF(gltf, { buffers, images: [] })
  const { bitmap } = renderDrawCalls(
    scene.drawCalls,
    renderOptions as never,
    createUint8Bitmap,
  )
  return encodePNG(bitmap)
}
