/**
 * Creates a @jscad/modeling-compatible adapter backed by manifold-3d.
 *
 * This allows the vanilla renderer to use manifold as the geometry backend.
 * The adapter provides the subset of the @jscad/modeling API that the vanilla
 * renderer actually uses.
 *
 * Usage:
 *   import Module from 'manifold-3d';
 *   import { createManifoldJscadAdapter, getManifoldModelForFootprint } from 'jscad-electronics/vanilla';
 *
 *   const wasm = await Module();
 *   wasm.setup();
 *   const adapter = createManifoldJscadAdapter(wasm);
 *   const result = getManifoldModelForFootprint('0402', adapter);
 */

interface ManifoldToplevel {
  Manifold: any
  CrossSection: any
}

/** Wrapper for 3D manifold geometry with jscad-compatible lazy accessors */
class ManifoldGeom3 {
  _manifold: any
  _color?: [number, number, number]
  _polygonsCache?: any[]

  constructor(manifold: any, color?: [number, number, number]) {
    this._manifold = manifold
    this._color = color
  }

  get polygons() {
    if (this._polygonsCache) return this._polygonsCache
    const mesh = this._manifold.getMesh()
    const numProp = mesh.numProp
    const polygons: any[] = []

    for (let i = 0; i < mesh.numTri; i++) {
      const v0 = mesh.triVerts[i * 3]
      const v1 = mesh.triVerts[i * 3 + 1]
      const v2 = mesh.triVerts[i * 3 + 2]

      polygons.push({
        vertices: [
          [
            mesh.vertProperties[v0 * numProp],
            mesh.vertProperties[v0 * numProp + 1],
            mesh.vertProperties[v0 * numProp + 2],
          ],
          [
            mesh.vertProperties[v1 * numProp],
            mesh.vertProperties[v1 * numProp + 1],
            mesh.vertProperties[v1 * numProp + 2],
          ],
          [
            mesh.vertProperties[v2 * numProp],
            mesh.vertProperties[v2 * numProp + 1],
            mesh.vertProperties[v2 * numProp + 2],
          ],
        ],
      })
    }

    this._polygonsCache = polygons
    return polygons
  }

  get transforms() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  get color() {
    return this._color
  }
}

/** Wrapper for 2D cross-section geometry with jscad-compatible lazy accessors */
class ManifoldGeom2 {
  _crossSection: any
  _color?: [number, number, number]
  _sidesCache?: any[]

  constructor(crossSection: any, color?: [number, number, number]) {
    this._crossSection = crossSection
    this._color = color
  }

  get sides() {
    if (this._sidesCache) return this._sidesCache
    const polygons = this._crossSection.toPolygons()
    const sides: [number, number][][] = []

    for (const polygon of polygons) {
      for (let i = 0; i < polygon.length; i++) {
        const next = (i + 1) % polygon.length
        sides.push([
          [polygon[i][0], polygon[i][1]],
          [polygon[next][0], polygon[next][1]],
        ])
      }
    }

    this._sidesCache = sides
    return sides
  }

  get transforms() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  }

  get color() {
    return this._color
  }
}

function normalizeSize(
  size: number | [number, number, number],
): [number, number, number] {
  if (typeof size === "number") return [size, size, size]
  return size
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/**
 * Create a @jscad/modeling-compatible adapter from an initialized manifold-3d
 * WASM module. The result can be passed to the vanilla renderer's render()
 * or to getManifoldModelForFootprint().
 */
export function createManifoldJscadAdapter(wasm: ManifoldToplevel): any {
  const { Manifold, CrossSection } = wasm

  function makeCentered(m: any, center?: [number, number, number]) {
    if (center && (center[0] !== 0 || center[1] !== 0 || center[2] !== 0)) {
      return new ManifoldGeom3(m.translate(center))
    }
    return new ManifoldGeom3(m)
  }

  return {
    primitives: {
      cube({
        size,
        center,
      }: { size: number | [number, number, number]; center?: any }) {
        const s = normalizeSize(size)
        return makeCentered(Manifold.cube(s, true), center)
      },

      cuboid({
        size,
        center,
      }: { size: [number, number, number]; center?: any }) {
        return makeCentered(Manifold.cube(size, true), center)
      },

      sphere({ radius, center }: { radius: number; center?: any }) {
        return makeCentered(Manifold.sphere(radius, 0), center)
      },

      cylinder({
        height,
        radius,
        center,
      }: { height: number; radius: number; center?: any }) {
        return makeCentered(
          Manifold.cylinder(height, radius, -1, 0, true),
          center,
        )
      },

      roundedCuboid({
        size,
        roundRadius,
        center,
      }: { size: [number, number, number]; roundRadius: number; center?: any }) {
        const [sx, sy, sz] = size
        const r = Math.min(roundRadius, sx / 2, sy / 2, sz / 2)
        if (r <= 0) {
          return makeCentered(Manifold.cube(size, true), center)
        }
        const hx = sx / 2 - r
        const hy = sy / 2 - r
        const hz = sz / 2 - r
        const corners: any[] = []
        for (const dx of [-1, 1]) {
          for (const dy of [-1, 1]) {
            for (const dz of [-1, 1]) {
              corners.push(
                Manifold.sphere(r, 16).translate(dx * hx, dy * hy, dz * hz),
              )
            }
          }
        }
        return makeCentered(Manifold.hull(corners), center)
      },

      roundedCylinder({
        height,
        radius,
        roundRadius,
        center,
      }: { height: number; radius: number; roundRadius: number; center?: any }) {
        const r = Math.min(roundRadius, radius, height / 2)
        if (r <= 0) {
          return makeCentered(
            Manifold.cylinder(height, radius, -1, 0, true),
            center,
          )
        }
        const segs = 8
        const points: [number, number][] = []
        for (let i = 0; i <= segs; i++) {
          const angle = -Math.PI / 2 + (Math.PI / 2) * (i / segs)
          points.push([
            radius - r + r * Math.cos(angle),
            -height / 2 + r + r * Math.sin(angle),
          ])
        }
        for (let i = 0; i <= segs; i++) {
          const angle = (Math.PI / 2) * (i / segs)
          points.push([
            radius - r + r * Math.cos(angle),
            height / 2 - r + r * Math.sin(angle),
          ])
        }
        points.push([0, height / 2])
        points.push([0, -height / 2])
        const cs = new CrossSection([points])
        return makeCentered(cs.revolve(), center)
      },

      polygon({ points }: { points: [number, number][] }) {
        return new ManifoldGeom2(new CrossSection([points]))
      },

      rectangle({ size }: { size: [number, number] }) {
        return new ManifoldGeom2(CrossSection.square(size, true))
      },

      circle({ radius }: { radius: number }) {
        return new ManifoldGeom2(CrossSection.circle(radius))
      },
    },

    booleans: {
      union(...argsOrArray: any[]) {
        const geoms = Array.isArray(argsOrArray[0])
          ? argsOrArray[0]
          : argsOrArray
        if (geoms.length === 0) return new ManifoldGeom3(Manifold.cube([0, 0, 0]))
        if (geoms.length === 1) return geoms[0]
        let result = geoms[0]._manifold
        for (let i = 1; i < geoms.length; i++) {
          result = result.add(geoms[i]._manifold)
        }
        return new ManifoldGeom3(result)
      },

      subtract(base: any, others: any) {
        const otherArray = Array.isArray(others) ? others : [others]
        let result = base._manifold
        for (const o of otherArray) {
          result = result.subtract(o._manifold)
        }
        return new ManifoldGeom3(result, base._color)
      },
    },

    hulls: {
      hull(...argsOrArray: any[]) {
        const geoms = Array.isArray(argsOrArray[0])
          ? argsOrArray[0]
          : argsOrArray
        const manifolds = geoms.map((g: any) => g._manifold)
        return new ManifoldGeom3(Manifold.hull(manifolds))
      },
    },

    geometries: {
      geom2: {
        fromPoints(points: [number, number][]) {
          return new ManifoldGeom2(new CrossSection([points]))
        },
      },
    },

    extrusions: {
      extrudeLinear({ height }: { height: number }, geometry: any) {
        if (geometry._crossSection) {
          return new ManifoldGeom3(geometry._crossSection.extrude(height))
        }
        if (geometry._manifold) {
          const cs = geometry._manifold.project()
          return new ManifoldGeom3(cs.extrude(height))
        }
        throw new Error("extrudeLinear: unsupported geometry type")
      },
    },

    transforms: {
      translate(vector: [number, number, number], object: any) {
        if (object._manifold) {
          return new ManifoldGeom3(
            object._manifold.translate(vector),
            object._color,
          )
        }
        if (object._crossSection) {
          return new ManifoldGeom2(
            object._crossSection.translate([vector[0], vector[1]]),
            object._color,
          )
        }
        throw new Error("translate: unsupported geometry type")
      },

      rotateX(angle: number, object: any) {
        if (object._manifold) {
          return new ManifoldGeom3(
            object._manifold.rotate([radToDeg(angle), 0, 0]),
            object._color,
          )
        }
        return object
      },

      rotateY(angle: number, object: any) {
        if (object._manifold) {
          return new ManifoldGeom3(
            object._manifold.rotate([0, radToDeg(angle), 0]),
            object._color,
          )
        }
        return object
      },

      rotateZ(angle: number, object: any) {
        if (object._manifold) {
          return new ManifoldGeom3(
            object._manifold.rotate([0, 0, radToDeg(angle)]),
            object._color,
          )
        }
        if (object._crossSection) {
          return new ManifoldGeom2(
            object._crossSection.rotate(radToDeg(angle)),
            object._color,
          )
        }
        return object
      },
    },
  }
}
