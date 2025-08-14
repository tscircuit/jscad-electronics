import { test, expect } from "bun:test"
import { readFile } from "node:fs/promises"
import path from "node:path"
import url from "node:url"

const distFileUrl = (rel: string) =>
  url.pathToFileURL(path.resolve(import.meta.dirname, rel)).href

test("vanilla bundle does not include react or jscad-fiber", async () => {
  const file = await readFile(new URL(distFileUrl("../dist/vanilla.js")))
  const txt = file.toString("utf8")
  expect(txt.includes('from "react"')).toBe(false)
  expect(txt.includes('from "react-dom"')).toBe(false)
  expect(txt.includes("react/jsx-runtime")).toBe(false)
  expect(txt.includes("jscad-fiber")).toBe(false)
})
