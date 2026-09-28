import { expect, test } from "bun:test"
import { createElement } from "react"
import { lcc68Standard } from "../../examples/fixtures/lcc68-standard"
import { LCC68 } from "../../lib/LCC68"
import { renderComponentContactSheet } from "../helpers/component-model"
import "../fixtures/png-matcher"

test("LCC68: six-view package outline", async () => {
  await expect(
    await renderComponentContactSheet(createElement(LCC68, lcc68Standard)),
  ).toMatchPngSnapshot(import.meta.path, "lcc68-standard")
}, 30000)
