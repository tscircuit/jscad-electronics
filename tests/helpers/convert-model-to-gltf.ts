import {
  convertJscadModelToGltf as convert,
  type JscadRenderedModel,
  type ConvertJscadPlanToGltfOptions,
} from "jscad-to-gltf"

// Unannotated sample geometry is dielectric, not glTF's implicit pure metal.
// Explicit component finishes take precedence and are exported unchanged.
export function convertJscadModelToGltf(
  model: JscadRenderedModel,
  options?: ConvertJscadPlanToGltfOptions,
) {
  return convert(
    {
      geometries: model.geometries.map((entry) => ({
        ...entry,
        material: {
          metalness: 0,
          roughness: 0.65,
          ...entry.geom.material,
          ...entry.material,
        },
      })),
    },
    options,
  )
}
