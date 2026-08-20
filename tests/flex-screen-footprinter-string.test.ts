import { describe, expect, test } from "bun:test"
import {
  isFlexScreenFootprinterString,
  parseFlexScreenFootprinterString,
} from "../lib/parseFlexScreenFootprinterString"

describe("flexscreen footprinter strings", () => {
  test("parses a 20 mm above-board fold with a separate outset", () => {
    expect(
      parseFlexScreenFootprinterString(
        "flexscreen_w40mm_h22.5mm_flex60mm_foldsabove_distance20mm_foldstart9mm_outset6mm_conductors10",
      ),
    ).toEqual({
      width: 40,
      height: 22.5,
      flexCableLength: 60,
      orientation: "foldedToFaceAboveBoard",
      distanceAboveBoard: 20,
      foldDistanceFromConnector: 9,
      foldOutset: 6,
      conductorCount: 10,
    })
  })

  test("maps relative distance to the below-board side", () => {
    expect(
      parseFlexScreenFootprinterString(
        "flexscreen_diag2in_ratio4x3_foldsbelow_distance0.25in",
      ),
    ).toMatchObject({
      diagonal: 50.8,
      aspectRatio: "4:3",
      orientation: "foldedToFaceBelowBoard",
      distanceBelowBoard: 6.35,
    })
  })

  test("supports display flags and colors", () => {
    expect(
      parseFlexScreenFootprinterString(
        "flexscreen_sitsflat_hideconductors_screencolor(#112233)",
      ),
    ).toMatchObject({
      orientation: "sitsFlat",
      showConductors: false,
      screenColor: "#112233",
    })
  })

  test("rejects unknown tokens and ambiguous relative distance", () => {
    expect(() =>
      parseFlexScreenFootprinterString("flexscreen_sitsflat_distnace20mm"),
    ).toThrow('Unknown FlexScreen model token "distnace20mm"')
    expect(() =>
      parseFlexScreenFootprinterString("flexscreen_sitsflat_distance20mm"),
    ).toThrow('The "distance" token requires foldsabove or foldsbelow')
  })

  test("recognizes only the flexscreen model prefix", () => {
    expect(isFlexScreenFootprinterString("flexscreen")).toBe(true)
    expect(isFlexScreenFootprinterString("FlexScreen_w40mm")).toBe(true)
    expect(isFlexScreenFootprinterString("flexscreenish_w40mm")).toBe(false)
  })
})
