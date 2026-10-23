import { withReferences } from "@tscircuit/jscad"
import type { MaterialOptions } from "jscad-fiber"
import type * as jscadModeling from "@jscad/modeling"

import { Fragment, type VNode } from "./h"
import {
  Colorize,
  Custom,
  Cube,
  Cuboid,
  Cylinder,
  Sphere,
  Hull,
  Rotate,
  RoundedCuboid,
  Subtract,
  Translate,
  Union,
  Polygon,
  ExtrudeLinear,
  RoundedCylinder,
  type Color,
} from "./primitives"

interface RenderContext {
  jscad: typeof jscadModeling
  referenceFeatures?: Record<string, JscadReferenceFeature>
  matrix?: jscadModeling.maths.mat4.Mat4
}

export type NativeGeometry =
  | jscadModeling.geometries.geom2.Geom2
  | jscadModeling.geometries.path2.Path2
  | jscadModeling.geometries.geom3.Geom3

export interface JscadReferenceFeature {
  geometry: NativeGeometry
  matrix: number[]
}

export interface JscadModel {
  geometries: NativeGeometry[]
  referenceFeatures: Record<string, JscadReferenceFeature>
}

export type ColoredGeom = {
  geom: any
  color?: Color
  material?: MaterialOptions
}
export type RenderResult = { geometries: ColoredGeom[] }

const isVNode = (n: any): n is VNode =>
  n && typeof n === "object" && "type" in n

const degToRad = (v: number | string | undefined): number => {
  if (typeof v === "number") return v
  if (typeof v === "string") {
    const m = /^(-?\d+(?:\.\d+)?)\s*deg$/i.exec(v)
    if (m) return (parseFloat(m[1]!) * Math.PI) / 180
    const n = Number(v)
    if (!Number.isNaN(n)) return n
  }
  return 0
}

const toVec3 = (v: any): [number, number, number] => {
  if (Array.isArray(v))
    return [Number(v[0]) || 0, Number(v[1]) || 0, Number(v[2]) || 0]
  if (typeof v === "object" && v)
    return [Number(v.x) || 0, Number(v.y) || 0, Number(v.z) || 0]
  return [0, 0, 0]
}

const assertFiniteFeatureTransform = (values: readonly number[]) => {
  if (!values.every(Number.isFinite))
    throw new Error("JSCAD reference feature transforms must be finite")
}

const transformFeatureContext = (
  context: RenderContext,
  local: jscadModeling.maths.mat4.Mat4,
): RenderContext => {
  if (!context.referenceFeatures) return context
  const { mat4 } = context.jscad.maths
  const matrix = mat4.multiply(mat4.create(), context.matrix!, local)
  assertFiniteFeatureTransform(matrix)
  return { ...context, matrix }
}

const validateFeatureName = (name: unknown) => {
  if (name !== undefined && (typeof name !== "string" || !name.trim()))
    throw new Error("Named JSCAD features require a nonblank name")
}

const recordFeature = (
  context: RenderContext,
  name: string | undefined,
  geometry: NativeGeometry,
) => {
  if (!context.referenceFeatures || name === undefined) return
  if (Object.hasOwn(context.referenceFeatures, name))
    throw new Error(`Duplicate JSCAD feature name "${name}"`)
  const { geometries } = context.jscad
  if (
    !geometries.geom2.isA(geometry) &&
    !geometries.path2.isA(geometry) &&
    !geometries.geom3.isA(geometry)
  )
    throw new Error(`Named JSCAD feature "${name}" requires native geometry`)
  assertFiniteFeatureTransform(context.matrix!)
  context.referenceFeatures[name] = {
    geometry,
    matrix: [...context.matrix!],
  }
}

function renderNode(
  node: any,
  colorCtx: Color | undefined,
  renderCtx: RenderContext,
): ColoredGeom[] {
  const {
    jscad: { primitives, booleans, hulls, geometries, extrusions, transforms },
  } = renderCtx
  if (node == null || node === false) return []
  if (Array.isArray(node))
    return node.flatMap((n) => renderNode(n, colorCtx, renderCtx))

  // Already a geometry coming from user? ignore in our case
  if (!isVNode(node)) return []

  const { type, props, children } = node
  if (props?.material) {
    const { material, ...rest } = props
    return renderNode({ ...node, props: rest }, colorCtx, renderCtx).map(
      (entry) => ({
        ...entry,
        material: { ...material },
        geom: { ...entry.geom, material: { ...material } },
      }),
    )
  }

  if (type === Fragment) {
    return (children ?? []).flatMap((c) => renderNode(c, colorCtx, renderCtx))
  }

  if (type === Colorize) {
    const newColor: Color = props?.color
    return (children ?? []).flatMap((c) =>
      renderNode(c, newColor ?? colorCtx, renderCtx),
    )
  }

  if (type === Translate) {
    // accept either `offset`, `center` (array or object), or x/y/z props
    const offset = props?.offset ??
      props?.center ?? { x: props?.x, y: props?.y, z: props?.z }
    if (renderCtx.referenceFeatures)
      assertFiniteFeatureTransform(
        (Array.isArray(offset)
          ? offset.slice(0, 3)
          : [offset?.x, offset?.y, offset?.z]
        ).map((value) => Number(value ?? 0)),
      )
    const off = toVec3(offset)
    const { mat4 } = renderCtx.jscad.maths
    const childContext = transformFeatureContext(
      renderCtx,
      mat4.fromTranslation(mat4.create(), off),
    )
    const geoms = (children ?? []).flatMap((c) =>
      renderNode(c, colorCtx, childContext),
    )
    return geoms.map(({ geom, color, material }) => ({
      material,
      geom: transforms.translate(off as any, geom),
      color: color ?? colorCtx,
    }))
  }

  if (type === Rotate) {
    // Match jscad-fiber's angles prop while retaining the vanilla aliases.
    const angles = props?.angles ?? props?.rotation
    if (renderCtx.referenceFeatures)
      assertFiniteFeatureTransform(
        (Array.isArray(angles)
          ? angles.slice(0, 3)
          : [props?.x, props?.y, props?.z]
        ).map((value) =>
          Number(
            typeof value === "string"
              ? value.replace(/\s*deg$/i, "")
              : (value ?? 0),
          ),
        ),
      )
    const rot: [number, number, number] = Array.isArray(angles)
      ? [degToRad(angles[0]), degToRad(angles[1]), degToRad(angles[2])]
      : [
          degToRad(props?.x ?? 0),
          degToRad(props?.y ?? 0),
          degToRad(props?.z ?? 0),
        ]
    const { mat4 } = renderCtx.jscad.maths
    const childContext = transformFeatureContext(
      renderCtx,
      mat4.fromTaitBryanRotation(mat4.create(), rot[2], rot[1], rot[0]),
    )
    const geoms = (children ?? []).flatMap((c) =>
      renderNode(c, colorCtx, childContext),
    )
    return geoms.map(({ geom, color, material }) => ({
      material,
      geom: transforms.rotateZ(
        rot[2],
        transforms.rotateY(rot[1], transforms.rotateX(rot[0], geom)),
      ),
      color,
    }))
  }

  if (type === Union || type === Subtract || type === Hull) {
    const entries = (children ?? []).flatMap((c) =>
      renderNode(c, colorCtx, renderCtx),
    )
    const geoms = entries.map((g) => g.geom)
    if (geoms.length === 0) return []
    let geom: any
    if (type === Union) geom = booleans.union(geoms as any)
    else if (type === Subtract)
      geom = booleans.subtract(geoms[0] as any, geoms.slice(1) as any)
    else geom = hulls.hull(geoms as any)
    return [
      {
        geom,
        color: colorCtx,
        material: type === Subtract ? entries[0]?.material : undefined,
      },
    ]
  }

  if (type === Custom) {
    const { name, reference, geometry } = props
    validateFeatureName(name)
    if (reference && name === undefined)
      throw new Error("Named JSCAD features require a nonblank name")
    recordFeature(renderCtx, name, geometry)
    if (reference) return []
    return [{ geom: props.geometry, color: colorCtx }]
  }

  if (type === Polygon) {
    const points: Array<[number, number]> = props?.points ?? []
    const origin: [number, number] = points[0] ?? [0, 0]
    const area = points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length]!
      return (
        sum +
        (point[0] - origin[0]) * (next[1] - origin[1]) -
        (next[0] - origin[0]) * (point[1] - origin[1])
      )
    }, 0)
    const oriented = area < 0 ? [...points].reverse() : points
    const g2 = geometries.geom2.fromPoints(oriented as any)
    return [{ geom: g2, color: colorCtx ?? props?.color }]
  }

  if (type === ExtrudeLinear) {
    const { topOutlineName, bottomOutlineName, twistAngle, twistSteps } = props
    const namedOutline =
      topOutlineName !== undefined || bottomOutlineName !== undefined
    const height = props?.height ?? props?.h ?? 1
    validateFeatureName(topOutlineName)
    validateFeatureName(bottomOutlineName)
    if (namedOutline) {
      if (!Number.isFinite(height) || !Number.isFinite(twistAngle ?? 0))
        throw new Error(
          "Named extrusion outlines require finite height and twistAngle",
        )
      if (
        twistSteps !== undefined &&
        (!Number.isInteger(twistSteps) || twistSteps < 1)
      )
        throw new Error(
          "Named extrusion outlines require positive integer twistSteps",
        )
    }
    const entries = (children ?? []).flatMap((c) =>
      renderNode(c, colorCtx, renderCtx),
    )
    const geoms2 = entries.map((g) => g.geom)
    if (geoms2.length === 0) return []
    if (namedOutline && geoms2.length !== 1)
      throw new Error("Named extrusion outlines require exactly one profile")
    const base2 =
      geoms2.length > 1 ? (booleans.union as any)(geoms2) : geoms2[0]
    if (
      namedOutline &&
      !geometries.geom2.isA(base2) &&
      !(geometries.path2.isA(base2) && base2.isClosed)
    )
      throw new Error(
        "Named extrusion outlines require a geom2 or closed path2 profile",
      )
    if (namedOutline && renderCtx.referenceFeatures) {
      const { mat4 } = renderCtx.jscad.maths
      const topContext = transformFeatureContext(
        renderCtx,
        mat4.multiply(
          mat4.create(),
          mat4.fromTranslation(mat4.create(), [0, 0, height]),
          mat4.fromZRotation(mat4.create(), twistAngle ?? 0),
        ),
      )
      recordFeature(topContext, topOutlineName, base2)
      recordFeature(renderCtx, bottomOutlineName, base2)
    }
    const g3 = extrusions.extrudeLinear(
      {
        height,
        ...(twistAngle !== undefined ? { twistAngle } : {}),
        ...(twistSteps !== undefined ? { twistSteps } : {}),
      },
      base2,
    )

    return [
      {
        geom: g3,
        color: colorCtx ?? props?.color,
        material: entries.length === 1 ? entries[0]?.material : undefined,
      },
    ]
  }

  if (
    type === Cuboid ||
    type === Cube ||
    type === Cylinder ||
    type === Sphere ||
    type === RoundedCuboid ||
    type === RoundedCylinder
  ) {
    let g: any
    if (type === Cuboid) {
      const size = props?.size ?? [1, 1, 1]
      const offset = props?.offset
      const center =
        props?.center ??
        (offset ? [offset[0], offset[1], offset[2]] : [0, 0, 0])
      g = primitives.cuboid({ size, center })
    } else if (type === Cube) {
      const size = props?.size ?? 1
      const offset = props?.offset
      const center =
        props?.center ??
        (offset ? [offset[0], offset[1], offset[2]] : [0, 0, 0])
      g = primitives.cube({ size, center })
    } else if (type === Cylinder) {
      const height = props?.height ?? 1
      const radius = props?.radius ?? 1
      const center = props?.center ?? [0, 0, 0]
      g = primitives.cylinder({ height, radius, center })
    } else if (type === Sphere) {
      const radius = props?.radius ?? 1
      const center = props?.center ?? [0, 0, 0]
      g = primitives.sphere({ radius, center })
    } else if (type === RoundedCylinder) {
      const height = props?.height ?? 1
      const radius = props?.radius ?? 1
      const roundRadius = props?.roundRadius ?? 0.1
      const center = props?.center ?? [0, 0, 0]
      g = primitives.roundedCylinder({ height, radius, roundRadius, center })
    } else {
      const size = props?.size ?? [1, 1, 1]
      const roundRadius = props?.roundRadius ?? 0.1
      const center = props?.center ?? [0, 0, 0]
      g = primitives.roundedCuboid({ size, roundRadius, center })
    }
    return [{ geom: g, color: colorCtx ?? props?.color }]
  }

  // Component function: call it and render result
  if (typeof type === "function") {
    const out = type(props ?? {})
    return renderNode(out, colorCtx, renderCtx)
  }

  // Unknown type -> recurse
  return (children ?? []).flatMap((c) => renderNode(c, colorCtx, renderCtx))
}

export function render(root: VNode, jscad: typeof jscadModeling): RenderResult {
  jscad = withReferences(
    jscad as unknown as Parameters<typeof withReferences>[0],
  ) as unknown as typeof jscadModeling
  const geometries = renderNode(root, undefined, { jscad })
  return {
    geometries: geometries.map((entry) =>
      entry.material
        ? { ...entry, geom: { ...entry.geom, material: entry.material } }
        : entry,
    ),
  }
}

/** Collect names declared by model components while rendering their solids.
 * Features retain native geometry and a full model-space ancestor transform;
 * applying that matrix after sampling preserves out-of-plane 2D references.
 */
export function renderToJscadModel(
  root: VNode,
  jscad: typeof jscadModeling,
): JscadModel {
  jscad = withReferences(
    jscad as unknown as Parameters<typeof withReferences>[0],
  ) as unknown as typeof jscadModeling
  const referenceFeatures: Record<string, JscadReferenceFeature> =
    Object.create(null)
  const geometries = renderNode(root, undefined, {
    jscad,
    referenceFeatures,
    matrix: jscad.maths.mat4.create(),
  })
  return {
    geometries: geometries.map(({ geom, color }) => {
      if (color === undefined) return geom
      const { colors } = jscad
      const rgb =
        typeof color === "string"
          ? color.startsWith("#")
            ? colors.hexToRgb(
                /^#[\da-f]{3,4}$/i.test(color)
                  ? `#${[...color.slice(1)].map((c) => c + c).join("")}`
                  : color,
              )
            : colors.colorNameToRgb(color)
          : color
      if (!rgb) throw new Error(`Unknown JSCAD color "${color}"`)
      return colors.colorize(rgb, geom)
    }),
    referenceFeatures,
  }
}
