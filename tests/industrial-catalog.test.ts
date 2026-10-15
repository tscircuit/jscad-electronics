import { expect, test } from "bun:test"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { mp } from "@tscircuit/modelprinter"
import { modelRendererRegistry } from "../lib/default-model-registry"
import catalog from "../docs/industrial-catalog.json"
import audit from "../docs/industrial-model-pr-audit.json"

test("industrial catalog provides exactly 100 distinct new paired model families", () => {
  expect(catalog).toHaveLength(100)
  expect(new Set(catalog.map((entry) => entry.name)).size).toBe(100)
  for (const group of new Set(catalog.map((entry) => entry.group)))
    expect(catalog.filter((entry) => entry.group === group)).toHaveLength(20)
  const excluded = new Set(audit.excludedModelFamilies)
  for (const entry of catalog) {
    expect(excluded.has(entry.name)).toBe(false)
    const definition = mp.string(entry.modelString).json()
    expect<unknown>(definition.fn).toBe(entry.name)
    const renderer = modelRendererRegistry.get(entry.name)
    expect(renderer).toBeDefined()
    expect(renderer!.pads).toBe("none")
    expect<unknown>(renderer!.schema.parse(definition)).toEqual(definition)
    expect(existsSync(join(import.meta.dir, "..", entry.example))).toBe(true)
    expect(existsSync(join(import.meta.dir, "..", entry.snapshot))).toBe(true)
    expect(existsSync(join(import.meta.dir, "..", entry.visualTest))).toBe(true)
  }
})
