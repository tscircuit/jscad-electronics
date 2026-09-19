import { expect, test } from "bun:test"
import { createElement } from "react"
import { HF32FVPowerRelay } from "../../lib/PowerRelay"
import "../fixtures/png-matcher"
import { renderComponentContactSheet } from "../helpers/component-model"

test("HF32FV power relay", async () => {
  await expect(
    await renderComponentContactSheet(createElement(HF32FVPowerRelay)),
  ).toMatchPngSnapshot(import.meta.path, "power-relay-hf32fv")
}, 30000)
