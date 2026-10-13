import { expect } from "bun:test"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { renderModelSnapshot } from "./render-model-snapshot"

/** Standard four-view plate shared by the industrial catalog regression tests. */
export async function assertIndustrialSnapshot({
  name,
  modelString,
  mesh,
  color,
  additionalMeshes,
}: {
  name: string
  modelString: string
  mesh: { positions: number[]; indices: number[] }
  color?: [number, number, number, number]
  additionalMeshes?: {
    mesh: { positions: number[]; indices: number[] }
    color: [number, number, number, number]
  }[]
}) {
  const min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < mesh.positions.length; i++) {
    const value = mesh.positions[i]!
    if (!Number.isFinite(value))
      throw new Error(`${name}: nonfinite mesh coordinate`)
    const axis = i % 3
    min[axis] = Math.min(min[axis]!, value)
    max[axis] = Math.max(max[axis]!, value)
  }
  const target = min.map((v, i) => (v + max[i]!) / 2) as [
    number,
    number,
    number,
  ]
  const span = Math.max(...max.map((v, i) => v - min[i]!)) * 1.7
  if (!Number.isFinite(span) || span <= 0)
    throw new Error(`${name}: empty mesh`)
  const eye = (x: number, y: number, z: number): [number, number, number] => [
    target[0] + x * span,
    target[1] + y * span,
    target[2] + z * span,
  ]
  const png = await renderModelSnapshot({
    mesh,
    color,
    additionalMeshes,
    title: name,
    modelString,
    footer: "Nominal assembly geometry / dimensions in mm",
    views: [
      {
        name: "ISOMETRIC",
        detail: "Complete model",
        eye: eye(1, -1, 1),
        target,
        span,
      },
      {
        name: "TOP",
        detail: "Looking down +Z",
        eye: eye(0, 0, 2),
        target,
        span,
      },
      {
        name: "FRONT",
        detail: "Looking along +Y",
        eye: eye(0, -2, 0),
        target,
        span,
      },
      {
        name: "SIDE",
        detail: "Looking along -X",
        eye: eye(2, 0, 0),
        target,
        span,
      },
    ],
  })
  const directory = join(import.meta.dir, "../snapshots/__snapshots__")
  const path = join(directory, `${name}.snap.png`)
  if (process.env.BUN_UPDATE_SNAPSHOTS === "1") {
    mkdirSync(directory, { recursive: true })
    writeFileSync(path, png)
  }
  expect(existsSync(path)).toBe(true)
  expect(Buffer.from(png).equals(readFileSync(path))).toBe(true)
}
