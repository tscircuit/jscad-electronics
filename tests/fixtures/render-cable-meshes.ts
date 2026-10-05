import { mat4 } from "gl-matrix"
import type { CableMesh } from "../../lib/cables"
import {
  computeSmoothNormals,
  computeWorldAABB,
  renderDrawCalls,
  type DrawCall,
  type RenderOptionsInput,
} from "poppygl"

export function cableDrawCalls(meshes: CableMesh[]): DrawCall[] {
  return meshes.map((mesh) => {
    const positions = new Float32Array(
      mesh.smooth
        ? mesh.positions
        : mesh.indices.flatMap((index) =>
            mesh.positions.slice(index * 3, index * 3 + 3),
          ),
    )
    const indices = mesh.smooth ? new Uint32Array(mesh.indices) : null
    return {
      positions,
      indices,
      normals: computeSmoothNormals(positions, indices),
      uvs: null,
      model: mat4.create(),
      material: {
        baseColorFactor: mesh.color,
        baseColorTexture: null,
        metallicFactor: mesh.material?.metalness ?? 0,
        roughnessFactor: mesh.material?.roughness ?? 0.7,
      },
    }
  })
}

export function renderCableMeshes(
  meshes: CableMesh[],
  options: RenderOptionsInput & { detail?: boolean } = {},
) {
  const drawCalls = cableDrawCalls(meshes)
  const bounds = computeWorldAABB(drawCalls)
  const center = bounds.min.map(
    (minimum, axis) => (minimum + bounds.max[axis]!) / 2,
  ) as [number, number, number]
  const extents = bounds.max.map((maximum, axis) => maximum - bounds.min[axis]!)
  const span = options.detail ? Math.hypot(...extents) : Math.max(...extents)
  const direction = options.detail ? [0.7, 0.6, -1.8] : [0.95, -1.25, 1.05]
  const camPos = center.map(
    (coordinate, axis) => coordinate + direction[axis]! * span,
  ) as [number, number, number]
  return renderDrawCalls(drawCalls, {
    width: 720,
    height: 420,
    supersampling: 2,
    camPos,
    lookAt: center,
    up: options.detail ? "y+" : "z+",
    fov: 32,
    realistic: true,
    ambient: 0.3,
    lightDir: [-0.4, -0.8, -0.6],
    grid: false,
    backgroundColor: [1, 1, 1],
    cull: true,
    ...options,
  })
}
