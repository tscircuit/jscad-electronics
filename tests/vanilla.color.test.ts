import { test, expect } from "bun:test"
import path from "node:path"
import url from "node:url"

const distFileUrl = (rel: string) =>
  url.pathToFileURL(path.resolve(import.meta.dirname, rel)).href

async function importVanilla() {
  const mod = await import(distFileUrl("../dist/vanilla.js"))
  if (typeof (mod as any).getJscadModelForFootprint !== "function") {
    throw new Error("getJscadModelForFootprint not found in dist/vanilla.js")
  }
  return mod as {
    getJscadModelForFootprint: (fp: string) => {
      geometries: Array<{ geom: any; color?: any }>
    }
  }
}

test("vanilla build preserves some color metadata (soic8)", async () => {
  const { getJscadModelForFootprint } = await importVanilla()
  const res = getJscadModelForFootprint("soic8")
  console.log(JSON.stringify(res, null, 2))
  const withColor = res.geometries.filter((g) => g.color != null)
  expect(withColor.length).toBeGreaterThan(0)
})
