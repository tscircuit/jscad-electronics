import { test, expect } from "bun:test"
import path from "node:path"
import url from "node:url"

const distFileUrl = (rel: string) =>
  url.pathToFileURL(path.resolve(import.meta.dirname, rel)).href

// Minimal smoke test: vanilla API returns some geometries for a known footprint

test("vanilla smoke: soic8 returns geometries", async () => {
  const mod = await import(distFileUrl("../dist/vanilla.js"))
  const getJscadModelForFootprint = (mod as any).getJscadModelForFootprint as
    | undefined
    | ((fp: string) => { geometries: any[] })
  expect(typeof getJscadModelForFootprint).toBe("function")

  const res = getJscadModelForFootprint!("soic8")
  expect(res && Array.isArray(res.geometries)).toBe(true)
  expect(res.geometries.length).toBeGreaterThan(0)
})
