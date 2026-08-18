import { test, expect } from "bun:test"
import * as jscadModeling from "@jscad/modeling"
import { importVanilla } from "../fixtures/importVanilla.js"

/**
 * Is the body the right SIZE for the package it is named after?
 *
 * Separate from `body-envelope.test.ts`, which asks the same question about
 * height. Both exist because a body can be plausible and wrong: `sod110`
 * rendered a SOD-123W (2.60 x 1.70) for a package that is 2.10 x 1.40, and it
 * looked perfectly reasonable — a diode, on its pads, the right shape.
 *
 * The reference is KiCad's F.Fab layer, which is drawn at the package outline,
 * from the library shipped with KiCad. That is the same reference footprinter's
 * own kicad-parity tests compare land patterns against, so the two halves of a
 * part now answer to one source.
 *
 *   bun -e 'grep the F.Fab lines of <name>.kicad_mod' — see the note in
 *   tests/body-coverage/README.md for how these were extracted.
 *
 * NOT derived from the pads: a land pattern is not the package. SOD-323 and
 * SOD-323W share a body and differ only in copper; `sod110`'s pads happen to
 * match KiCad's exactly while its body did not.
 */
const PACKAGE_OUTLINE_MM: Record<string, [number, number]> = {
  // two-terminal
  sod110: [2.1, 1.4], // D_SOD-110
  sod123w: [2.6, 1.7], // Nexperia_CFP3_SOD-123W
  sod128: [3.8, 2.5], // D_SOD-128
  sod323: [1.8, 1.4], // D_SOD-323
  sod323w: [1.8, 1.4], // same body as SOD-323; the "W" is a wider land
  sod882: [1.0, 0.6], // D_SOD-882
  sod882d: [1.0, 0.6], // D_SOD-882D — same body as SOD-882
  smb: [4.6, 4.0], // D_SMB (DO-214AA)
  smbf: [4.6, 4.0], // flat variant of the same outline
  led2835: [3.5, 2.8], // LED_PLCC_2835

  // SOT / SC-70
  sot: [1.6, 2.9], // SOT-23-6
  sot23: [1.3, 2.9], // SOT-23
  sot25: [1.6, 2.9], // SOT-23-5
  sot343: [1.25, 2.0], // SOT-343_SC-70-4
  sot89: [2.5, 4.5], // SOT-89-3
  sot563: [1.2, 1.6], // SOT-563
}

/**
 * The moulded body is the largest single solid in every one of these parts —
 * leads, tabs and end caps are all smaller. Measuring that rather than the
 * whole model keeps leads out of the number, which is what makes it comparable
 * with a package outline.
 *
 * That is a property of the parts in the table, not a general rule, and it is
 * why the table is limited to packages built as one moulded block. It is also
 * why anything whose body is assembled from several solids, or dominated by a
 * tab, stays out: see PACKAGES_WITHOUT_AN_OUTLINE below.
 */
const measureBodyOutline = (
  geometries: Array<{ geom: unknown }>,
): [number, number] => {
  let body: unknown = null
  let largest = -1
  for (const { geom } of geometries) {
    const volume = jscadModeling.measurements.measureVolume(geom as never)
    if (volume > largest) {
      largest = volume
      body = geom
    }
  }
  const [min, max] = jscadModeling.measurements.measureBoundingBox(
    body as never,
  )
  return [max[0]! - min[0]!, max[1]! - min[1]!]
}

/**
 * Deliberately absent, so the gaps are a decision rather than an oversight:
 *
 * - `bga`, `lga`, `mlp`, `quad`, `son`, `wson`, `vson`, `qfn`, `dfn` —
 *   footprinter's name states a PIN COUNT, not a package. `bga64` and `lga14`
 *   exist in many body sizes, so there is no outline to assert against; their
 *   bodies come from the footprint's own `w`/`h`, which is the only statement
 *   of size available.
 * - `dpak`/`to252`, `to263`/`d2pak`, `to220`, `to92*` — the body is not the
 *   largest solid (a tab or a lead frame competes), and KiCad's outline for
 *   these covers the whole part including formed leads. Their heights are
 *   asserted in body-envelope.test.ts instead.
 * - `electrolytic`, `radial`, `potentiometer`, `smdpushbutton`,
 *   `breakoutheaders` — no fixed package: the size comes from the footprint's
 *   own parameters (`d`, `p`, `w`, `ca`), which is what the body already uses.
 * - `soic`, `sop8`, `ssop` — the SOIC component derives its width as
 *   0.55 x pad span, giving 2.92 x 4.61 for a SOIC-8 that is 3.90 x 4.90.
 *   Left failing-by-omission on purpose: fixing it needs a per-pin-count
 *   table (SOIC-8/14/16, narrow and wide), and footprinter's `ssop20` is
 *   1.27mm pitch where a real SSOP-20 is 0.65mm, so the footprint contradicts
 *   its own name.
 */
const PACKAGES_WITHOUT_AN_OUTLINE = [
  "bga",
  "lga",
  "mlp",
  "quad",
  "soic",
  "sop8",
  "ssop",
  "to252",
  "to263",
]

test("a body's outline matches the package it is named after", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const wrong: Record<string, string> = {}
  for (const [footprint, [width, length]] of Object.entries(
    PACKAGE_OUTLINE_MM,
  )) {
    const { geometries } = getJscadModelForFootprint(footprint, jscadModeling)
    if (!geometries.length) {
      wrong[footprint] = "no geometry"
      continue
    }
    const [x, y] = measureBodyOutline(geometries)
    // 0.05mm. The first version of this test allowed 0.15, which is wider than
    // the very regression it was written for: the old SOD-323 body was out by
    // 0.10 and 0.15, so it would have passed. A tolerance has to be smaller
    // than the error it exists to catch. Every body here currently matches to
    // within 0.02.
    if (Math.abs(x - width) > 0.05 || Math.abs(y - length) > 0.05) {
      wrong[footprint] =
        `${x.toFixed(2)} x ${y.toFixed(2)}, expected ${width} x ${length}`
    }
  }

  expect(wrong).toEqual({})
  // Keeps the exclusion list honest: a name cannot be in both.
  for (const name of PACKAGES_WITHOUT_AN_OUTLINE) {
    expect(PACKAGE_OUTLINE_MM[name]).toBeUndefined()
  }
})

/**
 * Every lead has to reach its body.
 *
 * `SmdChipLead` draws from its anchor INWARD, so a lead anchored outboard of
 * its pad ends short of the body face. On the pad-driven packages that left
 * 0.125mm of daylight on SC-70-4 and 0.215mm on SOT-23-6 — legs hanging in
 * space beside a part. It is obvious in a render and invisible in a bounding
 * box, which is why it needs a number.
 */
test("a lead reaches the body it belongs to", async () => {
  const { getJscadModelForFootprint } = await importVanilla()

  const floating: Record<string, string> = {}
  for (const footprint of ["sot", "sot343"]) {
    const { geometries } = getJscadModelForFootprint(footprint, jscadModeling)
    const geoms = geometries.map(({ geom }: { geom: never }) => geom)

    let body = geoms[0]
    let largest = -1
    for (const geom of geoms) {
      const volume = jscadModeling.measurements.measureVolume(geom as never)
      if (volume > largest) {
        largest = volume
        body = geom
      }
    }
    const [bodyMin, bodyMax] = jscadModeling.measurements.measureBoundingBox(
      body as never,
    )

    let worst = 0
    for (const geom of geoms) {
      if (geom === body) continue
      const [min, max] = jscadModeling.measurements.measureBoundingBox(
        geom as never,
      )
      const gap =
        max[0]! < bodyMin[0]!
          ? bodyMin[0]! - max[0]!
          : min[0]! > bodyMax[0]!
            ? min[0]! - bodyMax[0]!
            : 0
      worst = Math.max(worst, gap)
    }
    if (worst > 0.01) {
      floating[footprint] =
        `${worst.toFixed(3)}mm of daylight between lead and body`
    }
  }

  expect(floating).toEqual({})
})
