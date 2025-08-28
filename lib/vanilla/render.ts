import {
  primitives,
  transforms,
  booleans,
  hulls,
  geometries,
  extrusions,
} from "@jscad/modeling"

import { Fragment, type VNode } from "./h"
import {
  Colorize,
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
  type Color,
} from "./primitives"

export type ColoredGeom = { geom: any; color?: Color }
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

function renderNode(node: any, colorCtx?: Color): ColoredGeom[] {
  if (node == null || node === false) return []
  if (Array.isArray(node)) return node.flatMap((n) => renderNode(n, colorCtx))

  // Already a geometry coming from user? ignore in our case
  if (!isVNode(node)) return []

  const { type, props, children } = node

  if (type === Fragment) {
    return (children ?? []).flatMap((c) => renderNode(c, colorCtx))
  }

  if (type === Colorize) {
    const newColor: Color = props?.color
    return (children ?? []).flatMap((c) => renderNode(c, newColor ?? colorCtx))
  }

  if (type === Translate) {
    const off = toVec3(
      props?.offset ?? { x: props?.x, y: props?.y, z: props?.z },
    )
    const geoms = (children ?? []).flatMap((c) => renderNode(c, colorCtx))
    return geoms.map(({ geom, color }) => ({
      geom: transforms.translate(off as any, geom),
      color: color ?? colorCtx,
    }))
  }

  if (type === Rotate) {
    const rot: [number, number, number] = Array.isArray(props?.rotation)
      ? [
          degToRad(props.rotation[0]),
          degToRad(props.rotation[1]),
          degToRad(props.rotation[2]),
        ]
      : [
          degToRad(props?.x ?? 0),
          degToRad(props?.y ?? 0),
          degToRad(props?.z ?? 0),
        ]
    const geoms = (children ?? []).flatMap((c) => renderNode(c, colorCtx))
    return geoms.map(({ geom, color }) => ({
      geom: transforms.rotateZ(
        rot[2],
        transforms.rotateY(rot[1], transforms.rotateX(rot[0], geom)),
      ),
      color,
    }))
  }

  if (type === Union || type === Subtract || type === Hull) {
    const geoms = (children ?? [])
      .flatMap((c) => renderNode(c, colorCtx))
      .map((g) => g.geom)
    if (geoms.length === 0) return []
    let geom: any
    if (type === Union) geom = booleans.union(geoms as any)
    else if (type === Subtract)
      geom = booleans.subtract(geoms[0] as any, geoms.slice(1) as any)
    else geom = hulls.hull(geoms as any)
    return [{ geom }]
  }

  if (type === Polygon) {
    const points: Array<[number, number]> = props?.points ?? []
    const g2 = geometries.geom2.fromPoints(points as any)
    return [{ geom: g2, color: colorCtx ?? props?.color }]
  }

  if (type === ExtrudeLinear) {
    const geoms2 = (children ?? [])
      .flatMap((c) => renderNode(c, colorCtx))
      .map((g) => g.geom)
    if (geoms2.length === 0) return []
    const base2 =
      geoms2.length > 1 ? (booleans.union as any)(geoms2) : geoms2[0]
    const height = props?.height ?? props?.h ?? 1
    let g3 = extrusions.extrudeLinear({ height }, base2)
    return [{ geom: g3, color: colorCtx ?? props?.color }]
  }

  if (
    type === Cuboid ||
    type === Cube ||
    type === Cylinder ||
    type === Sphere ||
    type === RoundedCuboid
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
    return renderNode(out, colorCtx)
  }

  // Unknown type -> recurse
  return (children ?? []).flatMap((c) => renderNode(c, colorCtx))
}

export function render(root: VNode): RenderResult {
  const geometries = renderNode(root)
  return { geometries }
}
