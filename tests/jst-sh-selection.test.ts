import { expect, test } from "bun:test"
import * as jscad from "@jscad/modeling"
import { importVanilla } from "./fixtures/importVanilla.js"
import { isJstShFootprint } from "../lib/JstSh"
test("generic connector selection requires the SH mounting layout", () => {
  expect(
    isJstShFootprint("jst12_smd_p1mm_pw0.6mm_pl1.55mm_mpx13.6mm_mpy2.525mm"),
  ).toBe(true)
  expect(isJstShFootprint("jst4_smd_p1mm_mpx9mm_mpy4mm")).toBe(false)
  expect(isJstShFootprint("jst4_smd_p2mm")).toBe(false)
})
