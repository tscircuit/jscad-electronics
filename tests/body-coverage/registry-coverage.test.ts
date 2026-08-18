import { test, expect } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { getFootprintNames } from "@tscircuit/footprinter"
import { importVanilla } from "../fixtures/importVanilla.js"
import { MISSING_BODIES, NO_BODY, probeFor } from "./footprint-probes"

/**
 * Coverage over footprinter's OWN registry, so the test cannot drift as
 * footprints are added: a new name with no body arrives as a failure here
 * rather than as a part that silently disappears from a 3D view.
 *
 * Three buckets, and a name in the wrong one fails:
 *   - NO_BODY         copper features; empty is correct
 *   - MISSING_BODIES  known gaps, each with a rendered snapshot beside it
 *   - everything else must build geometry
 */
test("every registered footprint is accounted for", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const built: string[] = []
  const empty: string[] = []
  const threw: Record<string, string> = {}

  for (const name of getFootprintNames()) {
    const probe = probeFor(name)
    try {
      const { geometries } = getJscadModelForFootprint(probe, jscadModeling)
      ;(geometries.flat(Infinity).length ? built : empty).push(name)
    } catch (error) {
      threw[name] = String((error as Error).message).split("\n")[0]!
    }
  }

  // A probe that footprinter rejects is a broken PROBE entry, not a missing
  // body. Keeping the two apart is the point: they have different causes.
  expect(threw).toEqual({})

  const unexpectedlyEmpty = empty.filter(
    (name) => !(name in MISSING_BODIES) && !NO_BODY.includes(name as never),
  )
  expect(unexpectedlyEmpty).toEqual([])

  // A gap that has been closed must leave the ledger, or the next reader
  // believes work is outstanding that is already done.
  const fixed = built.filter((name) => name in MISSING_BODIES)
  expect(fixed).toEqual([])

  const wronglyBodied = built.filter((name) => NO_BODY.includes(name as never))
  expect(wronglyBodied).toEqual([])
})
